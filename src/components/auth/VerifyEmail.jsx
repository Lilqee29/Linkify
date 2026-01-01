import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { applyActionCode, onAuthStateChanged } from "firebase/auth";
import { ShieldCheck, CheckCircle, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "../Navbar";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Auto-detect if user is already verified
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified && status === "verifying") {
        setStatus("success");
        setMessage("Your email is already verified!");
      }
    });

    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get("oobCode");
    const mode = queryParams.get("mode");
    const sentAt = queryParams.get("t"); // Custom timestamp

    // 🔹 Expiration Check: 15 Minutes (900,000 ms)
    // Using 30 minutes total (15 mins + 15 mins buffer) to avoid clock skew issues
    const EXPIRATION_TIME = 15 * 60 * 1000;
    const CLOCK_SKEW_BUFFER = 15 * 60 * 1000; 
    const now = Date.now();
    
    let isExpired = false;
    if (sentAt) {
      const sentTime = parseInt(sentAt);
      if (!isNaN(sentTime)) {
        // Only reject if it's significantly in the past
        isExpired = (now - sentTime) > (EXPIRATION_TIME + CLOCK_SKEW_BUFFER);
      }
    }

    if (isExpired) {
      setStatus("error");
      setMessage("This security link has expired (15-minute limit). Please request a new one.");
    } else if (mode === "verifyEmail" && oobCode) {
      handleVerify(oobCode);
    } else if (status === "verifying") {
      // If we don't have code/mode, we might still be waiting for Auth state
      // but let's set a timeout to show an error if nothing happens
      const timer = setTimeout(() => {
        if (status === "verifying") {
          setStatus("error");
          setMessage("We couldn't find a valid verification code in this link. It may have been used already or the link is broken.");
        }
      }, 3000);
      return () => {
        clearTimeout(timer);
        unsubscribe();
      };
    }
    return () => unsubscribe();
  }, [location, status]);

  const handleVerify = async (code) => {
    try {
      await applyActionCode(auth, code);
      setStatus("success");
      setMessage("Your email has been verified successfully! Redirecting you to your dashboard...");
      
      // 🚀 Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

    } catch (error) {
      console.error("Verification error:", error);
      
      // Check if it's already verified (maybe by a scanner)
      if (error.code === 'auth/invalid-action-code') {
          // Check if we are already logged in and verified
          if (auth.currentUser?.emailVerified) {
              setStatus("success");
              setMessage("You are already verified! Redirecting...");
              setTimeout(() => navigate("/dashboard"), 2000);
              return;
          }
          setStatus("error");
          setMessage("This link is no longer valid. It might have been used already by your email provider's security scanner.");
      } else if (error.code === 'auth/expired-action-code') {
        setStatus("error");
        setMessage("This verification link has expired. Please request a new one from your dashboard.");
      } else {
        setStatus("error");
        setMessage(error.message || "An unexpected error occurred.");
      }
    }
  };

  const getErrorTitle = () => {
    if (message.includes("expired")) return "Link Expired";
    return "Verification Failed";
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col selection:bg-indigo-500/30">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-lg p-1px bg-gradient-to-b from-white/20 to-transparent rounded-3xl shadow-2xl z-10">
          <div className="bg-[#0a0a0c]/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[calc(1.5rem-1px)] text-center space-y-8">
            
            {status === "verifying" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Verifying your account...</h2>
                <p className="text-gray-400">Please wait while we secure your profile.</p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-inner ring-1 ring-white/20">
                      <ShieldCheck className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Verified! 🚀
                  </h1>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {message}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="group relative w-full py-4 px-6 bg-white text-black font-bold rounded-2xl transition-all hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                  <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    {getErrorTitle()}
                  </h1>
                  <p className="text-gray-400 text-lg leading-relaxed px-4">
                    {message}
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                     onClick={() => navigate("/dashboard")}
                     className="w-full py-4 px-6 bg-white text-black font-bold rounded-2xl transition shadow-xl hover:bg-gray-100"
                  >
                    Go to Dashboard
                  </button>
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-white text-sm transition"
                  >
                    Return to Login
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-gray-600 border-t border-white/5">
        © 2026 Linkly. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifyEmail;
