import { useState, useEffect } from "react"
import { api } from "../api"

const CATEGORIES = ["Bills", "Groceries", "Entertainment", "Transportation", "Food", "Health", "Shopping", "Other"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function Budgets({ token }) {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState("")
  const now = new Date()
  const [form, setForm] = useState({
    category: "Food",
    limit_amount: "",
    month: now.getMonth() + 1,
    year: now.getFullYear()
  })

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    const data = await api.getBudgets(token)
    setBudgets(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    setError("")
    if (!form.limit_amount) return setError("Please enter a budget amount")
    const data = await api.createBudget(token, { ...form, limit_amount: parseFloat(form.limit_amount) })
    if (data.id) {
      setForm({ category: "Food", limit_amount: "", month: now.getMonth() + 1, year: now.getFullYear() })
      setShowForm(false)
      loadBudgets()
    } else {
      setError(data.detail || "Failed to create budget")
    }
  }

  const handleDelete = async (id) => {
    await api.deleteBudget(token, id)
    loadBudgets()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budgets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + Set Budget
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white p-5 rounded-2xl shadow mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Set New Budget</h2>
          {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-3">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Budget Limit ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.limit_amount}
                onChange={e => setForm({ ...form, limit_amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Month</label>
              <select
                value={form.month}
                onChange={e => setForm({ ...form, month: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Year</label>
              <select
                value={form.year}
                onChange={e => setForm({ ...form, year: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save Budget
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Budget List */}
      <div className="grid grid-cols-2 gap-4">
        {loading && <p className="text-center text-gray-400 py-8 col-span-2">Loading...</p>}
        {!loading && budgets.length === 0 && (
          <div className="text-center text-gray-400 py-8 bg-white rounded-2xl col-span-2">
            No budgets set yet. Add one above!
          </div>
        )}
        {budgets.map(budget => (
          <div key={budget.id} className="bg-white p-5 rounded-2xl shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                <p className="text-sm text-gray-500">{MONTHS[budget.month - 1]} {budget.year}</p>
              </div>
              <button
                onClick={() => handleDelete(budget.id)}
                className="text-red-400 hover:text-red-600 text-sm transition"
              >
                Delete
              </button>
            </div>
            <p className="text-2xl font-bold text-blue-600">${budget.limit_amount.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Budget limit</p>
          </div>
        ))}
      </div>
    </div>
  )
}