"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  async function handleSendOTP() {
    if (!email) return setError("Enter your email");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setOtpSent(true);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    if (!otp) return setError("Enter OTP");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        await signIn("credentials", { email, redirect: false });
        router.push("/dashboard");
      }
    } catch {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-300 ${
      darkMode ? "bg-[#1a1a1a]" : "bg-[#f3f2ef]"
    }`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          darkMode 
            ? "bg-[#2d2d2d] neumorph-dark text-yellow-400" 
            : "bg-[#f0f0f3] neumorph text-gray-700"
        }`}
      >
        {darkMode ? "🌙" : "☀️"}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 animate-fade-in">
        <div className="w-12 h-12 bg-[#0a66c2] rounded-xl flex items-center justify-center neumorph-logo">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <span className={`text-2xl font-semibold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}>
          Job Assistant
        </span>
      </div>

      {/* Card */}
      <div className={`w-full max-w-md p-8 rounded-2xl transition-all duration-300 ${
        darkMode 
          ? "bg-[#2d2d2d] neumorph-dark" 
          : "bg-[#f0f0f3] neumorph"
      }`}>
        <h1 className={`text-3xl font-semibold mb-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}>
          Sign in
        </h1>
        <p className={`text-sm mb-8 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}>
          Stay updated on your job readiness
        </p>

        {/* Google Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className={`w-full flex items-center justify-center gap-3 rounded-full py-3 text-sm font-semibold transition-all duration-200 mb-5 ${
            darkMode
              ? "bg-[#3d3d3d] text-white neumorph-dark-sm hover:shadow-xl"
              : "bg-[#f0f0f3] text-gray-700 neumorph-sm hover:shadow-xl"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`flex-1 h-px ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`} />
          <span className={`text-xs ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}>
            or
          </span>
          <div className={`flex-1 h-px ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`} />
        </div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !otpSent && handleSendOTP()}
          className={`w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 mb-4 focus:outline-none ${
            darkMode
              ? "bg-[#3d3d3d] text-white neumorph-dark-sm focus:shadow-inner-dark"
              : "bg-[#f0f0f3] text-gray-900 neumorph-sm focus:shadow-inner"
          }`}
          placeholderClassName={darkMode ? "text-gray-500" : "text-gray-400"}
        />

        {!otpSent ? (
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className={`w-full rounded-full py-3 text-sm font-semibold transition-all duration-200 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            } ${
              darkMode
                ? "bg-[#0a66c2] text-white hover:bg-[#004182] neumorph-dark-sm"
                : "bg-[#0a66c2] text-white neumorph-sm hover:bg-[#004182]"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <p className={`text-xs mb-3 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              OTP sent to <span className={`font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}>{email}</span>
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleVerifyOTP()}
              maxLength={6}
              className={`w-full rounded-xl px-4 py-3 text-sm text-center tracking-widest transition-all duration-200 mb-3 focus:outline-none ${
                darkMode
                  ? "bg-[#3d3d3d] text-white neumorph-dark-sm focus:shadow-inner-dark"
                  : "bg-[#f0f0f3] text-gray-900 neumorph-sm focus:shadow-inner"
              }`}
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className={`w-full rounded-full py-3 text-sm font-semibold transition-all duration-200 mb-2 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              } ${
                darkMode
                  ? "bg-[#0a66c2] text-white hover:bg-[#004182] neumorph-dark-sm"
                  : "bg-[#0a66c2] text-white neumorph-sm hover:bg-[#004182]"
              }`}
            >
              {loading ? "Verifying..." : "Verify & Sign in"}
            </button>
            <button
              onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
              className={`w-full text-center text-xs transition-colors ${
                darkMode
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Use a different email
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-4 text-center animate-shake">
            {error}
          </p>
        )}
      </div>

      <p className={`text-xs mt-6 text-center ${
        darkMode ? "text-gray-600" : "text-gray-400"
      }`}>
        AI Job Assistant — Skill gap analysis for students
      </p>

      {/* Custom CSS for Neumorphism and Animations */}
      <style jsx global>{`
        /* Neumorphism Light Mode */
        .neumorph {
          box-shadow: 9px 9px 16px #d1d1d4, -9px -9px 16px #ffffff;
        }
        .neumorph-sm {
          box-shadow: 5px 5px 10px #d1d1d4, -5px -5px 10px #ffffff;
        }
        .neumorph-logo {
          box-shadow: 6px 6px 12px #b8b8be, -6px -6px 12px #ffffff;
        }
        .shadow-inner {
          box-shadow: inset 5px 5px 10px #d1d1d4, inset -5px -5px 10px #ffffff;
        }
        
        /* Neumorphism Dark Mode */
        .neumorph-dark {
          box-shadow: 9px 9px 16px #1a1a1a, -9px -9px 16px #404040;
        }
        .neumorph-dark-sm {
          box-shadow: 5px 5px 10px #1a1a1a, -5px -5px 10px #404040;
        }
        .shadow-inner-dark {
          box-shadow: inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #404040;
        }

        /* Animations */
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}