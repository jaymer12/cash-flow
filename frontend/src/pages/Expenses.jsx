import { useState, useEffect } from "react"
import { api } from "../api"

const CATEGORIES = ["Bills", "Groceries", "Entertainment", "Transportation", "Food", "Health", "Shopping", "Other"]

export default function Expenses({ token }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("all")
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    is_recurring: false
  })

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    const data = await api.getExpenses(token)
    setExpenses(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.amount) return
    await api.createExpense(token, { ...form, amount: parseFloat(form.amount) })
    setForm({
      title: "", amount: "", category: "Food", type: "expense",
      date: new Date().toISOString().split("T")[0], notes: "", is_recurring: false
    })
    setShowForm(false)
    loadExpenses()
  }

  const handleDelete = async (id) => {
    await api.deleteExpense(token, id)
    loadExpenses()
  }

  const filtered = expenses.filter(e => filter === "all" ? true : e.type === filter)

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Expenses & Income</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + Add New
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white p-5 rounded-2xl shadow mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Add Transaction</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Title</label>
              <input
                type="text"
                placeholder="e.g. Grocery shopping"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
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
              <label className="text-sm text-gray-600">Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Notes (optional)</label>
              <input
                type="text"
                placeholder="Any notes..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={form.is_recurring}
              onChange={e => setForm({ ...form, is_recurring: e.target.checked })}
              className="w-4 h-4 accent-blue-600"
            />
            <label className="text-sm text-gray-600">Recurring expense</label>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save
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

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {["all", "expense", "income"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
              filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-blue-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-400 py-8 bg-white rounded-2xl">
            No transactions yet. Add one above!
          </div>
        )}
        {filtered.map(expense => (
          <div key={expense.id} className="bg-white p-4 rounded-2xl shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                expense.type === "income" ? "bg-green-500" : "bg-red-400"
              }`}>
                {expense.type === "income" ? "+" : "-"}
              </div>
              <div>
                <p className="font-medium text-gray-800">{expense.title}</p>
                <p className="text-sm text-gray-500">
                  {expense.category} · {expense.date}
                  {expense.is_recurring && " · 🔄 Recurring"}
                </p>
                {expense.notes && <p className="text-xs text-gray-400">{expense.notes}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className={`font-bold text-lg ${expense.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {expense.type === "income" ? "+" : "-"}${expense.amount.toFixed(2)}
              </p>
              <button
                onClick={() => handleDelete(expense.id)}
                className="text-red-400 hover:text-red-600 text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}