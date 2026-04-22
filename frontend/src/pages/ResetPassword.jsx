import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { api } from "../api"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState(searchParams.get("token") || "")
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError("")
    if (newPassword !== confirm) return setError("Passwords do not match")
    if (newPassword.length < 6) return setError("Password must be at least 6 characters")
    setLoading(true)
    const data = await api.resetPassword(token, newPassword)
    setLoading(false)
    if (data.message === "Password reset successfully!") {
      setSuccess("Password reset! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2000)
    } else {
      setError(data.detail || "Reset failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-1">Reset Password</h1>
        <p className="text-center text-gray-500 mb-6">Enter your token and new password</p>

        {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">{success}</div>}

        <label className="text-sm font-medium text-gray-700">Reset Token</label>
        <input
          type="text"
          placeholder="Paste your reset token"
          value={token}
          onChange={e => setToken(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="text-sm font-medium text-gray-700">New Password</label>
        <input
          type="password"
          placeholder="Min 6 characters"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          placeholder="Repeat new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}