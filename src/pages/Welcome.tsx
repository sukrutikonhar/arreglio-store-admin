import { Link } from 'react-router-dom';

export default function Welcome() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-10 rounded shadow-md w-full max-w-lg text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Arreglio Admin</h1>
                <p className="mb-8 text-gray-600">Manage your store website and orders with ease. Please log in or create an account to get started.</p>
                <div className="flex justify-center gap-4">
                    <Link to="/auth/login" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition">Log In</Link>
                    <Link to="/auth/register" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">Sign Up</Link>
                </div>
            </div>
        </div>
    );
} 