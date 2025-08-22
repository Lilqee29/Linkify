import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { doCreateUserWithEmailAndPassword, doSendEmailVerification} from '../../../firebase/auth';
import { createUserProfile } from '../../../firebase/db'; // Import Firestore profile creation
import Navbar from "../../Navbar"; // using your Navbar
import { Mail, Lock } from 'lucide-react';
import { sendVerification } from '../../../firebase/SendVerification';


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // 🔹 useNavigate to redirect after success




    const onSignUp = async (e) => {
        e.preventDefault();
        if (isSigningUp) return;

        setIsSigningUp(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // 1️⃣ Create user in Firebase Auth
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 2️⃣ Create Firestore profile doc
            await createUserProfile(user);

            // 3️⃣ Send email verification
            await sendVerification(user);

            // 4️⃣ Success message
            setSuccessMessage('✅ Account created! Check your email to verify your account.');

            // Clear input fields
            setEmail('');
            setPassword('');

            // Redirect after delay
            setTimeout(() => navigate('/login'), 3000);

        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSigningUp(false);
        }
    };


    return (
        <div className="w-full min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl 
                                bg-white/10 backdrop-blur-lg border border-white/20 
                                text-gray-100 space-y-5">
                    
                    <h3 className="text-center text-2xl font-semibold">Create an Account</h3>

                    <form onSubmit={onSignUp} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="text-sm font-bold">Email</label>
                            <div className="flex items-center mt-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                                <Mail className="w-5 h-5 text-indigo-400 mr-2" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-100"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-bold">Password</label>
                            <div className="flex items-center mt-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                                <Lock className="w-5 h-5 text-indigo-400 mr-2" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-100"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {/* Error / Success Messages */}
                        {errorMessage && <div className="text-red-400 font-bold">{errorMessage}</div>}
                        {successMessage && <div className="text-green-400 font-bold">{successMessage}</div>}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isSigningUp}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg 
                                       transition ${isSigningUp
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
                        >
                            {isSigningUp ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-300">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-indigo-400 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Register;
