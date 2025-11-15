import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestRegistrationOTP, verifyRegistrationOTP } from "../../api/auth";
import { showSuccess, showError } from "../../utils/toast";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'retailer' | 'wholesaler';
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
    role: "customer" as const,  // Explicitly type as 'customer'
  });

  // Handle input updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle OTP input
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
  };

  // Request OTP for registration
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await requestRegistrationOTP({
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
      });
      
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

  // Verify OTP and complete registration
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First parameter: user data
      const userData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role as 'customer' | 'retailer' | 'wholesaler'
      };
      
      // Second parameter: OTP
      await verifyRegistrationOTP(userData, otp);

      showSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Registration failed";
      setError(detail);
      showError(detail);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (isRequestingOTP) return;
    
    setIsRequestingOTP(true);
    try {
      await requestRegistrationOTP({
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
      });
      showSuccess("New OTP sent to your email!");
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Failed to resend OTP";
      showError(detail);
    } finally {
      setIsRequestingOTP(false);
    }
  };

  // Render the registration form
  const renderForm = () => (
    <form onSubmit={handleRequestOTP} className="space-y-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
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
        minLength={6}
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
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );

  // Render the OTP verification form
  const renderOTPForm = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="text-center text-slate-300 mb-4">
        <p>We've sent a 6-digit code to <span className="font-semibold">{form.email}</span></p>
        <p className="text-sm text-slate-500">Please check your email and enter the code below</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            placeholder="123456"
            required
            className="w-full max-w-[200px] text-center text-2xl tracking-widest rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            ← Back
          </button>
          
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isRequestingOTP}
            className="text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
          >
            {isRequestingOTP ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-700 text-white py-2 rounded-full font-semibold hover:scale-[1.02] transition disabled:opacity-60 mt-6"
      >
        {loading ? "Verifying..." : "Verify & Register"}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex items-center justify-center p-10 bg-gradient-to-b from-purple-700 to-blue-700">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            {step === "form" ? "Join LiveMART" : "Verify Your Email"}
          </h1>
          <p className="text-slate-200 text-sm">
            {step === "form" 
              ? "Connect Customers, Retailers, and Wholesalers in one seamless marketplace."
              : "Enter the verification code sent to your email address."}
          </p>
        </div>
      </div>

      {/* Right form area */}
      <div className="flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-white text-center">
            {step === "form" ? "Create Your Account" : "Verify OTP"}
          </h2>

          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === "form" ? renderForm() : renderOTPForm()}

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
