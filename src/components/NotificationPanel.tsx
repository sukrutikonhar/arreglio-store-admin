import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import {
    Bell,
    AlertCircle,
    CheckCircle,
    Info,
    X,
    Search
} from 'lucide-react';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    category: 'order' | 'payment' | 'system' | 'customer' | 'inventory';
    timestamp: Date;
    read: boolean;
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
}

const mockNotifications: Notification[] = [
    {
        id: 1,
        title: 'New Order Received',
        message: 'Order #ORD-2024-001 has been placed by John Smith',
        type: 'info',
        category: 'order',
        timestamp: new Date('2024-01-20 10:30:00'),
        read: false,
        priority: 'high',
        actionUrl: '/orders/ORD-2024-001'
    },
    {
        id: 2,
        title: 'Payment Successful',
        message: 'Payment of $1,372.80 received for Order #ORD-2024-001',
        type: 'success',
        category: 'payment',
        timestamp: new Date('2024-01-20 11:15:00'),
        read: false,
        priority: 'medium'
    },
    {
        id: 3,
        title: 'Low Stock Alert',
        message: 'iPhone 15 Pro is running low on stock (5 units remaining)',
        type: 'warning',
        category: 'inventory',
        timestamp: new Date('2024-01-20 09:45:00'),
        read: true,
        priority: 'high',
        actionUrl: '/inventory'
    },
    {
        id: 4,
        title: 'Customer Support Request',
        message: 'New support ticket from Sarah Johnson regarding delivery',
        type: 'info',
        category: 'customer',
        timestamp: new Date('2024-01-20 08:20:00'),
        read: true,
        priority: 'medium',
        actionUrl: '/support/tickets'
    },
    {
        id: 5,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will begin in 30 minutes',
        type: 'warning',
        category: 'system',
        timestamp: new Date('2024-01-20 07:00:00'),
        read: false,
        priority: 'high'
    },
    {
        id: 6,
        title: 'Order Shipped',
        message: 'Order #ORD-2023-999 has been shipped via FedEx',
        type: 'success',
        category: 'order',
        timestamp: new Date('2024-01-19 16:30:00'),
        read: true,
        priority: 'medium'
    },
    {
        id: 7,
        title: 'Payment Failed',
        message: 'Payment for Order #ORD-2024-002 has failed',
        type: 'error',
        category: 'payment',
        timestamp: new Date('2024-01-19 14:20:00'),
        read: false,
        priority: 'high',
        actionUrl: '/orders/ORD-2024-002'
    },
    {
        id: 8,
        title: 'New Customer Registration',
        message: 'Emily Davis has registered as a new customer',
        type: 'info',
        category: 'customer',
        timestamp: new Date('2024-01-19 12:10:00'),
        read: true,
        priority: 'low'
    }
];

const typeOptions = [
    { label: 'All Types', value: null },
    { label: 'Info', value: 'info' },
    { label: 'Success', value: 'success' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' }
];

const categoryOptions = [
    { label: 'All Categories', value: null },
    { label: 'Orders', value: 'order' },
    { label: 'Payments', value: 'payment' },
    { label: 'System', value: 'system' },
    { label: 'Customers', value: 'customer' },
    { label: 'Inventory', value: 'inventory' }
];

const priorityOptions = [
    { label: 'All Priorities', value: null },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
];

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(mockNotifications);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [toast, setToast] = useState<any>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getPrioritySeverity = (priority: string) => {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'info';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'error': return <X className="w-4 h-4 text-red-500" />;
            case 'info': return <Info className="w-4 h-4 text-blue-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const handleMarkAsRead = (notificationId: number) => {
        setNotifications(notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setToast({
            severity: 'success',
            summary: 'Notifications Updated',
            detail: 'All notifications have been marked as read.',
            life: 3000
        });
    };

    const handleDeleteNotification = (notificationId: number) => {
        setNotifications(notifications.filter(n => n.id !== notificationId));
        setToast({
            severity: 'success',
            summary: 'Notification Deleted',
            detail: 'Notification has been deleted successfully.',
            life: 3000
        });
    };

    const handleClearAll = () => {
        setNotifications([]);
        setToast({
            severity: 'success',
            summary: 'Notifications Cleared',
            detail: 'All notifications have been cleared.',
            life: 3000
        });
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }

        if (notification.actionUrl) {
            // Navigate to the action URL
            window.location.href = notification.actionUrl;
        }
    };

    const filterNotifications = () => {
        let filtered = notifications;

        if (selectedType) {
            filtered = filtered.filter(n => n.type === selectedType);
        }

        if (selectedCategory) {
            filtered = filtered.filter(n => n.category === selectedCategory);
        }

        if (selectedPriority) {
            filtered = filtered.filter(n => n.priority === selectedPriority);
        }

        if (searchTerm) {
            filtered = filtered.filter(n =>
                n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredNotifications(filtered);
    };

    useEffect(() => {
        filterNotifications();
    }, [selectedType, selectedCategory, selectedPriority, searchTerm, notifications]);

    const notificationBodyTemplate = (rowData: Notification) => {
        return (
            <div
                className={`p-3 rounded-lg cursor-pointer transition-colors ${rowData.read ? 'bg-gray-50' : 'bg-blue-50'
                    } hover:bg-gray-100`}
                onClick={() => handleNotificationClick(rowData)}
            >
                <div className="flex items-start gap-3">
                    {getTypeIcon(rowData.type)}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium ${rowData.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                {rowData.title}
                            </h4>
                            <div className="flex items-center gap-2">
                                <Badge value={rowData.priority} severity={getPrioritySeverity(rowData.priority)} />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-text p-button-sm p-button-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNotification(rowData.id);
                                    }}
                                />
                            </div>
                        </div>
                        <p className={`text-sm ${rowData.read ? 'text-gray-600' : 'text-gray-700'} mb-2`}>
                            {rowData.message}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {rowData.timestamp.toLocaleString()}
                            </span>
                            <Badge value={rowData.category} severity="info" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Dialog
                header={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            <span className="text-lg font-semibold">Notifications</span>
                            {unreadCount > 0 && (
                                <Badge value={unreadCount} severity="danger" />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                icon="pi pi-cog"
                                className="p-button-text p-button-sm"
                                onClick={() => setShowSettings(true)}
                            />
                            <Button
                                icon="pi pi-times"
                                className="p-button-text p-button-sm"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                }
                visible={isOpen}
                onHide={onClose}
                style={{ width: '600px', maxWidth: '90vw' }}
                modal={false}
                position="top-right"
                className="notification-panel"
            >
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <InputText
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                            <Dropdown
                                value={selectedType}
                                options={typeOptions}
                                onChange={(e) => setSelectedType(e.value)}
                                placeholder="Type"
                                className="w-full"
                            />
                            <Dropdown
                                value={selectedCategory}
                                options={categoryOptions}
                                onChange={(e) => setSelectedCategory(e.value)}
                                placeholder="Category"
                                className="w-full"
                            />
                            <Dropdown
                                value={selectedPriority}
                                options={priorityOptions}
                                onChange={(e) => setSelectedPriority(e.value)}
                                placeholder="Priority"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                label="Mark All as Read"
                                icon="pi pi-check"
                                className="p-button-outlined p-button-sm"
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                            />
                            <Button
                                label="Clear All"
                                icon="pi pi-trash"
                                className="p-button-outlined p-button-sm p-button-danger"
                                onClick={handleClearAll}
                                disabled={notifications.length === 0}
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredNotifications.length} of {notifications.length} notifications
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {filteredNotifications.length > 0 ? (
                            <div className="space-y-2">
                                {filteredNotifications.map((notification) => (
                                    <div key={notification.id}>
                                        {notificationBodyTemplate(notification)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No notifications found</p>
                                <p className="text-sm text-gray-400">You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog
                header="Notification Settings"
                visible={showSettings}
                onHide={() => setShowSettings(false)}
                style={{ width: '500px' }}
                modal
            >
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Notification Preferences</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Email Notifications</span>
                                <Button
                                    icon="pi pi-check"
                                    className="p-button-sm"
                                    severity="success"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Push Notifications</span>
                                <Button
                                    icon="pi pi-check"
                                    className="p-button-sm"
                                    severity="success"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Sound Alerts</span>
                                <Button
                                    icon="pi pi-times"
                                    className="p-button-sm"
                                    severity="secondary"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
                        <div className="space-y-2">
                            {['Orders', 'Payments', 'System', 'Customers', 'Inventory'].map((type) => (
                                <div key={type} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{type}</span>
                                    <Button
                                        icon="pi pi-check"
                                        className="p-button-sm"
                                        severity="success"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowSettings(false)}
                        />
                        <Button
                            label="Save Settings"
                            onClick={() => {
                                setShowSettings(false);
                                setToast({
                                    severity: 'success',
                                    summary: 'Settings Saved',
                                    detail: 'Notification settings have been updated.',
                                    life: 3000
                                });
                            }}
                        />
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </>
    );
};

export default NotificationPanel; 