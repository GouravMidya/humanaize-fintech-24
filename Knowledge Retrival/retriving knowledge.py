# -*- coding: utf-8 -*-
"""
Created on Sat Jun  8 11:28:44 2024

@author: goura
"""
#%%
from huggingface_hub import login

import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from the .env file

hugging_token = os.getenv('hugging_token')
#%%
login(token=hugging_token)

#%%
local_llm = 'llama3'
#%%

from langchain.vectorstores import Chroma

from langchain_huggingface import HuggingFaceEmbeddings

# Use the "all-MiniLM-L6-v2" model for embeddings
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
persist_directory = 'chroma/'
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)

#%%

retriver = vectordb.as_retriever(search_type="mmr",search_kwargs={"k": 10})

#%%

print(vectordb._collection.count())

#%%
question = "explain currency value?"
docs = vectordb.similarity_search(question,k=3)
len(docs)

#%%
for doc in docs:
    print("\n\n")
    print(doc)

#%%
docs_mmr = vectordb.max_marginal_relevance_search(question, k=3)
len(docs_mmr)

#%%
for doc in docs_mmr:
    print("\n\n")
    print(doc)

#%%
from langchain_community.chat_models import ChatOllama
llm = ChatOllama(model=local_llm,format="json",temperature=0)

# %% generate

from langchain.prompts import PromptTemplate
from langchain import hub
from langchain_core.output_parsers import StrOutputParser

prompt = PromptTemplate(
    template= """<|start_header_id|>system<|end_header_id|> You are an assistant for question-answering tasks.
    Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know.
    Use three sentences maximum and keep the answer concise <|eot_id|><|start_header_id|>user<|end_header_id|>
    Question: {question}
    Context: {context}
    <|eot_id|><|start_header_id|>assistant<|end_header_id|>""",
    input_variables=["question","document"],
    )

#%%

rag_chain = prompt | llm | StrOutputParser()

#%%
question = "what is weather like today"
#docs = retriver.invoke(question)
docs = vectordb.max_marginal_relevance_search(question, k=3)
for doc in docs:
    print("\n\n")
    print(doc)
print("Doc retrived, generating a response..")
generation = rag_chain.invoke({"context":docs,"question":question})
print(generation)


#%% compressed retrival
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(llm)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectordb.as_retriever(search_type = "mmr")
)

#%%
question = "what is inflation?"
compressed_docs = compression_retriever.get_relevant_documents(question)
for d in compressed_docs:
    print("\n\n")
    print(d)









