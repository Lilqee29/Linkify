import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithGoogle, doSignInWithEmailAndPasswordWithVerification } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import Navbar from "../../Navbar";
import { Mail, Lock, AlertCircle, CheckCircle, Shield, RefreshCw } from "lucide-react";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVerificationHelp, setShowVerificationHelp] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage("");
      try {
        // Use the enhanced verification function
        await doSignInWithEmailAndPasswordWithVerification(email, password);
      } catch (err) {
        // Handle specific Firebase auth errors
        let userFriendlyMessage = err.message;
        
        switch (err.code) {
          case 'auth/user-not-found':
            userFriendlyMessage = "❌ No account found with this email. Try signing up!";
            break;
          case 'auth/wrong-password':
            userFriendlyMessage = "🔒 Incorrect password. Please try again.";
            break;
          case 'auth/invalid-email':
            userFriendlyMessage = "📧 Please enter a valid email address.";
            break;
          case 'auth/too-many-requests':
            userFriendlyMessage = "⏰ Too many failed attempts. Please try again later.";
            break;
          case 'auth/user-disabled':
            userFriendlyMessage = "🚫 This account has been disabled. Contact support.";
            break;
          case 'auth/network-request-failed':
            userFriendlyMessage = "📡 Network error. Check your internet connection.";
            break;
          case 'auth/invalid-credential':
            userFriendlyMessage = "🔐 Invalid email or password. Please try again.";
            break;
          default:
            // Check if it's our custom verification error
            if (err.message.includes("verify your email")) {
              userFriendlyMessage = "📧 " + err.message;
            } else {
              userFriendlyMessage = "❌ " + err.message;
            }
        }
        
        setErrorMessage(userFriendlyMessage);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage("");
      try {
        await doSignInWithGoogle();
      } catch (err) {
        let errorMsg = "❌ Google sign-in failed. Please try again.";
        
        if (err.code === 'auth/popup-closed-by-user') {
          errorMsg = "⚠️ Sign-in cancelled. Please try again.";
        } else if (err.code === 'auth/network-request-failed') {
          errorMsg = "📡 Network error. Check your internet connection.";
        } else if (err.code === 'auth/popup-blocked') {
          errorMsg = "🚫 Popup blocked. Please enable popups for this site.";
        }
        
        setErrorMessage(errorMsg);
        setIsSigningIn(false);
      }
    }
  };

  const handleResendVerification = async () => {
    if (isResendingVerification) return;
    
    setIsResendingVerification(true);
    try {
      // This would need to be implemented to resend verification
      // For now, show a message
      setErrorMessage("Please check your email for the verification link. If you don't see it, check your spam folder.");
    } catch {
      setErrorMessage("Failed to resend verification email. Please try again.");
    } finally {
      setIsResendingVerification(false);
    }
  };

  // Redirect if logged in
  if (userLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
          <h3 className="text-white text-xl sm:text-2xl font-bold text-center">Welcome Back</h3>
          <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">Login to continue</p>

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
            <div className="relative">
              <label className="text-sm text-gray-300 font-bold">Email</label>
              <div className="flex items-center mt-2 bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 sm:py-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm text-gray-300 font-bold">Password</label>
              <div className="flex items-center mt-2 bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 sm:py-2">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" />
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm sm:text-base"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-red-400 font-medium p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-sm">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="break-words">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-3 sm:py-2.5 text-white font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base ${
                isSigningIn ? "bg-gray-500 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 hover:shadow-lg"
              }`}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowVerificationHelp(!showVerificationHelp)}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
            >
              <Shield className="w-4 h-4" />
              Having trouble signing in?
            </button>
          </div>

          {showVerificationHelp && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Common Login Issues
              </h4>
              <ul className="text-blue-300 text-xs sm:text-sm space-y-1">
                <li>• Make sure your email is verified</li>
                <li>• Check your spam folder for verification emails</li>
                <li>• Verification links expire after 2 minutes</li>
                <li>• Ensure caps lock is off when typing password</li>
                <li>• Try using the "Forgot Password" option</li>
              </ul>
              
              {errorMessage && errorMessage.includes("verify your email") && (
                <div className="mt-3 pt-3 border-t border-blue-500/20">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium"
                  >
                    <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isResendingVerification ? 'animate-spin' : ''}`} />
                    {isResendingVerification ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={onGoogleSignIn}
              disabled={isSigningIn}
              className={`w-full px-4 py-3 sm:py-2.5 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 text-sm sm:text-base ${
                isSigningIn ? "bg-gray-500 cursor-not-allowed" : "bg-black/30 hover:bg-black/50 hover:border-white/40"
              }`}
            >
              {isSigningIn ? "Signing In..." : "Continue with Google"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
