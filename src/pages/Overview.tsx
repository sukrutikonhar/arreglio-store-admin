import { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, MessageCircle, Paperclip, Clock, AlertCircle, CheckCircle2, PauseCircle, Bolt, XCircle, Filter, Plus, Edit, ArrowRight,
    MoreVertical
} from 'lucide-react';

const statuses = [
    { key: 'drop_by_customer', label: 'Drop by customer', color: 'bg-[#5CABE080]', topBarColor: '#5CABE0', border: 'border-[#D1D1D1]' },
    { key: 'received', label: 'Received', color: 'bg-[#A468BC80]', topBarColor: '#A468BC', border: 'border-[#D1D1D1]' },
    { key: 'work_in_progress', label: 'Work in Progress', color: 'bg-[#F4D03F80]', topBarColor: '#F4D03F', border: 'border-[#D1D1D1]' },
    { key: 'waiting_customer_reply', label: 'Waiting for Customer Reply', color: 'bg-[#E37C2180]', topBarColor: '#E37C21', border: 'border-[#D1D1D1]' },
    { key: 'waiting_for_parts', label: 'Waiting for Parts', color: 'bg-[#D8181880]', topBarColor: '#D81818', border: 'border-[#D1D1D1]' },
    { key: 'pickup_by_customer', label: 'Pickup by Customer', color: 'bg-[#58D68D]', topBarColor: '#58D68D', border: 'border-[#D1D1D1]' },
];

const mockUsers = [
    { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' },
    { name: 'John Smith', avatar: '/images/avatar/user1.jpg' },
    { name: 'Alice Johnson', avatar: '/images/avatar/user1.jpg' },
    { name: 'Bob Wilson', avatar: '/images/avatar/user1.jpg' },
];

const mockOrders = [
    { id: 17, status: 'work_in_progress', priority: 'high', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 1, attachments: 2, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 18, status: 'received', priority: 'normal', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 1, attachments: 1, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 19, status: 'drop_by_customer', priority: 'urgent', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 20, status: 'waiting_customer_reply', priority: 'on_hold', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 1, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 21, status: 'waiting_for_parts', priority: 'closed', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 22, status: 'pickup_by_customer', priority: 'completed', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 23, status: 'drop_by_customer', priority: 'normal', assigned: true, assignedUser: { name: 'John Smith', avatar: '/images/avatar/user1.jpg' }, comments: 2, attachments: 1, description: 'Urgent repair needed for customer equipment', date: 'Tomorrow 2:00 PM' },
    { id: 24, status: 'received', priority: 'high', assigned: true, assignedUser: { name: 'Alice Johnson', avatar: '/images/avatar/user1.jpg' }, comments: 3, attachments: 0, description: 'Regular maintenance check for office equipment', date: 'Friday 10:00 AM' },
    { id: 25, status: 'work_in_progress', priority: 'urgent', assigned: true, assignedUser: { name: 'Bob Wilson', avatar: '/images/avatar/user1.jpg' }, comments: 1, attachments: 2, description: 'System upgrade and configuration for new client', date: 'Today 4:00 PM' },
    { id: 26, status: 'waiting_customer_reply', priority: 'normal', assigned: true, assignedUser: { name: 'Jane Doe', avatar: '/images/avatar/user1.jpg' }, comments: 0, attachments: 1, description: 'Waiting for customer approval on proposed solution', date: 'Next Monday 9:00 AM' },
    { id: 27, status: 'waiting_for_parts', priority: 'high', assigned: true, assignedUser: { name: 'John Smith', avatar: '/images/avatar/user1.jpg' }, comments: 2, attachments: 0, description: 'Parts ordered, waiting for delivery from supplier', date: 'Wednesday 3:00 PM' },
    { id: 28, status: 'pickup_by_customer', priority: 'completed', assigned: true, assignedUser: { name: 'Alice Johnson', avatar: '/images/avatar/user1.jpg' }, comments: 1, attachments: 0, description: 'Completed repair, ready for customer pickup', date: 'Yesterday 5:00 PM' },
];

const priorityIcon = (priority: string) => {
    switch (priority) {
        case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
        case 'urgent': return <Bolt className="w-4 h-4 text-orange-500" />;
        case 'on_hold': return <PauseCircle className="w-4 h-4 text-yellow-500" />;
        case 'closed': return <XCircle className="w-4 h-4 text-gray-500" />;
        case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        default: return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
};

interface NewOrder {
    title: string;
    description: string;
    assignedTo: any;
    pickupDate: any;
    status: string;
}

export default function Overview() {
    const [collapsed, setCollapsed] = useState(statuses.map(() => false));
    const [orders, setOrders] = useState(mockOrders);
    const [optionsPanel, setOptionsPanel] = useState<{ open: boolean, orderId: number | null, x: number, y: number }>({ open: false, orderId: null, x: 0, y: 0 });
    const [showMoveSubmenu, setShowMoveSubmenu] = useState(false);
    const [createOrderModal, setCreateOrderModal] = useState(false);
    const [newOrder, setNewOrder] = useState<NewOrder>({
        title: '',
        description: '',
        assignedTo: null,
        pickupDate: null,
        status: 'drop_by_customer'
    });
    const [draggedOrder, setDraggedOrder] = useState<number | null>(null);
    const navigate = useNavigate();
    const optionsRef = useRef<HTMLDivElement>(null);
    const submenuRef = useRef<HTMLDivElement>(null);

    // Close options panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setOptionsPanel({ open: false, orderId: null, x: 0, y: 0 });
                setShowMoveSubmenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const calculateOptionsPosition = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const panelWidth = 200;
        const panelHeight = 150;

        // Start with position to the right of the button
        let x = rect.right + 10;
        let y = rect.top;

        // Check if panel would go off the right edge
        if (x + panelWidth > viewportWidth) {
            x = rect.left - panelWidth - 10; // Position to the left
        }

        // Check if panel would go off the bottom edge
        if (y + panelHeight > viewportHeight) {
            y = viewportHeight - panelHeight - 10;
        }

        // Ensure panel doesn't go off the top edge
        if (y < 10) {
            y = 10;
        }

        // Ensure panel doesn't go off the left edge
        if (x < 10) {
            x = 10;
        }

        return { x, y };
    };

    const handleOptionsClick = (e: React.MouseEvent, orderId: number) => {
        e.stopPropagation();
        const position = calculateOptionsPosition(e);
        setOptionsPanel({
            open: true,
            orderId,
            x: position.x,
            y: position.y
        });
        setShowMoveSubmenu(false);
    };

    const handleCardClick = (orderId: number) => {
        navigate(`/order/${orderId}`);
    };

    const handleMoveToColumn = (newStatus: string) => {
        if (optionsPanel.orderId) {
            setOrders(prev => prev.map(order =>
                order.id === optionsPanel.orderId
                    ? { ...order, status: newStatus }
                    : order
            ));
            setOptionsPanel({ open: false, orderId: null, x: 0, y: 0 });
            setShowMoveSubmenu(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, orderId: number) => {
        setDraggedOrder(orderId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault();
        if (draggedOrder) {
            setOrders(prev => prev.map(order =>
                order.id === draggedOrder
                    ? { ...order, status: targetStatus }
                    : order
            ));
            setDraggedOrder(null);
        }
    };

    const handleCreateOrder = () => {
        if (newOrder.title && newOrder.description && newOrder.assignedTo) {
            const newOrderData = {
                id: Math.max(...orders.map(o => o.id)) + 1,
                status: newOrder.status,
                priority: 'normal',
                assigned: true,
                assignedUser: newOrder.assignedTo,
                comments: 0,
                attachments: 0,
                description: newOrder.description,
                date: newOrder.pickupDate ? newOrder.pickupDate.format('YYYY-MM-DD HH:mm') : 'TBD'
            };
            setOrders(prev => [...prev, newOrderData]);
            setCreateOrderModal(false);
            setNewOrder({
                title: '',
                description: '',
                assignedTo: null,
                pickupDate: null,
                status: 'drop_by_customer'
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="flex justify-end items-center mb-6">
                {/* Filters */}
                <Button
                    icon={<Filter className="w-4 h-4" />}
                    label="Filters"
                    className="p-button-text bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 mr-3"
                />

                {/* Create Order */}
                <Button
                    icon={<Plus className="w-4 h-4" />}
                    label="Create Order"
                    className="p-button-success bg-green-600 hover:bg-green-700"
                    onClick={() => setCreateOrderModal(true)}
                />
            </div>

            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-6">
                {statuses.map((status, colIdx) => {
                    const columnOrders = orders.filter(o => o.status === status.key);
                    return (
                        <div key={status.key} className={`flex flex-col ${collapsed[colIdx] ? 'w-16' : 'w-80 min-w-[320px] max-w-xs'} bg-white rounded-lg shadow-sm border ${status.border} transition-all duration-300`} style={{ maxHeight: '80vh' }}>
                            {/* Column header - Sticky */}
                            <div
                                className={`flex items-center justify-between px-4 py-3 rounded-t-lg cursor-pointer sticky top-0 z-10 transition-all duration-300 ${collapsed[colIdx] ? 'h-32' : ''} ${collapsed[colIdx] ? status.color : status.color}`}
                                style={{
                                    color: 'white'
                                }}
                                onClick={() => setCollapsed(c => c.map((v, i) => i === colIdx ? !v : v))}
                            >
                                {collapsed[colIdx] ? (
                                    <div className="flex flex-col items-center justify-center h-full w-full">
                                        <ChevronRight className="w-5 h-5 mb-2 text-[#3B3B3B]" />
                                        <div className="text-center">
                                            <span className="text-xs font-medium text-[#3B3B3B] leading-tight block">
                                                {status.label.split(' ').map((word, index) => (
                                                    <span key={index} className="block">
                                                        {word}
                                                    </span>
                                                ))}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center justify-center w-6 h-6 text-sm font-normal bg-white bg-opacity-20 rounded-full border border-white border-opacity-30 text-[#7A7B7B]">
                                                {columnOrders.length}
                                            </span>
                                            <span className="flex items-center gap-2 font-medium text-lg text-[#3B3B3B]">
                                                {status.label}
                                            </span>
                                        </div>
                                        <ChevronLeft className="w-4 h-4 text-[#3B3B3B]" />
                                    </>
                                )}
                            </div>

                            {/* Scrollable cards area */}
                            {!collapsed[colIdx] && (
                                <div
                                    className="flex-1 overflow-y-auto px-3 py-3"
                                    style={{ minHeight: 100, maxHeight: '70vh' }}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, status.key)}
                                >
                                    {columnOrders.length === 0 && <div className="text-gray-400 text-center py-8 text-sm">No orders in this status.</div>}
                                    {columnOrders.map(order => {
                                        const statusData = statuses.find(s => s.key === order.status);
                                        return (
                                            <div
                                                key={order.id}
                                                className={`bg-white rounded-[9px] shadow-sm mb-4 relative group hover:shadow-md transition-shadow overflow-hidden cursor-pointer ${draggedOrder === order.id ? 'opacity-50' : ''}`}
                                                onClick={() => handleCardClick(order.id)}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, order.id)}
                                            >
                                                {/* Top colored bar */}
                                                <div
                                                    style={{
                                                        height: '7px',
                                                        backgroundColor: statusData?.topBarColor || '#eee',
                                                        borderTopLeftRadius: 9,
                                                        borderTopRightRadius: 9
                                                    }}
                                                />
                                                <div className="p-4">
                                                    {/* Options icon */}
                                                    <button
                                                        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 z-10"
                                                        onClick={(e) => handleOptionsClick(e, order.id)}
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                                    </button>

                                                    {/* Priority icon and Order title */}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        {priorityIcon(order.priority)}
                                                        <span className="font-semibold text-[#018545] bg-[#F5F5F5] px-2 py-1 rounded text-sm">
                                                            Order # {order.id}
                                                        </span>
                                                    </div>

                                                    {/* Assignee + Comments/Attachments Row */}
                                                    <div className="flex justify-between items-center mb-3">
                                                        {/* Left: Assignee */}
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={order.assignedUser.avatar}
                                                                alt={order.assignedUser.name}
                                                                className="w-6 h-6 rounded-full border border-gray-200"
                                                            />
                                                            <span className="text-xs text-[#5F5C5C]">Order assigned to</span>
                                                        </div>

                                                        {/* Right: Comments and Attachments */}
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1 text-[#707070] text-xs">
                                                                <MessageCircle className="w-3 h-3" /> {order.comments}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-[#707070] text-xs">
                                                                <Paperclip className="w-3 h-3" /> {order.attachments}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="text-sm text-gray-700 mb-3 leading-tight">
                                                        {order.description}
                                                    </div>

                                                    {/* Pickup date/time */}
                                                    <div className="flex items-center gap-2 text-sm text-[#5F5C5C]">
                                                        <Clock className="w-4 h-4" />
                                                        {order.date}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Options Panel */}
            {optionsPanel.open && (
                <div
                    ref={optionsRef}
                    className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
                    style={{
                        left: optionsPanel.x,
                        top: optionsPanel.y
                    }}
                >
                    <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                        onClick={() => {
                            if (optionsPanel.orderId) {
                                handleCardClick(optionsPanel.orderId);
                                setOptionsPanel({ open: false, orderId: null, x: 0, y: 0 });
                            }
                        }}
                    >
                        <ArrowRight className="w-4 h-4" />
                        Open
                    </button>
                    <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                        onClick={() => {
                            if (optionsPanel.orderId) {
                                handleCardClick(optionsPanel.orderId);
                                setOptionsPanel({ open: false, orderId: null, x: 0, y: 0 });
                            }
                        }}
                    >
                        <Edit className="w-4 h-4" />
                        Edit Details
                    </button>
                    <div className="relative">
                        <button
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-sm"
                            onMouseEnter={() => setShowMoveSubmenu(true)}
                        >
                            <span className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" />
                                Move to Column
                            </span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        {showMoveSubmenu && (
                            <div
                                ref={submenuRef}
                                className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[150px]"
                                onMouseEnter={() => setShowMoveSubmenu(true)}
                                onMouseLeave={() => setShowMoveSubmenu(false)}
                            >
                                {statuses.map(status => (
                                    <button
                                        key={status.key}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                                        onClick={() => handleMoveToColumn(status.key)}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Order Modal */}
            <Dialog
                visible={createOrderModal}
                onHide={() => setCreateOrderModal(false)}
                header="Create New Order"
                style={{ width: '500px' }}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button label="Cancel" className="p-button-text" onClick={() => setCreateOrderModal(false)} />
                        <Button label="Create Order" className="p-button-success" onClick={handleCreateOrder} />
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Title</label>
                        <InputText
                            value={newOrder.title}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter order title"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <InputText
                            value={newOrder.description}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter order description"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                        <Dropdown
                            value={newOrder.assignedTo}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, assignedTo: e.value }))}
                            options={mockUsers}
                            optionLabel="name"
                            placeholder="Select assignee"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date & Time</label>
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            value={newOrder.pickupDate}
                            onChange={(date) => setNewOrder(prev => ({ ...prev, pickupDate: date }))}
                            className="w-full"
                            placeholder="Select date and time"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <Dropdown
                            value={newOrder.status}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, status: e.value }))}
                            options={statuses}
                            optionLabel="label"
                            optionValue="key"
                            placeholder="Select status"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (Optional)</label>
                        <FileUpload
                            mode="basic"
                            name="file"
                            accept="*"
                            maxFileSize={1000000}
                            chooseLabel="Choose File"
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
} 