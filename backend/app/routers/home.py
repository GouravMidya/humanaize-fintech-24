# app/routers/home.py

from fastapi import APIRouter, Depends
from ..dependencies import get_current_user

router = APIRouter()

@router.get('/home')
async def get_home(current_user: dict = Depends(get_current_user)):
    return {"message": f"Welcome to the home page, {current_user['email']}"}
