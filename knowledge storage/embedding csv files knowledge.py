# -*- coding: utf-8 -*-
"""
Created on Sun Jun  9 16:38:37 2024

@author: goura
"""
#%%
from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Use the "all-MiniLM-L6-v2" model for embeddings
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
persist_directory = 'chroma/'
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)

#%%
import pandas as pd
df = pd.read_csv('log_9_6_24_2.csv')
#%% Convert answer column values to lowercase
df['Response'] = df['Response'].str.lower()
#%% Filter out the responses with no answer
df_cleaned = df[df['Response'] != "{'answer': 'no answer'}"]
#%% adding cleaned data
splits = [f"Question: {row['Query']} {row['Response']}" for _, row in df_cleaned.iterrows()]
#%% Checking format
splits[0]
#%% Append to existing db
vectordb.add_texts(
    texts=splits,
    metadatas=[{"source": "chat history"}] * len(splits),
    embedding=embedding
)
#%%
retriver = vectordb.as_retriever(search_type="mmr")
#%%
question="What should I consider when planning for my child's education?"
retriver.invoke(question)
