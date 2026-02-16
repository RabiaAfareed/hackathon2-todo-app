from datetime import datetime, UTC
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import Column, String, ForeignKey, DateTime, func

if TYPE_CHECKING:
    from .user import User

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    status: str = Field(default="pending")

    # DB mein 'user_id' hai, Python mein 'userId'
    userId: str = Field(
        sa_column=Column("user_id", String, ForeignKey("user.id"))
    )

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        sa_column=Column("created_at", DateTime(timezone=True), server_default=func.now())
    )

    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        sa_column=Column("updated_at", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    )

    user: "User" = Relationship(back_populates="tasks")