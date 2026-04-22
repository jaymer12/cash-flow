from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    type: str = "expense"
    date: date
    notes: Optional[str] = None
    is_recurring: bool = False

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    type: Optional[str] = None
    date: Optional[date] = None
    notes: Optional[str] = None
    is_recurring: Optional[bool] = None

class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    type: str
    date: date
    notes: Optional[str] = None
    is_recurring: bool
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetCreate(BaseModel):
    category: str
    limit_amount: float
    month: int
    year: int

class BudgetResponse(BaseModel):
    id: int
    category: str
    limit_amount: float
    month: int
    year: int
    owner_id: int

    class Config:
        from_attributes = True