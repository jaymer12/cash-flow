from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract
from database import get_db
from auth import get_current_user
import models
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_summary(
    month: int = None,
    year: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    now = datetime.now()
    month = month or now.month
    year = year or now.year

    query = db.query(models.Expense).filter(
        models.Expense.owner_id == current_user.id,
        extract("month", models.Expense.date) == month,
        extract("year", models.Expense.date) == year
    )

    expenses = query.filter(models.Expense.type == "expense").all()
    incomes = query.filter(models.Expense.type == "income").all()

    total_expenses = sum(e.amount for e in expenses)
    total_income = sum(i.amount for i in incomes)

    category_totals = {}
    for expense in expenses:
        category_totals[expense.category] = category_totals.get(expense.category, 0) + expense.amount

    budgets = db.query(models.Budget).filter(
        models.Budget.owner_id == current_user.id,
        models.Budget.month == month,
        models.Budget.year == year
    ).all()

    budget_summary = []
    for budget in budgets:
        spent = category_totals.get(budget.category, 0)
        budget_summary.append({
            "category": budget.category,
            "limit": budget.limit_amount,
            "spent": spent,
            "remaining": budget.limit_amount - spent,
            "percentage": round((spent / budget.limit_amount) * 100, 1) if budget.limit_amount > 0 else 0
        })

    return {
        "month": month,
        "year": year,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": total_income - total_expenses,
        "category_totals": category_totals,
        "budget_summary": budget_summary,
        "recent_expenses": [
            {
                "id": e.id,
                "title": e.title,
                "amount": e.amount,
                "category": e.category,
                "date": str(e.date)
            } for e in sorted(expenses, key=lambda x: x.date, reverse=True)[:5]
        ]
    }