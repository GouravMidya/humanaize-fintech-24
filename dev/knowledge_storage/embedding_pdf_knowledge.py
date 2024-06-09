# -*- coding: utf-8 -*-
"""
Created on Sat Jun  8 10:37:40 2024

@author: gourav
"""
#%% Imports
import os
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from dev.utils.file_mover import move_files
from dotenv import load_dotenv

load_dotenv()
folder_path = os.getenv("folder_path")


#%% PDF Loader
def load_pdfs_in_folder(loading_folder_path):
    loaders = []
    docs = []
    count = 0
    
    text_splitter = RecursiveCharacterTextSplitter(
    chunk_size= 500,
    chunk_overlap= 25,
    separators=["\n\n", "\n", "(?<=\. )", " ", ""]
    )
    for filename in os.listdir(loading_folder_path):
        if filename.endswith('.pdf'):
            count += 1
            pdf_path = os.path.join(loading_folder_path, filename)
            #print(pdf_path)
            loaders.append(PyPDFLoader(pdf_path))
    print(count+"Files found, Starting Loading..")
    for loader in loaders:
        docs.extend(loader.load())
    splits = text_splitter.split_documents(docs)
    print("Splitting complete..")
    return splits

def make_with_pdf_new_vectordb():
    """
    Creates new vector database with the pdf files in specified directory and shifts them to archieve directory
    """
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    persist_directory = 'chroma/'
    
    splits = load_pdfs_in_folder(folder_path+"/dev/data/active/pdfs")
    print("Loading splits in a new vector db")
    vectordb = Chroma.from_documents(
        documents=splits,
        embedding=embedding,
        persist_directory=persist_directory
    )
    print("Vector db created!")
    move_files(folder_path+"/dev/data/active/pdfs/",folder_path+"/dev/data/archieve/pdfs/","pdf")
    return vectordb

def add_pdf_to_vectordb():
    """
    Add all pdf files from specified directory to the already existing vector database and shifts them to archieve directory
    """
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    persist_directory = 'chroma/'
    
    splits = load_pdfs_in_folder(folder_path+"/dev/data/active/pdfs")
    print("Loading splits to the vector db")
    vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    vectordb.add_documents(splits)
    print("New knowledge added to vector db!")
    move_files(folder_path+"/dev/data/active/pdfs/",folder_path+"/dev/data/archieve/pdfs/","pdf")
    return vectordb
