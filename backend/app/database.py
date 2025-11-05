# backend/app/database.py
from sqlmodel import SQLModel, create_engine

DATABASE_URL = "sqlite:///./livemart.db"

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    """Creates all tables if they don't exist."""
    import app.models.user  # ensure model imports before creating tables
    SQLModel.metadata.create_all(engine)
