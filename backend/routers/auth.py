from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(credentials: LoginRequest):
    """
    Authenticate user and return token
    For demo purposes, accepts any email/password
    """
    # In production, verify credentials against database
    if credentials.email and credentials.password:
        return {
            "success": True,
            "message": "Login successful",
            "token": "demo_token_" + credentials.email,
            "user": {
                "email": credentials.email,
                "name": "Demo User"
            }
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")
