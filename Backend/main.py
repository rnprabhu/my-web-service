from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm
)
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from jose import jwt, JWTError

import os

from Backend.database import engine, SessionLocal, Base
from Backend import models


# =========================================
# LOAD ENVIRONMENT VARIABLES
# =========================================

load_dotenv()


ADMIN_USERNAME = os.getenv(
    "ADMIN_USERNAME"
)

ADMIN_PASSWORD = os.getenv(
    "ADMIN_PASSWORD"
)


# =========================================
# JWT CONFIGURATION
# =========================================

SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/admin/login"
)


# =========================================
# CREATE DATABASE TABLES
# =========================================

Base.metadata.create_all(
    bind=engine
)


# =========================================
# FASTAPI APPLICATION
# =========================================

app = FastAPI(
    title="Prabhu Labs API",
    description="Backend API for Prabhu Labs",
    version="1.0.0"
)


# =========================================
# CORS CONFIGURATION
# =========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================
# DATABASE SESSION
# =========================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# =========================================
# CREATE ACCESS TOKEN
# =========================================

def create_access_token(
    username: str
):

    payload = {
        "sub": username
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# =========================================
# VERIFY ADMIN TOKEN
# =========================================

def get_current_admin(
    token: str = Depends(oauth2_scheme)
):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get(
            "sub"
        )

        if username != ADMIN_USERNAME:

            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials"
            )

        return username

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


# =========================================
# ENQUIRY REQUEST MODEL
# =========================================

class EnquiryCreate(BaseModel):

    name: str

    business: str | None = None

    email: str

    phone: str | None = None

    service: str

    budget: str | None = None

    message: str


# =========================================
# ADMIN LOGIN MODEL
# =========================================

class AdminLogin(BaseModel):

    username: str

    password: str


# =========================================
# HOME
# =========================================

@app.get("/")
def home():

    return {
        "message": "Prabhu Labs API is running!"
    }


# =========================================
# CREATE ENQUIRY
# =========================================

@app.post("/enquiries")
def create_enquiry(
    enquiry: EnquiryCreate,
    db: Session = Depends(get_db)
):

    new_enquiry = models.Enquiry(

        name=enquiry.name,

        business=enquiry.business,

        email=enquiry.email,

        phone=enquiry.phone,

        service=enquiry.service,

        budget=enquiry.budget,

        message=enquiry.message
    )


    db.add(new_enquiry)

    db.commit()

    db.refresh(new_enquiry)


    return {

        "success": True,

        "message": "Enquiry submitted successfully!",

        "enquiry_id": new_enquiry.id
    }


# =========================================
# GET ALL ENQUIRIES
# PROTECTED ADMIN ENDPOINT
# =========================================

@app.get("/enquiries")
def get_enquiries(

    db: Session = Depends(get_db),

    admin: str = Depends(
        get_current_admin
    )

):

    enquiries = (

        db.query(models.Enquiry)

        .order_by(
            models.Enquiry.created_at.desc()
        )

        .all()

    )


    return [

        {

            "id": enquiry.id,

            "name": enquiry.name,

            "business": enquiry.business,

            "email": enquiry.email,

            "phone": enquiry.phone,

            "service": enquiry.service,

            "budget": enquiry.budget,

            "message": enquiry.message,

            "created_at": enquiry.created_at

        }

        for enquiry in enquiries

    ]
    
# =========================================
# DELETE ENQUIRY
# =========================================

@app.delete("/enquiries/{enquiry_id}")
def delete_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):

    enquiry = (
        db.query(models.Enquiry)
        .filter(
            models.Enquiry.id == enquiry_id
        )
        .first()
    )


    if not enquiry:

        raise HTTPException(
            status_code=404,
            detail="Enquiry not found"
        )


    db.delete(enquiry)

    db.commit()


    return {

        "success": True,

        "message":
            "Enquiry deleted successfully"

    }

# =========================================
# ADMIN LOGIN
# =========================================

@app.post("/admin/login")
def admin_login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    if (
        form_data.username != ADMIN_USERNAME
        or form_data.password != ADMIN_PASSWORD
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )


    access_token = create_access_token(
        form_data.username
    )


    return {

        "access_token": access_token,

        "token_type": "bearer",

        "success": True,

        "message": "Login successful"

    }