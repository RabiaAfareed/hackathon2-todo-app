from datetime import datetime, UTC
from typing import Optional
from sqlmodel import Field, SQLModel

class Session(SQLModel, table=True):
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    token: str
    expiresAt: datetime = Field(default_factory=lambda: datetime.now(UTC))
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
