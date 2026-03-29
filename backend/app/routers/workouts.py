from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import get_database
from app.models.workout import WorkoutCreate, WorkoutResponse, WorkoutUpdate
from app.utils.auth import get_current_user_id

router = APIRouter()


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("", response_model=List[WorkoutResponse])
async def list_workouts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    cursor = db.workouts.find({"user_id": current_user_id}).sort("date", -1).skip(skip).limit(limit)
    return [WorkoutResponse(**_serialize(doc)) async for doc in cursor]


@router.post("", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
async def create_workout(
    workout_data: WorkoutCreate,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    doc = workout_data.model_dump()
    doc["user_id"] = current_user_id
    doc["created_at"] = datetime.now(timezone.utc)

    result = await db.workouts.insert_one(doc)
    created = await db.workouts.find_one({"_id": result.inserted_id})
    return WorkoutResponse(**_serialize(created))


@router.get("/{workout_id}", response_model=WorkoutResponse)
async def get_workout(
    workout_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(workout_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")

    doc = await db.workouts.find_one({"_id": ObjectId(workout_id), "user_id": current_user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")
    return WorkoutResponse(**_serialize(doc))


@router.put("/{workout_id}", response_model=WorkoutResponse)
async def update_workout(
    workout_id: str,
    update_data: WorkoutUpdate,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(workout_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")

    update_fields = update_data.model_dump(exclude_none=True)
    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields to update",
        )

    result = await db.workouts.update_one(
        {"_id": ObjectId(workout_id), "user_id": current_user_id},
        {"$set": update_fields},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")

    updated = await db.workouts.find_one({"_id": ObjectId(workout_id)})
    return WorkoutResponse(**_serialize(updated))


@router.delete("/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workout(
    workout_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(workout_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")

    result = await db.workouts.delete_one(
        {"_id": ObjectId(workout_id), "user_id": current_user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")
