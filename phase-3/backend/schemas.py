# backend\schemas.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict # ConfigDict ko import karein

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class TaskRead(TaskBase):
    id: int
    userId: str
    createdAt: datetime
    updatedAt: datetime

    # FIX: Pydantic v2 ka sahi tareeka
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# User Schemas
class UserRead(BaseModel):
    id: str
    email: str
    name: str
    image: Optional[str] = None
    emailVerified: bool
    createdAt: datetime
    updatedAt: datetime

    # FIX: Pydantic v2 ka sahi tareeka
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)