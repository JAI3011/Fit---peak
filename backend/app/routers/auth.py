from datetime import datetime, timedelta, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.config import settings
from app.database import get_database
from app.models.user import UserCreate, UserResponse
from app.utils.auth import (
    create_access_token,
    get_current_user_id,
    get_password_hash,
    verify_password,
)

router = APIRouter()


def _serialize_user(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    db = get_database()
    existing = await db.users.find_one(
        {"$or": [{"email": user_data.email}, {"username": user_data.username}]}
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered",
        )

    hashed_password = get_password_hash(user_data.password)
    user_doc = user_data.model_dump(exclude={"password"})
    user_doc["hashed_password"] = hashed_password
    user_doc["created_at"] = datetime.now(timezone.utc)

    result = await db.users.insert_one(user_doc)
    created = await db.users.find_one({"_id": result.inserted_id})
    return UserResponse(**_serialize_user(created))


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    user = await db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user_id: str = Depends(get_current_user_id)):
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(**_serialize_user(user))
