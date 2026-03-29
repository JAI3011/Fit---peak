from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.user import PyObjectId

MealType = Literal["breakfast", "lunch", "dinner", "snack"]


class DietEntryBase(BaseModel):
    meal_name: str
    meal_type: MealType
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    date: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    notes: Optional[str] = None


class DietEntryCreate(DietEntryBase):
    pass


class DietEntryUpdate(BaseModel):
    meal_name: Optional[str] = None
    meal_type: Optional[MealType] = None
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    date: Optional[datetime] = None
    notes: Optional[str] = None


class DietEntryInDB(DietEntryBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DietEntryResponse(DietEntryBase):
    model_config = ConfigDict(populate_by_name=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
