# app/schemas.py

from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str

class Login(BaseModel):
    email: EmailStr
    password: str
