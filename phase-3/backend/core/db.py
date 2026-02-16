# backend\core\db.py
from sqlmodel import create_engine, Session, SQLModel
from .config import settings

engine = create_engine(
    str(settings.DATABASE_URL),
    echo=False,  # ya True
    pool_pre_ping=True  # <--- YE LINE ZAROORI HAI
)

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
