import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Wifi, WifiOff } from 'lucide-react';

export default function Offline() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        window.location.reload();
    };

    if (isOnline) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <div className="mx-auto h-32 w-32 bg-green-100 rounded-full flex items-center justify-center mb-8">
                        <Wifi className="h-20 w-20 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connection Restored</h2>
                    <p className="text-gray-600 mb-8">
                        You're back online! The page will reload automatically.
                    </p>
                    <Button
                        label="Reload Now"
                        icon="pi pi-refresh"
                        className="w-full"
                        onClick={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                {/* Offline Icon */}
                <div className="mx-auto h-32 w-32 bg-red-100 rounded-full flex items-center justify-center mb-8">
                    <WifiOff className="h-20 w-20 text-red-600" />
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Offline</h1>
                <p className="text-gray-600 mb-8">
                    It looks like you've lost your internet connection. Please check your network settings and try again.
                </p>

                {/* Troubleshooting Steps */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Troubleshooting Steps:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Check your Wi-Fi connection
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Try connecting to a different network
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Restart your router or modem
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Check if other websites are accessible
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Button
                        label={`Retry Connection (${retryCount})`}
                        icon="pi pi-refresh"
                        className="w-full"
                        onClick={handleRetry}
                    />
                    <Button
                        label="Check Network Settings"
                        icon="pi pi-cog"
                        className="p-button-outlined w-full"
                        onClick={() => {
                            // This would typically open network settings
                            alert('Please check your device\'s network settings');
                        }}
                    />
                </div>

                {/* Connection Status */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <WifiOff className="w-4 h-4" />
                        <span>No internet connection</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Last checked: {new Date().toLocaleTimeString()}
                    </p>
                </div>

                {/* Cached Content Notice */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Some features may still work if you have cached content available.
                    </p>
                </div>
            </div>
        </div>
    );
} 