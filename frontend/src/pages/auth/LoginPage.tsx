import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // Attempt login via context
    await login({ username, password }, remember);

    // Retrieve role from storage after successful login
    const role =
      localStorage.getItem("livemart:role") ||
      sessionStorage.getItem("livemart:role");

    // ✅ Success feedback
    showSuccess("Login successful! Redirecting...");

    // Redirect user based on their role
    setTimeout(() => {
      navigate(`/${role ?? "customer"}`);
    }, 800); // short delay for UX smoothness
  } catch (err: any) {
    // 🧱 Handle backend error structure
    const detail = err?.response?.data?.detail;

    if (Array.isArray(detail)) {
      const msg = detail[0]?.msg || "Login failed";
      setError(msg);
      showError(msg);
    } else if (typeof detail === "string") {
      setError(detail);
      showError(detail);
    } else {
      setError("Login failed");
      showError("Login failed");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center p-10 bg-gradient-to-b from-blue-700 to-purple-800">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Welcome to LiveMART</h1>
          <p className="text-slate-200">
            Connect <b>Customers</b>, <b>Retailers</b>, and <b>Wholesalers</b>.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-white text-center">
            Sign In
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm mb-1">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="••••••••"
              />
            </div>
            <label className="flex items-center text-slate-400 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2"
              />
              Remember me
            </label>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-2 rounded-full font-semibold hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            
            <p className="text-center text-slate-400 text-sm">
              Don’t have an account?{" "}
              <a href="/auth/register" className="text-indigo-400 hover:underline">
                Sign up
              </a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
