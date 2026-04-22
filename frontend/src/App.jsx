import { Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Expenses from "./pages/Expenses"
import Budgets from "./pages/Budgets"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  const handleLogin = (receivedToken) => {
    localStorage.setItem("token", receivedToken)
    setToken(receivedToken)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  if (!token) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<Layout onLogout={handleLogout} />}>
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/expenses" element={<Expenses token={token} />} />
        <Route path="/budgets" element={<Budgets token={token} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App