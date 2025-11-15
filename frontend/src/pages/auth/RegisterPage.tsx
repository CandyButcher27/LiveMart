import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  requestRegistrationOTP,
  verifyRegistrationOTP,
} from "../../api/auth";
import { showSuccess, showError } from "../../utils/toast";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "customer" | "retailer" | "wholesaler";
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  /* ---------------------------------------------
      Handlers
  --------------------------------------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await requestRegistrationOTP(form);
      setStep("otp");
      showSuccess("OTP sent to your email!");
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Failed to send OTP";
      setError(detail);
      showError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return setError("Enter a valid 6-digit OTP");
    }

    setLoading(true);
    setError("");

    try {
      await verifyRegistrationOTP(
        {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        },
        otp
      );

      showSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/auth/login"), 1200);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Registration failed";
      setError(detail);
      showError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (isRequestingOTP) return;

    setIsRequestingOTP(true);
    try {
      await requestRegistrationOTP(form);
      showSuccess("New OTP sent!");
    } catch {
      showError("Failed to resend OTP");
    } finally {
      setIsRequestingOTP(false);
    }
  };

  /* ---------------------------------------------
      Form UI Components
  --------------------------------------------- */

  const renderForm = () => (
    <form onSubmit={handleRequestOTP} className="space-y-5">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="input-field"
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="input-field"
      />

      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
        minLength={6}
        className="input-field"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="input-field"
      >
        <option value="customer">Customer</option>
        <option value="retailer">Retailer</option>
        <option value="wholesaler">Wholesaler</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div className="text-center text-slate-300">
        <p>
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold">{form.email}</span>
        </p>
      </div>

      <input
        value={otp}
        onChange={handleOtpChange}
        maxLength={6}
        placeholder="123456"
        className="text-center tracking-widest text-2xl input-field"
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-blue-400 hover:text-blue-300 text-sm"
          onClick={() => setStep("form")}
        >
          ← Back
        </button>

        <button
          type="button"
          disabled={isRequestingOTP}
          onClick={handleResendOTP}
          className="text-blue-400 hover:text-blue-300 text-sm disabled:opacity-60"
        >
          {isRequestingOTP ? "Sending..." : "Resend OTP"}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="btn-primary w-full"
      >
        {loading ? "Verifying..." : "Verify & Register"}
      </button>
    </form>
  );

  /* ---------------------------------------------
      Page Layout
  --------------------------------------------- */

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950">
      {/* LEFT PANEL */}
      <div className="hidden md:flex items-center justify-center p-10 bg-gradient-to-br from-purple-700/70 via-blue-700/60 to-slate-900/80 backdrop-blur-xl shadow-xl">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            {step === "form" ? "Join LiveMART" : "Verify Your OTP"}
          </h1>
          <p className="text-slate-200 text-lg">
            {step === "form"
              ? "Create your account and begin your journey."
              : "A verification code has been sent to your email."}
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex items-center justify-center p-8">
        <div className="glass-card w-full max-w-md p-8 rounded-2xl">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            {step === "form" ? "Create Your Account" : "Enter OTP"}
          </h2>

          {error && (
            <div className="glass-card border border-red-500/40 bg-red-500/20 text-red-300 text-sm p-3 mb-5 rounded-md">
              {error}
            </div>
          )}

          {step === "form" ? renderForm() : renderOtpForm()}

          <p className="text-center text-slate-400 text-sm mt-6">
            Already registered?{" "}
            <a href="/auth/login" className="text-blue-400 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
