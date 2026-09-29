from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# =========================================
# DATABASE CONFIGURATION
# =========================================

DATABASE_URL = "sqlite:///./enquiries.db"


# Create database engine

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


# Create session

SessionLocal = sessionmaker(
    autocommit=False,
    
    autoflush=False,
    bind=engine
)


# Base class for database models

Base = declarative_base()