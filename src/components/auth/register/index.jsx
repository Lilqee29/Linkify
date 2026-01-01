import React, { useState, useEffect } from 'react';
import { auth } from '../../../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword, logOutUser } from '../../../firebase/auth';
import { createUserProfile } from '../../../firebase/db'; 
import { useAlert } from "../../../contexts/AlertContext";
import Navbar from "../../Navbar"; 
import { Mail, Lock, ShieldCheck, CheckCircle } from 'lucide-react';
import { sendVerification } from '../../../firebase/SendVerification';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessUI, setShowSuccessUI] = useState(false);
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const getErrorMessage = (error) => {
        const errorCode = error.code;
        switch(errorCode) {
            case 'auth/email-already-in-use':
                return '📧 Email already registered. Try logging in!';
            case 'auth/weak-password':
                return '🔒 Password must be at least 6 characters.';
            case 'auth/invalid-email':
                return '📧 Invalid email address.';
            default:
                return '❌ ' + (error.message || 'Something went wrong.');
        }
    };

    const onSignUp = async (e) => {
        e.preventDefault();
        if (isSigningUp) return;
        setIsSigningUp(true);
        setErrorMessage('');

        try {
            // 1️⃣ Create User in Auth
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 2️⃣ Create Firestore Profile
            await createUserProfile(user);

            // 3️⃣ Send Verification Link
            await sendVerification(user);
            
            // 4️⃣ Switch to success UI (but keep them logged in locally for polling)
            setShowSuccessUI(true);
            showAlert("Account Created! 🎉", "success", "Please check your inbox to verify your account.");

        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            showAlert("Sign up failed", "error", getErrorMessage(error));
        } finally {
            setIsSigningUp(false);
        }
    };

    // 🔹 Verification Polling Logic
    useEffect(() => {
        if (!showSuccessUI) return;

        const checkVerification = async () => {
            const user = auth.currentUser;
            if (user) {
                await user.reload();
                if (user.emailVerified) {
                    showAlert("Verification Success! 🚀", "success");
                    navigate('/dashboard');
                }
            }
        };

        const interval = setInterval(checkVerification, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [showSuccessUI, navigate, showAlert]);

    const handleResend = async () => {
        if (auth.currentUser) {
            const res = await sendVerification(auth.currentUser);
            if (res.success) showAlert("Re-sent! 📬", "success", "New link sent to your inbox.");
            else showAlert("Wait a moment", "warning", res.error);
        }
    };

    if (showSuccessUI) {
        return (
            <div className="w-full min-h-screen bg-black flex flex-col selection:bg-indigo-500/30">
                <Navbar />
                <main className="flex-grow flex items-center justify-center px-4 py-8 relative overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="w-full max-w-lg p-1px bg-gradient-to-b from-white/20 to-transparent rounded-3xl shadow-2xl z-10">
                        <div className="bg-[#0a0a0c]/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[calc(1.5rem-1px)] text-center space-y-8">
                            {/* Animated Icon Container */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                                    <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-inner ring-1 ring-white/20">
                                        <ShieldCheck className="w-16 h-16 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full border-4 border-[#0a0a0c] text-white">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="space-y-4">
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    Verify your email
                                </h1>
                                <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
                                    We've sent a secure verification link to:
                                    <span className="block mt-2 text-indigo-400 font-mono font-bold text-lg bg-indigo-500/10 py-1 px-3 rounded-lg border border-indigo-500/20">
                                        {email}
                                    </span>
                                </p>
                            </div>

                            {/* Features/Info List */}
                            <div className="grid grid-cols-1 gap-3 text-left py-4">
                                <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo]"></div>
                                    Check your <span className="text-white font-semibold">Inbox</span> or <span className="text-white font-semibold">Spam</span> folder.
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo]"></div>
                                    The link is valid for <span className="text-white font-semibold">limited time</span>.
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={handleResend}
                                    className="w-full py-3 px-6 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold rounded-2xl transition border border-indigo-500/20"
                                >
                                    Resend Verification Link
                                </button>

                                <p className="text-sm text-gray-500">
                                    Already verified? We'll automatically detect it and redirect you.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="py-6 text-center text-xs text-gray-600 border-t border-white/5">
                    © 2026 Linkly. All rights reserved.
                </footer>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-black flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-[#0a0a0c] border border-white/10 text-gray-100 space-y-4 sm:space-y-5">
                    <h3 className="text-center text-xl sm:text-2xl font-bold">Join Linkly</h3>
                    <p className="text-center text-gray-400 text-sm">Create your professional profile today.</p>
                    
                    <form onSubmit={onSignUp} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="text-sm font-bold text-gray-400">Email Address</label>
                            <div className="flex items-center mt-2 px-3 py-2.5 bg-white/5 rounded-xl border border-white/10 focus-within:border-indigo-500 transition">
                                <Mail className="w-5 h-5 text-indigo-400 mr-2" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent outline-none text-white text-sm sm:text-base"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400">Create Password</label>
                            <div className="flex items-center mt-2 px-3 py-2.5 bg-white/5 rounded-xl border border-white/10 focus-within:border-indigo-500 transition">
                                <Lock className="w-5 h-5 text-indigo-400 mr-2" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent outline-none text-white text-sm sm:text-base"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="text-red-400 font-bold text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                {errorMessage}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSigningUp}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-500/20 disabled:bg-gray-600"
                        >
                            {isSigningUp ? 'Creating Account...' : 'Get Started — Free'}
                        </button>
                    </form>
                    
                    <div className="pt-4 text-center border-t border-white/10">
                        <Link to="/login" className="text-gray-400 text-sm">
                            Already have an account? <span className="text-indigo-400 font-bold hover:underline">Sign in</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
