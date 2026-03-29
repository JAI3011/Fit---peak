from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.user import PyObjectId


class ProgressRecordBase(BaseModel):
    weight_kg: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    hips_cm: Optional[float] = None
    date: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    notes: Optional[str] = None


class ProgressRecordCreate(ProgressRecordBase):
    pass


class ProgressRecordUpdate(BaseModel):
    weight_kg: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    hips_cm: Optional[float] = None
    date: Optional[datetime] = None
    notes: Optional[str] = None


class ProgressRecordInDB(ProgressRecordBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProgressRecordResponse(ProgressRecordBase):
    model_config = ConfigDict(populate_by_name=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None


class ProgressSummary(BaseModel):
    latest_weight_kg: Optional[float] = None
    latest_body_fat_percentage: Optional[float] = None
    latest_chest_cm: Optional[float] = None
    latest_waist_cm: Optional[float] = None
    latest_hips_cm: Optional[float] = None
    total_records: int = 0
    latest_record_date: Optional[datetime] = None
