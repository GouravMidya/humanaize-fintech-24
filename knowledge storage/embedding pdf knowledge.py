# -*- coding: utf-8 -*-
"""
Created on Sat Jun  8 10:37:40 2024

@author: goura
"""

#%%
import os
from langchain.document_loaders import PyPDFLoader,PyMuPDFLoader

def load_pdfs_in_folder(folder_path):
    pdfs = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.pdf'):
            pdf_path = os.path.join(folder_path, filename)
            #print(pdf_path)
            pdfs.append(PyPDFLoader(pdf_path))
    return pdfs

#%% document loading

folder_path = 'data'
loaders = load_pdfs_in_folder(folder_path)

#%%
docs = []

for loader in loaders:
    docs.extend(loader.load())


#%% document splitting

from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size= 500,
    chunk_overlap= 25,
    separators=["\n\n", "\n", "(?<=\. )", " ", ""]
    )

splits = text_splitter.split_documents(docs)

#%%
#print(docs[2].page_content)
splits[450].page_content
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
