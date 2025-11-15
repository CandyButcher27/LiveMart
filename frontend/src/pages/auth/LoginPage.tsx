import React, { useState } from "react";
import { Link } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import {
  requestLoginOTP,
  verifyLoginOTP,
  requestGoogleLoginOTP,
  verifyGoogleOTP,
} from "../../api/auth";
import { GoogleLoginButton } from "../../components/auth/GoogleLoginButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);

  /* ------------------- HANDLERS ------------------- */

  // Request OTP for normal login
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestLoginOTP(email);
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

  // Login with Google → OTP
  const handleGoogleLogin = async (email: string, name: string) => {
    try {
      setLoading(true);
      setEmail(email);
      setError("");

      const response = await requestGoogleLoginOTP(email, name);
      if (response) {
        setStep("otp");
        showSuccess("OTP sent to your email!");
      }
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail || "Failed to send OTP. Please try again.";
      setError(detail);
      showError(detail);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP (Google or normal)
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let response;

      // Google login flow
      if (!password) {
        response = await verifyGoogleOTP(email, otp);

        if (!response?.access_token) {
          throw new Error("Invalid server response");
        }
      } else {
        // Standard login flow
        response = await verifyLoginOTP({
          email,
          password,
          otp,
          isGoogleLogin: false,
        });
      }

      // Save credentials
      localStorage.setItem("livemart:token", response.access_token);
      localStorage.setItem("livemart:role", response.role || "customer");
      localStorage.setItem("livemart:email", response.email || email);

      showSuccess("Login successful! Redirecting...");

      const validRoles = ["customer", "retailer", "wholesaler"];
      const redirectPath = validRoles.includes(response.role)
        ? `/${response.role}`
        : "/";

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        "Invalid OTP or credentials. Please try again.";
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
      await requestLoginOTP(email);
      showSuccess("New OTP sent to your email!");
    } catch (err: any) {
      showError("Failed to resend OTP");
    } finally {
      setIsRequestingOTP(false);
    }
  };

  /* ------------------- UI ------------------- */

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950">
      {/* LEFT GRADIENT PANEL */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 bg-gradient-to-br from-blue-700/70 via-purple-700/60 to-slate-900/80 backdrop-blur-xl shadow-xl">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-md">
            Welcome to LiveMART
          </h1>
          <p className="text-slate-200 text-lg">
            Connecting <b>Customers</b>, <b>Retailers</b> & <b>Wholesalers</b> in
            one ecosystem.
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-white/10 shadow-xl backdrop-blur-xl bg-white/5">
          <h2 className="text-3xl font-bold mb-2 text-white">
            {step === "email" ? "Sign in" : "Enter OTP"}
          </h2>

          <p className="text-sm text-slate-300 mb-6">
            {step === "email" ? (
              <>
                New user?{" "}
                <Link
                  to="/auth/register"
                  className="text-blue-400 hover:underline"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>A 6-digit code has been sent to <b>{email}</b></>
            )}
          </p>

          {/* ERROR UI */}
          {error && (
            <div className="glass-card border border-red-500/40 bg-red-500/20 text-red-200 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1: EMAIL + PASSWORD */}
          {step === "email" ? (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              <div>
                <label className="text-slate-300 text-sm">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field mt-1"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field mt-1"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-slate-950 text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleLoginButton
                onSuccess={handleGoogleLogin}
                loading={loading}
                setLoading={setLoading}
              />
            </form>
          ) : (
            /* STEP 2: OTP */
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <label className="text-slate-300 text-sm">Enter OTP</label>

              <div className="flex">
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="input-field flex-1 rounded-r-none"
                  placeholder="123456"
                />
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isRequestingOTP || loading}
                  className="rounded-l-none btn-secondary"
                >
                  {isRequestingOTP ? "Sending..." : "Resend"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full"
              >
                {loading ? "Verifying..." : "Verify and Login"}
              </button>

              <button
                type="button"
                className="text-blue-400 hover:underline text-sm mt-2"
                onClick={() => setStep("email")}
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
