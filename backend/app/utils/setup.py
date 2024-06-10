# app/utils/setup.py
# Contains utility functions for setting up necessary components for the application.
import os

from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from app.config import FOLDER_PATH

def setup_components():
    local_llm = 'phi3'  # llama3
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    persist_directory = os.path.join(FOLDER_PATH, "chroma/")
    vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    retriever = vectordb.as_retriever(search_type="mmr")
    llm = ChatOllama(model=local_llm, format="json", temperature=0)

    parser = JsonOutputParser()
    prompt = PromptTemplate(
        template="""You are an assistant for question-answering tasks.
        Use the following pieces of retrieved context to answer the question
        meaningfully. If you don't know the answer, just respond in json with 'no answer'.
        Use six sentences maximum and keep the answer concise
        {context}
        Question: {question}
        Respond in json with 'answer'""",
        input_variables=["question", "context"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    rag_chain = prompt | llm | parser

    return retriever, rag_chain
