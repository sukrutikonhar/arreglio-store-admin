import { useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronUp,
    ChevronDown,
    EllipsisVertical,
    MessageCircle,
    Paperclip,
    Clock,
    AlertCircle,
    CheckCircle2,
    PauseCircle,
    Bolt,
    XCircle,
    UserPlus,
    Inbox,
    Cog,
    Check,
} from 'lucide-react';

const statuses = [
    { key: 'drop_by_customer', label: 'Drop by customer', color: 'bg-blue-100', border: 'border-blue-300', icon: <UserPlus className="w-4 h-4 text-blue-500" /> },
    { key: 'received', label: 'Received', color: 'bg-purple-100', border: 'border-purple-300', icon: <Inbox className="w-4 h-4 text-purple-500" /> },
    { key: 'work_in_progress', label: 'Work in Progress', color: 'bg-yellow-100', border: 'border-yellow-300', icon: <Cog className="w-4 h-4 text-yellow-500" /> },
    { key: 'waiting_customer_reply', label: 'Waiting for Customer Reply', color: 'bg-orange-100', border: 'border-orange-300', icon: <MessageCircle className="w-4 h-4 text-orange-500" /> },
    { key: 'waiting_for_parts', label: 'Waiting for Parts', color: 'bg-red-100', border: 'border-red-300', icon: <Cog className="w-4 h-4 text-red-500" /> },
    { key: 'pickup_by_customer', label: 'Pickup by Customer', color: 'bg-green-100', border: 'border-green-300', icon: <Check className="w-4 h-4 text-green-500" /> },
];

const mockOrders = [
    { id: 17, status: 'work_in_progress', priority: 'high', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 2, attachments: 1, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder)', date: 'Pickup date & Time' },
    { id: 18, status: 'received', priority: 'normal', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 1, attachments: 1, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder)', date: 'Pickup date & Time' },
    { id: 19, status: 'drop_by_customer', priority: 'urgent', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder)', date: 'Pickup date & Time' },
    { id: 20, status: 'waiting_customer_reply', priority: 'on_hold', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 1, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder)', date: 'Pickup date & Time' },
    { id: 21, status: 'waiting_for_parts', priority: 'closed', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder)', date: 'Pickup date & Time' },
    { id: 22, status: 'pickup_by_customer', priority: 'completed', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder)', date: 'Pickup date & Time' },
];

const priorityIcon = (priority: string) => {
    switch (priority) {
        case 'high': return <AlertCircle className="w-4 h-4 text-red-500 mr-1" />;
        case 'urgent': return <Bolt className="w-4 h-4 text-orange-500 mr-1" />;
        case 'on_hold': return <PauseCircle className="w-4 h-4 text-yellow-500 mr-1" />;
        case 'closed': return <XCircle className="w-4 h-4 text-gray-500 mr-1" />;
        case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />;
        default: return <AlertCircle className="w-4 h-4 text-blue-500 mr-1" />;
    }
};

export default function OverviewFit() {
    const [collapsed, setCollapsed] = useState(statuses.map(() => false));
    const [optionsPanel, setOptionsPanel] = useState<{ open: boolean, orderId: number | null }>({ open: false, orderId: null });
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-surface-50 p-2">
            <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold">Orders Overview</div>
                <div className="flex gap-2 items-center">
                    <Button icon="pi pi-filter" label="Filters" className="p-button-text text-xs" style={{ fontSize: '0.8rem' }} />
                    <Button icon="pi pi-plus" label="Create Order" className="p-button-success text-xs" style={{ fontSize: '0.8rem' }} />
                </div>
            </div>
            <div className="grid grid-cols-6 gap-2 w-full" style={{ minHeight: '80vh' }}>
                {statuses.map((status, colIdx) => {
                    const orders = mockOrders.filter(o => o.status === status.key);
                    return (
                        <div key={status.key} className={`flex flex-col bg-white rounded-lg shadow border ${status.border} min-w-0`} style={{ maxHeight: '80vh' }}>
                            {/* Column header */}
                            <div className={`flex items-center justify-between px-2 py-1 rounded-t-lg cursor-pointer ${status.color}`} style={{ fontSize: '0.95rem' }} onClick={() => setCollapsed(c => c.map((v, i) => i === colIdx ? !v : v))}>
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-xs bg-white rounded-full px-1.5 py-0.5 border border-gray-200">{orders.length}</span>
                                </div>
                                <div className="flex items-center gap-1 font-semibold text-xs text-gray-700">
                                    {status.icon}
                                    {status.label}
                                </div>
                                {collapsed[colIdx] ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronUp className="w-4 h-4 ml-1" />}
                            </div>
                            {/* Scrollable cards area */}
                            {!collapsed[colIdx] && (
                                <div className="flex-1 overflow-y-auto px-1 py-1" style={{ minHeight: 60, maxHeight: '70vh' }}>
                                    {orders.length === 0 && <div className="text-gray-400 text-center py-4 text-xs">No orders</div>}
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 mb-2 p-2 relative group" style={{ fontSize: '0.92rem' }}>
                                            {/* Options icon */}
                                            <button
                                                className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100"
                                                onClick={e => { e.stopPropagation(); setOptionsPanel({ open: true, orderId: order.id }); }}
                                            >
                                                <EllipsisVertical className="w-4 h-4 text-gray-500" />
                                            </button>
                                            {/* Status/Priority icon and Order title link */}
                                            <div className="flex items-center gap-1 mb-0.5">
                                                {priorityIcon(order.priority)}
                                                <Link
                                                    to={`/order/${order.id}`}
                                                    className="font-bold text-green-600 hover:underline text-xs"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    Order # {order.id}
                                                </Link>
                                            </div>
                                            {/* Assignee */}
                                            <div className="flex items-center gap-1 mb-0.5">
                                                <img src={order.assignedUser.avatar} alt={order.assignedUser.name} className="w-5 h-5 rounded-full border" />
                                                <span className="text-[10px] text-gray-500">Order assigned to</span>
                                            </div>
                                            {/* Comments and Attachments */}
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="flex items-center gap-0.5 text-gray-500 text-[10px]">
                                                    <MessageCircle className="w-3.5 h-3.5" /> {order.comments}
                                                </span>
                                                <span className="flex items-center gap-0.5 text-gray-500 text-[10px]">
                                                    <Paperclip className="w-3.5 h-3.5" /> {order.attachments}
                                                </span>
                                            </div>
                                            {/* Description */}
                                            <div className="text-[11px] text-gray-700 mb-1">
                                                {order.description}
                                            </div>
                                            {/* Pickup date/time */}
                                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                {order.date}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Options side panel */}
            <Sidebar visible={optionsPanel.open} position="right" onHide={() => setOptionsPanel({ open: false, orderId: null })} style={{ width: 260 }}>
                <div className="p-2">
                    <h3 className="text-base font-semibold mb-2">Order Actions</h3>
                    <Button label="Edit" className="w-full mb-1 text-xs" style={{ fontSize: '0.85rem' }} />
                    <Button label="Cancel" className="w-full mb-1 p-button-danger text-xs" style={{ fontSize: '0.85rem' }} />
                    <Button label="View Details" className="w-full mb-1 text-xs" style={{ fontSize: '0.85rem' }} onClick={() => {
                        if (optionsPanel.orderId) navigate(`/order/${optionsPanel.orderId}`);
                        setOptionsPanel({ open: false, orderId: null });
                    }} />
                </div>
            </Sidebar>
        </div>
    );
} 