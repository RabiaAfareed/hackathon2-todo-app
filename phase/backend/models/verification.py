from datetime import datetime
from sqlmodel import Field, SQLModel, Column
from sqlalchemy import String, DateTime

class Verification(SQLModel, table=True):
    id: str = Field(primary_key=True)
    identifier: str = Field(sa_column=Column("identifier", String))
    value: str = Field(sa_column=Column("value", String))
    expiresAt: datetime = Field(sa_column=Column("expiresAt", DateTime))
