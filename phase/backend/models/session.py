from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Column
from sqlalchemy import String, DateTime

class Session(SQLModel, table=True):
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    token: str = Field(sa_column=Column("token", String))
    expiresAt: datetime = Field(sa_column=Column("expiresAt", DateTime))
    ipAddress: Optional[str] = Field(sa_column=Column("ipAddress", String))
    userAgent: Optional[str] = Field(sa_column=Column("userAgent", String))
    createdAt: datetime = Field(default=None, sa_column=Column("createdAt", DateTime(timezone=True)))
    updatedAt: datetime = Field(default=None, sa_column=Column("updatedAt", DateTime(timezone=True)))
