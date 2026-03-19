from datetime import datetime, timezone
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import get_database
from app.models.exercise import ExerciseCreate, ExerciseResponse, ExerciseUpdate
from app.utils.auth import get_current_user_id

router = APIRouter()


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("", response_model=List[ExerciseResponse])
async def list_exercises(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    cursor = (
        db.exercises.find({"user_id": current_user_id})
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    return [ExerciseResponse(**_serialize(doc)) async for doc in cursor]


@router.post("", response_model=ExerciseResponse, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    exercise_data: ExerciseCreate,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    doc = exercise_data.model_dump()
    doc["user_id"] = current_user_id
    doc["created_at"] = datetime.now(timezone.utc)

    result = await db.exercises.insert_one(doc)
    created = await db.exercises.find_one({"_id": result.inserted_id})
    return ExerciseResponse(**_serialize(created))


@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(exercise_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")

    doc = await db.exercises.find_one(
        {"_id": ObjectId(exercise_id), "user_id": current_user_id}
    )
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")
    return ExerciseResponse(**_serialize(doc))


@router.put("/{exercise_id}", response_model=ExerciseResponse)
async def update_exercise(
    exercise_id: str,
    update_data: ExerciseUpdate,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(exercise_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")

    update_fields = update_data.model_dump(exclude_none=True)
    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields to update",
        )

    result = await db.exercises.update_one(
        {"_id": ObjectId(exercise_id), "user_id": current_user_id},
        {"$set": update_fields},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")

    updated = await db.exercises.find_one({"_id": ObjectId(exercise_id)})
    return ExerciseResponse(**_serialize(updated))


@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exercise(
    exercise_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(exercise_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")

    result = await db.exercises.delete_one(
        {"_id": ObjectId(exercise_id), "user_id": current_user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")
