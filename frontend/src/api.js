const BASE_URL = "http://127.0.0.1:8000"

export const api = {
  // Auth
  register: async (email, password, full_name) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name })
    })
    return res.json()
  },

  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    return res.json()
  },

  forgotPassword: async (email) => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
    return res.json()
  },

  resetPassword: async (token, new_password) => {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, new_password })
    })
    return res.json()
  },

  // Expenses
  getExpenses: async (token, filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const res = await fetch(`${BASE_URL}/expenses/?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.json()
  },

  createExpense: async (token, data) => {
    const res = await fetch(`${BASE_URL}/expenses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  updateExpense: async (token, id, data) => {
    const res = await fetch(`${BASE_URL}/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  deleteExpense: async (token, id) => {
    await fetch(`${BASE_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // Budgets
  getBudgets: async (token) => {
    const res = await fetch(`${BASE_URL}/budgets/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.json()
  },

  createBudget: async (token, data) => {
    const res = await fetch(`${BASE_URL}/budgets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  deleteBudget: async (token, id) => {
    await fetch(`${BASE_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // Dashboard
  getSummary: async (token, month, year) => {
    const res = await fetch(`${BASE_URL}/dashboard/summary?month=${month}&year=${year}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.json()
  }
}