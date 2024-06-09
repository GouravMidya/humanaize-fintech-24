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
persist_directory = "C:/Users/goura/Documents/humanaize fintech 24/chroma/"
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
retriever = vectordb.as_retriever(search_type="mmr")
llm = ChatOllama(model=local_llm, format="json", temperature=0)

prompt = PromptTemplate(
    template="""You are an assistant for question-answering tasks.
    Use the following pieces of retrieved context to answer the question
    meaningfully. If you don't know the answer, just say that you don't know.
    Use six sentences maximum and keep the answer concise and respond in
    json
    {context}
    Question: {question}
    Helpful Answer:""",
    input_variables=["question", "context"],
)

rag_chain = prompt | llm | StrOutputParser()

class Query(BaseModel):
    query: str

@app.post("/api/query")
async def get_response(query: Query):
    question = query.query
    start_time = datetime.now()
    docs = retriever.invoke(question)
    generation = rag_chain.invoke({"context": docs, "question": question})
    end_time = datetime.now()
    time_taken = end_time - start_time

    # Log the query, answer, and time taken in a CSV file
    with open('logs/log.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([question, generation, time_taken])

    return {"response": generation}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
#uvicorn main:app --reload
