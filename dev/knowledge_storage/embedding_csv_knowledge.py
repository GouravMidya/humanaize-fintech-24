# -*- coding: utf-8 -*-
"""
Created on Sun Jun  9 16:38:37 2024

@author: goura
"""
#%%
from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import pandas as pd
import os
from dev.utils.file_mover import move_files
from dotenv import load_dotenv

load_dotenv()
folder_path = os.getenv("folder_path")

#%%
def load_csvs_in_folder(loading_folder_path):
    all_splits = []
    count = 0
    for filename in os.listdir(loading_folder_path):
        if filename.endswith('.csv'):
            csv_path = os.path.join(loading_folder_path, filename)
            count += 1
            df = pd.read_csv(csv_path)
            df['Response'] = df['Response'].str.lower()
            df = df[df['Response'] != "{'answer': 'no answer'}"]
            splits = [f"Question: {row['Query']} {row['Response']}" for _, row in df.iterrows()]
            all_splits.extend(splits)
    print(f"{count} csv files loaded!")
    return all_splits
            
def add_csv_to_vectordb():
    """Adds all csv files in the specified directory to the vector database and shifts the file to archieve

    Returns:
        chroma: vector database object
    """
    # Use the "all-MiniLM-L6-v2" model for embeddings
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    persist_directory = 'chroma/'
    vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    splits = load_csvs_in_folder(folder_path+"/dev/data/active/csvs/logs/")
    vectordb.add_texts(
        texts=splits,
        metadatas=[{"source": "chat history"}] * len(splits),
        embedding=embedding
    )
    print("Csv files added to vector db!")
    move_files(folder_path+"/dev/data/active/csvs/logs/",folder_path+"/dev/data/archieve/csvs/logs/","csv")
    return vectordb

