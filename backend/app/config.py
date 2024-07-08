# app/config.py
#Contains configuration settings for the application, such as environment variables and CORS origins
import os
from dotenv import load_dotenv

load_dotenv()

FOLDER_PATH = os.getenv("FOLDER_PATH")
MONGO_DB_URL = os.getenv("MONGODB_URI")

ORIGINS = [
    "http://localhost:3000",  # React frontend
    # Add other origins if needed
]
