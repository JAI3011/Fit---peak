from datetime import datetime, timezone
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import get_database
from app.models.progress import (
    ProgressRecordCreate,
    ProgressRecordResponse,
    ProgressRecordUpdate,
    ProgressSummary,
)
from app.utils.auth import get_current_user_id

router = APIRouter()


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/summary", response_model=ProgressSummary)
async def get_progress_summary(current_user_id: str = Depends(get_current_user_id)):
    db = get_database()
    total = await db.progress.count_documents({"user_id": current_user_id})
    latest_doc = await db.progress.find_one(
        {"user_id": current_user_id}, sort=[("date", -1)]
    )

    if not latest_doc:
        return ProgressSummary(total_records=total)

    return ProgressSummary(
        latest_weight_kg=latest_doc.get("weight_kg"),
        latest_body_fat_percentage=latest_doc.get("body_fat_percentage"),
        latest_chest_cm=latest_doc.get("chest_cm"),
        latest_waist_cm=latest_doc.get("waist_cm"),
        latest_hips_cm=latest_doc.get("hips_cm"),
        total_records=total,
        latest_record_date=latest_doc.get("date"),
    )


@router.get("", response_model=List[ProgressRecordResponse])
async def list_progress_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    cursor = (
        db.progress.find({"user_id": current_user_id})
        .sort("date", -1)
        .skip(skip)
        .limit(limit)
    )
    return [ProgressRecordResponse(**_serialize(doc)) async for doc in cursor]


@router.post("", response_model=ProgressRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_progress_record(
    record_data: ProgressRecordCreate,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    doc = record_data.model_dump()
    doc["user_id"] = current_user_id
    doc["created_at"] = datetime.now(timezone.utc)

    result = await db.progress.insert_one(doc)
    created = await db.progress.find_one({"_id": result.inserted_id})
    return ProgressRecordResponse(**_serialize(created))


@router.get("/{record_id}", response_model=ProgressRecordResponse)
async def get_progress_record(
    record_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_database()
    if not ObjectId.is_valid(record_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Progress record not found"
        )

    doc = await db.progress.find_one(
        {"_id": ObjectId(record_id), "user_id": current_user_id}
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Progress record not found"
        )
    return ProgressRecordResponse(**_serialize(doc))
