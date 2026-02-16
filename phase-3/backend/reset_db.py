from core.db import engine
from models import User, Task, Session
from sqlmodel import SQLModel

# Drop all tables
SQLModel.metadata.drop_all(engine)
print("Dropped all tables")

# Recreate all tables
SQLModel.metadata.create_all(engine)
print("Created all tables")
