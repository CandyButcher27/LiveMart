// src/pages/auth/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { showSuccess, showError } from "../../utils/toast";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle input updates
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle registration submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/auth/register", form);

      // Success toast + redirect
      showSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/auth/login"), 1200);
    } catch (err: any) {
      // Parse backend error
      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        const msg = detail[0]?.msg || "Registration failed";
        showError(msg);
      } else if (typeof detail === "string") {
        showError(detail);
      } else {
        showError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex items-center justify-center p-10 bg-gradient-to-b from-purple-700 to-blue-700">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Join LiveMART</h1>
          <p className="text-slate-200 text-sm">
            Connect <b>Customers</b>, <b>Retailers</b>, and <b>Wholesalers</b> in one seamless marketplace.
          </p>
        </div>
      </div>

      {/* Right form area */}
      <div className="flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-white text-center">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-indigo-600"
            >
              <option value="customer">Customer</option>
              <option value="retailer">Retailer</option>
              <option value="wholesaler">Wholesaler</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-700 text-white py-2 rounded-full font-semibold hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <a href="/auth/login" className="text-indigo-400 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
