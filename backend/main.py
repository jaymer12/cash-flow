from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import router as auth_router
from routers.expenses import router as expenses_router
from routers.budgets import router as budgets_router
from routers.dashboard import router as dashboard_router
import models
from database import engine
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CashFlow API", version="1.0")

origins = [
    "http://localhost:5173",
    "https://cash-flow-delta-three.vercel.app",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(expenses_router)
app.include_router(budgets_router)
app.include_router(dashboard_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to CashFlow API ✅",
        "status": "running",
        "docs": "/docs"
    }