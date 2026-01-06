from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Column
from sqlalchemy import String, DateTime, ForeignKey

class Account(SQLModel, table=True):
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    accountId: str = Field(sa_column=Column("accountId", String))
    providerId: str = Field(sa_column=Column("providerId", String))
    accessToken: Optional[str] = Field(sa_column=Column("accessToken", String))
    refreshToken: Optional[str] = Field(sa_column=Column("refreshToken", String))
    idToken: Optional[str] = Field(sa_column=Column("idToken", String))
    expiresAt: Optional[datetime] = Field(sa_column=Column("expiresAt", DateTime))
    password: Optional[str] = None

    # Add camelCase timestamp columns
    createdAt: datetime = Field(default=None, sa_column=Column("createdAt", DateTime(timezone=True)))
    updatedAt: datetime = Field(default=None, sa_column=Column("updatedAt", DateTime(timezone=True)))
