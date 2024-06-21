# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .. import schemas, utils, models
from ..db import users_collection
from bson import ObjectId

router = APIRouter()

@router.post('/register', response_model=schemas.User)
async def register(user: schemas.UserCreate):
    user_in_db = await users_collection.find_one({"email": user.email})
    if user_in_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = utils.get_password_hash(user.password)
    user_dict = {"email": user.email, "hashed_password": hashed_password}
    new_user = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    return schemas.User(id=str(created_user["_id"]), email=created_user["email"])

@router.post('/login')
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not utils.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    access_token = utils.create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}
