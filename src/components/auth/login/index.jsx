import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import Navbar from "../../Navbar";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (err) {
        setErrorMessage(err.message);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
      } catch (err) {
        setErrorMessage(err.message);
        setIsSigningIn(false);
      }
    }
  };

  // Redirect if logged in
  if (userLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <main className="flex items-center justify-center h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
          <h3 className="text-white text-2xl font-bold text-center">Welcome Back</h3>
          <p className="text-gray-400 text-center mb-6">Login to continue</p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="relative">
              <label className="text-sm text-gray-300 font-bold">Email</label>
              <div className="flex items-center mt-2 bg-black/30 border border-white/20 rounded-lg px-3 py-2">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm text-gray-300 font-bold">Password</label>
              <div className="flex items-center mt-2 bg-black/30 border border-white/20 rounded-lg px-3 py-2">
                <Lock className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {errorMessage && <span className="text-red-500 font-medium">{errorMessage}</span>}

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition-all duration-300 ${
                isSigningIn ? "bg-gray-500 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 hover:shadow-lg"
              }`}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-400 hover:underline font-bold">
              Sign up
            </Link>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-500"></div>
            <span className="mx-2 text-gray-400 text-sm font-bold">OR</span>
            <div className="flex-grow border-t border-gray-500"></div>
          </div>

          <button
            disabled={isSigningIn}
            onClick={onGoogleSignIn}
            className="w-full flex items-center justify-center gap-x-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
              <path d="M47.5 24.55c0-1.63-.13-3.27-.41-4.87H24.48v9.24h12.96c-.54 2.98-2.27 5.61-4.8 7.29v5.99h7.74c4.54-4.18 7.14-10.35 7.14-17.65Z" fill="#4285F4" />
              <path d="M24.48 48c6.47 0 11.93-2.13 15.9-5.79l-7.73-5.99c-2.16 1.46-4.94 2.29-8.17 2.29-6.25 0-11.54-4.23-13.46-9.91H3.03v6.18C7.1 42.9 15.41 48 24.48 48Z" fill="#34A853" />
              <path d="M11 28.6c-1-2.98-1-6.2 0-9.19V13.23H3.03c-3.4 6.78-3.4 15.77 0 22.56L11 28.6Z" fill="#FBBC04" />
              <path d="M24.48 9.5c3.42 0 6.74 1.18 9.34 3.5l7.76-7.25C36.2 2.17 30.44-.07 24.48 0 15.4 0 7.1 5.12 3.03 13.23l7.96 6.18C12.9 13.72 18.22 9.5 24.48 9.5Z" fill="#EA4335" />
            </svg>
            {isSigningIn ? "Signing In..." : "Continue with Google"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
