# app/main.py
# The main entry point of the application, where the FastAPI app instance is created and configured.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import ORIGINS
from .routers.query import router as query_router
#from .dependencies.database import connect_to_mongo, close_mongo_connection

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(query_router)

# Startup and shutdown events for MongoDB
#app.add_event_handler("startup", connect_to_mongo)
#app.add_event_handler("shutdown", close_mongo_connection)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# To run the file cd to backend then type:
# uvicorn app.main:app --reload  