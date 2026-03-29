from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_database
from app.models.user import UserResponse, UserUpdate
from app.utils.auth import get_current_user_id

router = APIRouter()


def _serialize_user(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user_id: str = Depends(get_current_user_id)):
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(**_serialize_user(user))


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    update_fields = update_data.model_dump(exclude_none=True)
    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields to update",
        )

    result = await db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": update_fields},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    updated = await db.users.find_one({"_id": ObjectId(current_user_id)})
    return UserResponse(**_serialize_user(updated))
