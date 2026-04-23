from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract
from database import get_db
from auth import get_current_user
import models
from datetime import datetime
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/insights", tags=["AI Insights"])

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.get("/analyze")
def analyze_spending(
    month: int = None,
    year: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    now = datetime.now()
    month = month or now.month
    year = year or now.year

    # Get expenses
    expenses = db.query(models.Expense).filter(
        models.Expense.owner_id == current_user.id,
        extract("month", models.Expense.date) == month,
        extract("year", models.Expense.date) == year
    ).all()

    # Get budgets
    budgets = db.query(models.Budget).filter(
        models.Budget.owner_id == current_user.id,
        models.Budget.month == month,
        models.Budget.year == year
    ).all()

    if not expenses:
        return {"insights": "No expenses found for this month. Start tracking your spending to get AI insights!"}

    # Build summary
    total_income = sum(e.amount for e in expenses if e.type == "income")
    total_expenses = sum(e.amount for e in expenses if e.type == "expense")

    category_totals = {}
    for e in expenses:
        if e.type == "expense":
            category_totals[e.category] = category_totals.get(e.category, 0) + e.amount

    budget_info = {b.category: b.limit_amount for b in budgets}

    # Build prompt
    prompt = f"""
    You are a personal finance advisor. Analyze this user's spending for {month}/{year}:

    Total Income: ${total_income:.2f}
    Total Expenses: ${total_expenses:.2f}
    Balance: ${total_income - total_expenses:.2f}

    Spending by category:
    {chr(10).join([f"- {cat}: ${amt:.2f}" for cat, amt in category_totals.items()])}

    Budget limits:
    {chr(10).join([f"- {cat}: ${limit:.2f}" for cat, limit in budget_info.items()]) if budget_info else "No budgets set"}

    Give 3-4 short, specific, helpful insights about their spending habits.
    Be friendly, practical and encouraging.
    Format as bullet points.
    Keep it under 150 words total.
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )

    insights = response.choices[0].message.content

    return {
        "month": month,
        "year": year,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "insights": insights
    }