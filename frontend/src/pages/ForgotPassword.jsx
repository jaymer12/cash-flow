import { useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../api"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const data = await api.forgotPassword(email)
    setLoading(false)
    setMessage(data.message)
    if (data.reset_token) setResetToken(data.reset_token)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-1">Forgot Password</h1>
        <p className="text-center text-gray-500 mb-6">Enter your email to get a reset token</p>

        {message && (
          <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">{message}</div>
        )}
        {resetToken && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm px-4 py-3 rounded-lg mb-4">
            <p className="font-semibold mb-1">Your reset token:</p>
            <p className="break-all font-mono">{resetToken}</p>
          </div>
        )}

        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Get Reset Token"}
        </button>

        {resetToken && (
          <Link
            to={`/reset-password?token=${resetToken}`}
            className="block text-center mt-4 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Go to Reset Password →
          </Link>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}