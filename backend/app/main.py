# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import ORIGINS
from .routers.query import router as query_router
from .routers.budget import router as budget_router
from .routers.chat import router as chat_router

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
app.include_router(budget_router, prefix="/budget", tags=["budget"])
app.include_router(chat_router, tags=["chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# To run the file cd to backend then type:
# uvicorn app.main:app --reload  