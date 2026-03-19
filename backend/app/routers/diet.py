from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import get_database
from app.models.diet import DietEntryCreate, DietEntryResponse, DietEntryUpdate
from app.utils.auth import get_current_user_id

router = APIRouter()


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("", response_model=List[DietEntryResponse])
async def list_diet_entries(
    date: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    query: dict = {"user_id": current_user_id}

    if date:
        try:
            day_start = datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid date format. Use YYYY-MM-DD",
            )
        day_end = datetime(day_start.year, day_start.month, day_start.day, 23, 59, 59)
        query["date"] = {"$gte": day_start, "$lte": day_end}

    cursor = db.diet.find(query).sort("date", -1).skip(skip).limit(limit)
    return [DietEntryResponse(**_serialize(doc)) async for doc in cursor]


@router.post("", response_model=DietEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_diet_entry(
    entry_data: DietEntryCreate,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    doc = entry_data.model_dump()
    doc["user_id"] = current_user_id
    doc["created_at"] = datetime.now(timezone.utc)

    result = await db.diet.insert_one(doc)
    created = await db.diet.find_one({"_id": result.inserted_id})
    return DietEntryResponse(**_serialize(created))


@router.get("/{entry_id}", response_model=DietEntryResponse)
async def get_diet_entry(
    entry_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(entry_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diet entry not found")

    doc = await db.diet.find_one({"_id": ObjectId(entry_id), "user_id": current_user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diet entry not found")
    return DietEntryResponse(**_serialize(doc))


@router.put("/{entry_id}", response_model=DietEntryResponse)
async def update_diet_entry(
    entry_id: str,
    update_data: DietEntryUpdate,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(entry_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diet entry not found")

    update_fields = update_data.model_dump(exclude_none=True)
    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields to update",
        )

    result = await db.diet.update_one(
        {"_id": ObjectId(entry_id), "user_id": current_user_id},
        {"$set": update_fields},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diet entry not found")

    updated = await db.diet.find_one({"_id": ObjectId(entry_id)})
    return DietEntryResponse(**_serialize(updated))


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diet_entry(
    entry_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(entry_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diet entry not found")

    result = await db.diet.delete_one(
        {"_id": ObjectId(entry_id), "user_id": current_user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diet entry not found")
