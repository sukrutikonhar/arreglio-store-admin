import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                {/* 404 Icon */}
                <div className="mx-auto h-32 w-32 bg-red-100 rounded-full flex items-center justify-center mb-8">
                    <svg className="h-20 w-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>

                {/* Error Message */}
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Button
                        label="Go Back"
                        icon="pi pi-arrow-left"
                        className="w-full"
                        onClick={() => navigate(-1)}
                    />
                    <Button
                        label="Go to Dashboard"
                        icon="pi pi-home"
                        className="p-button-outlined w-full"
                        onClick={() => navigate('/dashboard')}
                    />
                </div>

                {/* Helpful Links */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">You might want to check these pages:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate('/overview')}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 