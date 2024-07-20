from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

# Environment variable for MongoDB connection
MONGO_DB_URL = os.getenv("MONGODB_URI")

# Connect to MongoDB
mongo_client = MongoClient(MONGO_DB_URL)
db = mongo_client["chat_db"]
collection = db["chat_history"]

router = APIRouter()

class ChatMessage(BaseModel):
    type: str
    content: str

class ChatSession(BaseModel):
    session_id: str
    history: List[ChatMessage]

@router.get("/chat/{session_id}", response_model=ChatSession)
def get_chat_session(session_id: str):
    chat_history_data = collection.find_one({"session_id": session_id})
    if not chat_history_data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    history = [
        ChatMessage(type=msg["type"], content=msg["content"])
        for msg in chat_history_data.get("history", [])
    ]
    return ChatSession(session_id=session_id, history=history)
