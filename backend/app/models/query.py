# app/models/query.py
# Defines the Pydantic models for the application, which are used for data validation and serialization.
from pydantic import BaseModel

class Query(BaseModel):
    query: str
    sessionId: str
