from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel, Column, DateTime, func
from sqlalchemy import Boolean

if TYPE_CHECKING:
    from .task import Task

class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    emailVerified: bool = Field(
        default=False,
        sa_column=Column("emailVerified", Boolean, default=False)
    )
    image: Optional[str] = None
    createdAt: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column("createdAt", DateTime(timezone=True), server_default=func.now())
    )
    updatedAt: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    )

    tasks: List["Task"] = Relationship(back_populates="user")