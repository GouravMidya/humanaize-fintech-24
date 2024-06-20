# app/routers/query.py
# Contains the API route definitions for the application.
from fastapi import APIRouter
from datetime import datetime

from app.models.query import Query
from app.utils.logging import log_query
# from app.utils.setup import setup_components
from app.utils.memory_based_setup import setup_mem_components

router = APIRouter()

# Initialize necessary components
# retriever, rag_chain = setup_components()
conv_rag_chain = setup_mem_components()

@router.post("/api/query")
async def get_response(query: Query):
    question = query.query
    session_id = query.sessionId
    start_time = datetime.now()
    # docs = retriever.invoke(question)
    response = conv_rag_chain.invoke(
        {"input": question},
        config={"configurable": {"session_id": session_id}}
    )["answer"]
    print(response)
    end_time = datetime.now()
    time_taken = end_time - start_time
    log_query(question, response, time_taken, session_id)
    return {"response": response, "sessionId": session_id}
