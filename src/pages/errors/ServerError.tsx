import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function ServerError() {
    const navigate = useNavigate();
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            // Simulate retry
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Reload the page
            window.location.reload();
        } catch (error) {
            setIsRetrying(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                {/* 500 Icon */}
                <div className="mx-auto h-32 w-32 bg-orange-100 rounded-full flex items-center justify-center mb-8">
                    <svg className="h-20 w-20 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Error Message */}
                <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Server Error</h2>
                <p className="text-gray-600 mb-8">
                    Something went wrong on our end. We're working to fix the issue. Please try again in a few moments.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Button
                        label={isRetrying ? "Retrying..." : "Try Again"}
                        icon={isRetrying ? "pi pi-spin pi-spinner" : "pi pi-refresh"}
                        className="w-full"
                        loading={isRetrying}
                        onClick={handleRetry}
                    />
                    <Button
                        label="Go to Dashboard"
                        icon="pi pi-home"
                        className="p-button-outlined w-full"
                        onClick={() => navigate('/dashboard')}
                    />
                </div>

                {/* Technical Details */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <details className="text-left">
                        <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                            Technical Details
                        </summary>
                        <div className="mt-4 p-4 bg-gray-100 rounded-md text-xs text-gray-600">
                            <p><strong>Error Code:</strong> 500 Internal Server Error</p>
                            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
                            <p><strong>Request ID:</strong> {Math.random().toString(36).substr(2, 9)}</p>
                            <p className="mt-2">
                                If this problem persists, please contact our support team with the error details above.
                            </p>
                        </div>
                    </details>
                </div>

                {/* Support Contact */}
                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Need help? Contact us at{' '}
                        <a href="mailto:support@example.com" className="text-indigo-600 hover:text-indigo-500">
                            support@example.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
} 