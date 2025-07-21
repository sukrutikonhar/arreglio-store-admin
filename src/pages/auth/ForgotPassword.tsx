import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
                {submitted ? (
                    <div className="text-green-600 mb-4">If this email exists, a reset link has been sent.</div>
                ) : (
                    <>
                        <div className="mb-4">
                            <label className="block mb-1">Email Address*</label>
                            <input
                                type="email"
                                className="w-full border rounded px-3 py-2"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                        >
                            Send Reset Link
                        </button>
                    </>
                )}
                <div className="mt-4 text-center text-sm">
                    <Link to="/auth/login" className="text-blue-600">Back to Login</Link>
                </div>
            </form>
        </div>
    );
} 