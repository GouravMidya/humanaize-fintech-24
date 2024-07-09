# app/routers/budget.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
from ..utils.budget_optimizer import optimize_budget

router = APIRouter()

class BudgetInput(BaseModel):
    income: int
    expenses: Dict[str, float]

@router.post("/optimize")
async def optimize_budget_route(budget_input: BudgetInput):
    try:
        result = optimize_budget(budget_input.income, budget_input.expenses)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))