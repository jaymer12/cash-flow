import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../api"

export default function Signup({ onLogin }) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError("")
    if (password.length < 6) return setError("Password must be at least 6 characters")
    if (password.length > 72) return setError("Password cannot be longer than 72 characters")
    if (password !== confirm) return setError("Passwords do not match")
    setLoading(true)
    const data = await api.register(email, password, fullName)
    if (data.id) {
      const loginData = await api.login(email, password)
      if (loginData.access_token) {
        onLogin(loginData.access_token)
        navigate("/dashboard")
      }
    } else {
      setError(data.detail || "Registration failed")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-1">💰 CashFlow</h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          placeholder="Jay Mer"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Min 6 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          placeholder="Repeat your password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  )
}