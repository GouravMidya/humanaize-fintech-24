# app/routers/query.py
# Contains the API route definitions for the application.
from fastapi import APIRouter
from datetime import datetime

from app.models.query import Query
from app.utils.logging import log_query
from app.utils.setup import setup_components

router = APIRouter()

# Initialize necessary components
retriever, rag_chain = setup_components()

@router.post("/api/query")
async def get_response(query: Query):
    question = query.query
    session_id = query.sessionId
    start_time = datetime.now()
    docs = retriever.invoke(question)
    generation = rag_chain.invoke({"context": docs, "question": question})
    end_time = datetime.now()
    time_taken = end_time - start_time
    log_query(question, generation, time_taken, session_id)
    return {"response": generation, "sessionId": session_id}
