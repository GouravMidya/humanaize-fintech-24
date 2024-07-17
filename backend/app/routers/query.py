# app/routers/query.py
# Contains the API route definitions for the application.
from fastapi import APIRouter
from datetime import datetime

from app.models.query import Query
from app.utils.logging import log_query
# from app.utils.setup import setup_components
from app.utils.memory_based_setup import setup_mem_components,save_session_history, get_financial_info

router = APIRouter()

# Initialize necessary components
# retriever, rag_chain = setup_components()
conv_rag_chain = setup_mem_components()

@router.post("/api/query")
async def get_response(query: Query):
    question = query.query
    session_id = query.sessionId
    user_id = query.userId
    start_time = datetime.now()
    
    # Fetch financial info
    financial_info = get_financial_info(user_id)
    
    # Set default values if financial info is not available
    financial_info = financial_info or {
        "monthlyIncome": "Not provided",
        "monthlyExpenses": "Not provided",
        "shortTermGoals": "Not provided",
        "longTermGoals": "Not provided",
        "riskTolerance": "Not provided",
        "age": "Not provided"
    }
    
    response = conv_rag_chain.invoke(
        {
            "input": question,
            "monthly_income": financial_info.get("monthlyIncome", "Not provided"),
            "monthly_expenses": financial_info.get("monthlyExpenses", "Not provided"),
            "short_term_goals": financial_info.get("shortTermGoals", "Not provided"),
            "long_term_goals": financial_info.get("longTermGoals", "Not provided"),
            "risk_tolerance": financial_info.get("riskTolerance", "Not provided"),
            "age": financial_info.get("age", "Not provided")
        },
        config={"configurable": {"session_id": session_id}}
    )["answer"]
    
    save_session_history(session_id)
    end_time = datetime.now()
    time_taken = end_time - start_time
    log_query(question, response, time_taken, session_id)
    return {"response": response, "sessionId": session_id}