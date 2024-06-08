# -*- coding: utf-8 -*-
"""
Created on Sat Jun  8 10:37:40 2024

@author: goura
"""
import os

#%% document loading

from langchain.document_loaders import PyPDFLoader

loaders = [
    PyPDFLoader("data/01. Personal Finance  author The Saylor Foundation.pdf")
    ]

docs = []

for loader in loaders:
    docs.extend(loader.load())
    
#%% document splitting

from langchain.text_splitter import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size= 250,
    chunk_overlap= 25
    )

splits = text_splitter.split_documents(docs)

#%%
splits[0]
#%% Embeddings

from langchain_huggingface import HuggingFaceEmbeddings

# Use the "all-MiniLM-L6-v2" model for embeddings
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

#%% Vector Stores

from langchain.vectorstores import Chroma

persist_directory = 'chroma/'

vectordb = Chroma.from_documents(
    documents=splits,
    embedding=embedding,
    persist_directory=persist_directory
)
