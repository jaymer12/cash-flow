import { useState, useEffect } from "react"
import { api } from "../api"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function Dashboard({ token }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  useEffect(() => {
    loadSummary()
  }, [month, year])

  const loadSummary = async () => {
    setLoading(true)
    const data = await api.getSummary(token, month, year)
    setSummary(data)
    setLoading(false)
  }

  const pieData = summary
    ? Object.entries(summary.category_totals).map(([name, value]) => ({ name, value }))
    : []

  const budgetData = summary?.budget_summary || []

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-2">
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-8">Loading...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl shadow">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-500">${summary?.total_income?.toFixed(2)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow">
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-500">${summary?.total_expenses?.toFixed(2)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow">
              <p className="text-sm text-gray-500">Balance</p>
              <p className={`text-2xl font-bold ${summary?.balance >= 0 ? "text-blue-500" : "text-red-500"}`}>
                ${summary?.balance?.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Pie Chart */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h2 className="font-semibold text-gray-700 mb-4">Spending by Category</h2>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-400 py-8">No expenses this month</p>
              )}
            </div>

            {/* Budget Summary */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h2 className="font-semibold text-gray-700 mb-4">Budget vs Spending</h2>
              {budgetData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="limit" fill="#93c5fd" name="Budget" />
                    <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-400 py-8">No budgets set</p>
              )}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h2 className="font-semibold text-gray-700 mb-4">Recent Expenses</h2>
            {summary?.recent_expenses?.length > 0 ? (
              <div className="space-y-2">
                {summary.recent_expenses.map(expense => (
                  <div key={expense.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">{expense.title}</p>
                      <p className="text-sm text-gray-500">{expense.category} · {expense.date}</p>
                    </div>
                    <p className="font-semibold text-red-500">-${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-4">No expenses this month</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}