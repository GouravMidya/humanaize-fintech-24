# -*- coding: utf-8 -*-
"""
Created on Sat Jun  8 16:24:19 2024

@author: goura
"""
#%%
local_llm = 'llama3'

from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Use the "all-MiniLM-L6-v2" model for embeddings
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
persist_directory = 'chroma/'
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)

retriver = vectordb.as_retriever(search_type="mmr",search_kwargs={"k": 5})

#%%

from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from langchain import hub
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(model=local_llm,format="json",temperature=0)
prompt = PromptTemplate(
    template= """You are an assistant for question-answering tasks.Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know.
    Use six sentences maximum and keep the answer concise user
    Question: {question}
    Context: {context}
    assistant Helpful Answer:""",
    input_variables=["question","document"],
    )

rag_chain = prompt | llm | StrOutputParser()

#%%

question = "what is personal financial planning"
docs = retriver.invoke(question)
for doc in docs:
    print("\n\n")
    print(doc)
    
#%%

generation = rag_chain.invoke({"context":docs,"question":question})
print(generation)


# %%
