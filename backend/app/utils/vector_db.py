# app/utils/vector_db.py

import warnings

# Suppress the specific FutureWarning from huggingface_hub
warnings.filterwarnings("ignore", category=FutureWarning, module="huggingface_hub.file_download")

from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import pandas as pd
import os
from .file_mover import move_files
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
folder_path = os.getenv("FOLDER_PATH")

def extract_answer(response_string):
    if response_string.startswith("{'answer':") and response_string.endswith("}"):
        return response_string[12:-2]
    else:
        return "no answer"

def load_csvs_in_folder(loading_folder_path, current_log_file):
    all_splits = []
    count = 0
    for filename in os.listdir(loading_folder_path):
        if filename.endswith('.csv') and filename != current_log_file:
            csv_path = os.path.join(loading_folder_path, filename)
            count += 1
            df = pd.read_csv(csv_path)
            df['response'] = df['response'].apply(extract_answer)
            df = df[df['response'].str.lower() != "no answer"]
            splits = [f"{row['question']} {row['response']}" for _, row in df.iterrows()]
            all_splits.extend(splits)
    print(f"{count} csv files loaded!")
    return all_splits, count

def add_csv_to_vectordb():
    """Adds all CSV files except the current day's file to the vector database and shifts the file to archive.

    Returns:
        Chroma: vector database object
    """
    current_date = datetime.now().strftime("_%d_%m_%y")
    current_log_file = f"log{current_date}.csv"
    
    # Use the "all-MiniLM-L6-v2" model for embeddings
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    persist_directory = os.path.join(folder_path, 'chroma/')
    vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    
    splits, count = load_csvs_in_folder(os.path.join(folder_path, "data", "active", "csvs", "logs"), current_log_file)
    
    if count == 0:
        print("No previous CSV files to process.")
        return vectordb

    if not splits:
        print("No valid data found in previous CSV files.")
        return vectordb
    
    vectordb.add_texts(
        texts=splits,
        metadatas=[{"source": "chat history"}] * len(splits),
        embedding=embedding
    )
    print("CSV files added to vector db!")
    
    move_files(os.path.join(folder_path, "data", "active", "csvs", "logs"),
               os.path.join(folder_path, "data", "archive", "csvs", "logs"), "csv", exclude_file=current_log_file)
    return vectordb
