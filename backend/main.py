import csv
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.output_parsers import JsonOutputParser
import os
from dotenv import load_dotenv

load_dotenv()
folder_path = os.getenv("folder_path")

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize necessary components
local_llm = 'phi3'  # llama3
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
persist_directory = folder_path+"/chroma/"
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
retriever = vectordb.as_retriever(search_type="mmr")
llm = ChatOllama(model=local_llm, format="json", temperature=0)

# Set up a parser + inject instructions into the prompt template.
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

class Query(BaseModel):
    query: str
    sessionId: str

@app.post("/api/query")
async def get_response(query: Query):
    question = query.query
    session_id = query.sessionId
    start_time = datetime.now()
    docs = retriever.invoke(question)
    generation = rag_chain.invoke({"context": docs, "question": question})
    end_time = datetime.now()
    time_taken = end_time - start_time
    current_date = datetime.now().strftime("_%d_%m_%y")
    log_file_name = f"log{current_date}.csv"
    log_file_path = os.path.join(folder_path, 'data', 'active', 'csvs', 'logs', log_file_name)
    
    # Check if the file already exists
    if not os.path.exists(log_file_path):
        # Create the file with the header
        with open(log_file_path, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['question', 'response', 'time_taken','session_id'])
    # Log the query, answer, and time taken in a CSV file
    with open(log_file_path, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([question, generation, time_taken,session_id])

    return {"response": generation, "sessionId": session_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
#uvicorn main:app --reload