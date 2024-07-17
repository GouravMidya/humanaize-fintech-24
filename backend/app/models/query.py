from pydantic import BaseModel

class Query(BaseModel):
    query: str
    sessionId: str
    userId: str