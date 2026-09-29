from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from Backend.database import Base


class Enquiry(Base):

    __tablename__ = "enquiries"


    # =========================================
    # ID
    # =========================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # =========================================
    # CLIENT NAME
    # =========================================

    name = Column(
        String(100),
        nullable=False
    )


    # =========================================
    # BUSINESS NAME
    # =========================================

    business = Column(
        String(150),
        nullable=True
    )


    # =========================================
    # EMAIL
    # =========================================

    email = Column(
        String(150),
        nullable=False
    )


    # =========================================
    # PHONE
    # =========================================

    phone = Column(
        String(30),
        nullable=True
    )


    # =========================================
    # SERVICE
    # =========================================

    service = Column(
        String(100),
        nullable=False
    )


    # =========================================
    # BUDGET
    # =========================================

    budget = Column(
        String(100),
        nullable=True
    )


    # =========================================
    # MESSAGE
    # =========================================

    message = Column(
        Text,
        nullable=False
    )


    # =========================================
    # ENQUIRY STATUS
    # =========================================

    status = Column(
        String(30),
        nullable=False,
        default="New"
    )


    # =========================================
    # CREATED DATE
    # =========================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )