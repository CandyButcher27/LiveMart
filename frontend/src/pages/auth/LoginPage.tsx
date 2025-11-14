import React, { useState } from "react";
import { Link } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import { requestLoginOTP, verifyLoginOTP } from "../../api/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);

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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Verify OTP and login in a single step
      const response = await verifyLoginOTP({
        email,
        password,
        otp
      });
      
      // Save the token and user info
      localStorage.setItem("livemart:token", response.access_token);
      localStorage.setItem("livemart:role", response.role);
      localStorage.setItem("livemart:email", response.email);
      
      showSuccess("Login successful! Redirecting...");
      
      // Redirect based on role
      const role = response.role || 'customer';
      const validRoles = ['customer', 'retailer', 'wholesaler'];
      const redirectPath = validRoles.includes(role) ? `/${role}` : '/';
      
      // Use window.location.href for a full page reload
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Invalid OTP or credentials";
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
      const detail = err?.response?.data?.detail || "Failed to resend OTP";
      setError(detail);
      showError(detail);
    } finally {
      setIsRequestingOTP(false);
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

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 'email' ? 'Sign in to your account' : 'Enter OTP'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'email' ? (
                <>
                  Or{' '}
                  <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                    create a new account
                  </Link>
                </>
              ) : (
                <span className="text-gray-600">
                  We've sent a 6-digit code to <b>{email}</b>
                </span>
              )}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {step === 'email' ? (
            <form className="mt-8 space-y-6" onSubmit={handleRequestOTP}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter 6-digit OTP
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
                      placeholder="123456"
                    />
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isRequestingOTP || loading}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
                    >
                      {isRequestingOTP ? 'Sending...' : 'Resend'}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Didn't receive the code? Check your spam folder or request a new code.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  ← Back to login
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
