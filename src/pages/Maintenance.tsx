import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import {
    Wrench,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Mail,
    Phone,
    MessageSquare
} from 'lucide-react';
import { Dialog } from 'primereact/dialog';

interface MaintenanceUpdate {
    id: number;
    timestamp: Date;
    status: 'in_progress' | 'completed' | 'pending' | 'failed';
    message: string;
    progress: number;
}

const mockUpdates: MaintenanceUpdate[] = [
    {
        id: 1,
        timestamp: new Date('2024-01-20 14:30:00'),
        status: 'completed',
        message: 'Database optimization completed successfully',
        progress: 100
    },
    {
        id: 2,
        timestamp: new Date('2024-01-20 14:15:00'),
        status: 'in_progress',
        message: 'Security patches installation in progress',
        progress: 75
    },
    {
        id: 3,
        timestamp: new Date('2024-01-20 14:00:00'),
        status: 'completed',
        message: 'System backup completed',
        progress: 100
    },
    {
        id: 4,
        timestamp: new Date('2024-01-20 13:45:00'),
        status: 'pending',
        message: 'Performance monitoring setup',
        progress: 0
    }
];

const Maintenance: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
    const [isOnline, setIsOnline] = useState(false);
    const [showContactDialog, setShowContactDialog] = useState(false);
    const [contactMethod, setContactMethod] = useState('email');
    const [contactMessage, setContactMessage] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsOnline(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'in_progress': return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
            case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <AlertTriangle className="w-5 h-5 text-orange-500" />;
        }
    };

    const handleContactSubmit = () => {
        // Here you would typically send the contact message
        console.log('Contact message sent:', { method: contactMethod, message: contactMessage });
        setShowContactDialog(false);
        setContactMessage('');
    };

    if (isOnline) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">System Online!</h1>
                    <p className="text-gray-600 mb-6">Maintenance has been completed successfully. The system is now back online.</p>
                    <Button
                        label="Continue to Application"
                        icon="pi pi-arrow-right"
                        onClick={() => window.location.href = '/'}
                        className="w-full"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <Wrench className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Scheduled Maintenance</h1>
                    <p className="text-xl text-gray-600 mb-4">
                        We're currently performing scheduled maintenance to improve our services.
                    </p>
                    <div className="text-3xl font-mono font-bold text-orange-600 mb-4">
                        {formatTime(timeLeft)}
                    </div>
                    <p className="text-sm text-gray-500">Estimated completion time</p>
                </div>

                {/* Progress Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Maintenance Progress</h2>
                    <div className="space-y-4">
                        {mockUpdates.map((update) => (
                            <div key={update.id} className="border-l-4 border-orange-500 pl-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(update.status)}
                                        <span className="font-medium text-gray-900">{update.message}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {update.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <ProgressBar
                                    value={update.progress}
                                    className="h-2"
                                    color={update.status === 'completed' ? 'green' : update.status === 'failed' ? 'red' : 'blue'}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="text-center">
                        <div className="p-4">
                            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-900 mb-1">Duration</h3>
                            <p className="text-sm text-gray-600">30 minutes</p>
                        </div>
                    </Card>
                    <Card className="text-center">
                        <div className="p-4">
                            <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-900 mb-1">Impact</h3>
                            <p className="text-sm text-gray-600">Minimal downtime</p>
                        </div>
                    </Card>
                    <Card className="text-center">
                        <div className="p-4">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-900 mb-1">Status</h3>
                            <p className="text-sm text-gray-600">In progress</p>
                        </div>
                    </Card>
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                    <p className="text-gray-600 mb-4">
                        If you have urgent matters or questions about this maintenance, please contact our support team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            label="Contact Support"
                            icon="pi pi-envelope"
                            onClick={() => setShowContactDialog(true)}
                            className="flex-1"
                        />
                        <Button
                            label="Check Status"
                            icon="pi pi-refresh"
                            className="p-button-outlined flex-1"
                        />
                    </div>
                </div>

                {/* Contact Dialog */}
                <Dialog
                    header="Contact Support"
                    visible={showContactDialog}
                    onHide={() => setShowContactDialog(false)}
                    style={{ width: '500px' }}
                    modal
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Method</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="contactMethod"
                                        value="email"
                                        checked={contactMethod === 'email'}
                                        onChange={(e) => setContactMethod(e.target.value)}
                                        className="mr-2"
                                    />
                                    <Mail className="w-4 h-4 mr-1" />
                                    Email
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="contactMethod"
                                        value="phone"
                                        checked={contactMethod === 'phone'}
                                        onChange={(e) => setContactMethod(e.target.value)}
                                        className="mr-2"
                                    />
                                    <Phone className="w-4 h-4 mr-1" />
                                    Phone
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="contactMethod"
                                        value="chat"
                                        checked={contactMethod === 'chat'}
                                        onChange={(e) => setContactMethod(e.target.value)}
                                        className="mr-2"
                                    />
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Chat
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                rows={4}
                                placeholder="Describe your urgent matter..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                label="Cancel"
                                className="p-button-text"
                                onClick={() => setShowContactDialog(false)}
                            />
                            <Button
                                label="Send Message"
                                onClick={handleContactSubmit}
                                disabled={!contactMessage.trim()}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Maintenance; 