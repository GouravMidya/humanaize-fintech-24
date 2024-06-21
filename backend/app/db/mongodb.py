# app/db/mongodb.py
# Contains the MongoDB connection setup and management logic.
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client = AsyncIOMotorClient(settings.MONGO_DB_URI)
database = client.mydatabase
users_collection = database.get_collection("users")