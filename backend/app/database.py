from sqlmodel import SQLModel, create_engine, Session

# SQLite database URL — can be replaced with PostgreSQL or MySQL later
DATABASE_URL = "sqlite:///./livemart.db"

# Create the SQLModel engine
engine = create_engine(DATABASE_URL, echo=True)

# Dependency for session management
def get_session():
    with Session(engine) as session:
        yield session

# Function to initialize the database tables
def init_db():
    from app.models import user, product, order, wholesale_order  # Import all models here
    SQLModel.metadata.create_all(engine)
