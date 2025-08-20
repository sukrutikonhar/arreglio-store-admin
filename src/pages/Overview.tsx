import { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

import { TieredMenu } from 'primereact/tieredmenu';
import type { TieredMenu as TieredMenuType } from 'primereact/tieredmenu';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useTeamContext } from '../context/TeamContext';
import { useServiceContext } from '../context/ServiceContext';
import {
    ChevronLeft, ChevronRight, MessageCircle, Clock, AlertCircle, Bolt, Filter, Plus,
    MoreVertical, User, Calendar, Tag
} from 'lucide-react';

const statuses = [
    { key: 'drop_by_customer', label: 'Drop by customer', color: 'bg-[#5CABE080]', topBarColor: '#5CABE0', border: 'border-[#D1D1D1]' },
    { key: 'received', label: 'Received', color: 'bg-[#A468BC80]', topBarColor: '#A468BC', border: 'border-[#D1D1D1]' },
    { key: 'work_in_progress', label: 'Work in Progress', color: 'bg-[#F4D03F80]', topBarColor: '#F4D03F', border: 'border-[#D1D1D1]' },
    { key: 'waiting_customer_reply', label: 'Waiting for Customer Reply', color: 'bg-[#E37C2180]', topBarColor: '#E37C21', border: 'border-[#D1D1D1]' },
    { key: 'waiting_for_parts', label: 'Waiting for Parts', color: 'bg-[#D8181880]', topBarColor: '#D81818', border: 'border-[#D1D1D1]' },
    { key: 'pickup_by_customer', label: 'Pickup by Customer', color: 'bg-[#58D68D]', topBarColor: '#58D68D', border: 'border-[#D1D1D1]' },
];

const priorities = [
    { key: 'low', label: 'Low', color: 'text-blue-500', icon: <AlertCircle className="w-4 h-4 text-blue-500" /> },
    { key: 'normal', label: 'Normal', color: 'text-green-500', icon: <AlertCircle className="w-4 h-4 text-green-500" /> },
    { key: 'high', label: 'High', color: 'text-orange-500', icon: <AlertCircle className="w-4 h-4 text-orange-500" /> },
    { key: 'urgent', label: 'Urgent', color: 'text-red-500', icon: <Bolt className="w-4 h-4 text-red-500" /> },
];



const mockOrders = [
    { id: 17, orderNumber: 'ORD-1017', status: 'work_in_progress', priority: 'high', assigned: true, assignedUser: { name: 'Jane Doe', avatar: null }, comments: 1, attachments: 2, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 18, orderNumber: 'ORD-1018', status: 'received', priority: 'normal', assigned: true, assignedUser: { name: 'Jane Doe', avatar: null }, comments: 1, attachments: 1, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 19, orderNumber: 'ORD-1019', status: 'drop_by_customer', priority: 'urgent', assigned: true, assignedUser: { name: 'Alice Johnson', avatar: null }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 20, orderNumber: 'ORD-1020', status: 'waiting_customer_reply', priority: 'on_hold', assigned: true, assignedUser: { name: 'Bob Wilson', avatar: null }, comments: 1, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 21, orderNumber: 'ORD-1021', status: 'waiting_for_parts', priority: 'closed', assigned: true, assignedUser: { name: 'John Smith', avatar: null }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 22, orderNumber: 'ORD-1022', status: 'pickup_by_customer', priority: 'completed', assigned: true, assignedUser: { name: 'Alice Johnson', avatar: null }, comments: 0, attachments: 0, description: 'Delivery Instructions (Lorem ipsum is simply dummy text used for placeholder when real text is not )', date: 'Pickup date & Time' },
    { id: 23, orderNumber: 'ORD-1023', status: 'drop_by_customer', priority: 'normal', assigned: true, assignedUser: { name: 'Jane Doe', avatar: null }, comments: 2, attachments: 1, description: 'Urgent repair needed for customer equipment', date: 'Tomorrow 2:00 PM' },
    { id: 24, orderNumber: 'ORD-1024', status: 'received', priority: 'high', assigned: true, assignedUser: { name: 'Alice Johnson', avatar: null }, comments: 0, attachments: 0, description: 'Regular maintenance check for office equipment', date: 'Friday 10:00 AM' },
    { id: 25, orderNumber: 'ORD-1025', status: 'work_in_progress', priority: 'urgent', assigned: true, assignedUser: { name: 'Bob Wilson', avatar: null }, comments: 1, attachments: 2, description: 'System upgrade and configuration for new client', date: 'Today 4:00 PM' },
    { id: 26, orderNumber: 'ORD-1026', status: 'waiting_customer_reply', priority: 'normal', assigned: true, assignedUser: { name: 'Jane Doe', avatar: null }, comments: 0, attachments: 1, description: 'Waiting for customer approval on proposed solution', date: 'Next Monday 9:00 AM' },
    { id: 27, orderNumber: 'ORD-1027', status: 'waiting_for_parts', priority: 'high', assigned: true, assignedUser: { name: 'John Smith', avatar: null }, comments: 2, attachments: 0, description: 'Parts ordered, waiting for delivery from supplier', date: 'Wednesday 3:00 PM' },
    { id: 28, orderNumber: 'ORD-1028', status: 'pickup_by_customer', priority: 'completed', assigned: true, assignedUser: { name: 'Alice Johnson', avatar: null }, comments: 1, attachments: 0, description: 'Completed repair, ready for customer pickup', date: 'Yesterday 5:00 PM' },
];

const priorityIcon = (priority: string) => {
    const priorityData = priorities.find(p => p.key === priority);
    return priorityData ? priorityData.icon : <AlertCircle className="w-4 h-4 text-blue-500" />;
};

interface NewOrder {
    customerType: 'individual' | 'organization';
    firstName: string;
    lastName: string;
    organizationName: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    assignedTo: any;
    pickupDate: any;
    status: string;
    priority: string;
    selectedServices: any[];
    estimatedCost: string;
    // Vehicle information
    vehicleBrand: string;
    vehicleColor: string;
}

interface Order {
    id: number;
    orderNumber?: string; // Add formatted order number
    status: string;
    priority: string;
    assigned: boolean;
    assignedUser: { name: string; avatar: string | null };
    comments: number;
    attachments: number;
    description: string;
    date: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    estimatedCost?: string;
}

export default function Overview() {
    const { teamMembers } = useTeamContext();
    const { services } = useServiceContext();
    const [collapsed, setCollapsed] = useState(statuses.map(() => false));
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [createOrderModal, setCreateOrderModal] = useState(false);
    const [newOrder, setNewOrder] = useState<NewOrder>({
        customerType: 'individual',
        firstName: '',
        lastName: '',
        organizationName: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        assignedTo: null,
        pickupDate: null,
        status: 'drop_by_customer',
        priority: 'normal',
        selectedServices: [],
        estimatedCost: '',
        vehicleBrand: '',
        vehicleColor: ''
    });
    const [draggedOrder, setDraggedOrder] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Service selection state
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showServices, setShowServices] = useState<boolean>(false);

    // Check for new orders from CreateOrder page
    useEffect(() => {
        const newOrderData = localStorage.getItem('newOrder');
        if (newOrderData) {
            try {
                const orderData = JSON.parse(newOrderData);
                // Add the new order to the beginning of the orders array
                setOrders(prev => [orderData, ...prev]);
                // Remove from localStorage
                localStorage.removeItem('newOrder');

                // Show success toast
                toast.current?.show({
                    severity: 'success',
                    summary: 'New Order Added',
                    detail: `${orderData.orderNumber || `Order #${orderData.id}`} has been added to the kanban board!`,
                    life: 5000
                });
            } catch (error) {
                console.error('Error parsing new order data:', error);
                localStorage.removeItem('newOrder');
            }
        }
    }, []);

    const navigate = useNavigate();
    const menuRef = useRef<TieredMenuType | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const toast = useRef<Toast>(null);

    // Menu items for the options menu
    const orderMenuItems = [
        {
            label: 'Open',
            icon: 'pi pi-external-link',
            command: () => { if (selectedOrderId) handleCardClick(selectedOrderId); }
        },
        {
            label: 'Edit Details',
            icon: 'pi pi-pencil',
            command: () => { if (selectedOrderId) handleCardClick(selectedOrderId); }
        },
        {
            label: 'Move to Column',
            icon: 'pi pi-arrow-right',
            items: [
                {
                    label: 'Drop by customer',
                    icon: 'pi pi-user',
                    command: () => handleMoveToColumn('drop_by_customer')
                },
                {
                    label: 'Received',
                    icon: 'pi pi-inbox',
                    command: () => handleMoveToColumn('received')
                },
                {
                    label: 'Work in Progress',
                    icon: 'pi pi-cog',
                    command: () => handleMoveToColumn('work_in_progress')
                },
                {
                    label: 'Waiting for Customer Reply',
                    icon: 'pi pi-envelope',
                    command: () => handleMoveToColumn('waiting_customer_reply')
                },
                {
                    label: 'Waiting for Parts',
                    icon: 'pi pi-truck',
                    command: () => handleMoveToColumn('waiting_for_parts')
                },
                {
                    label: 'Pickup by Customer',
                    icon: 'pi pi-check',
                    command: () => handleMoveToColumn('pickup_by_customer')
                },
            ]
        }
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!newOrder.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!newOrder.assignedTo) {
            newErrors.assignedTo = 'Please assign the order to someone';
        }

        if (newOrder.customerType === 'individual') {
            if (!newOrder.firstName.trim()) {
                newErrors.firstName = 'First name is required';
            }
            if (!newOrder.lastName.trim()) {
                newErrors.lastName = 'Last name is required';
            }
        } else {
            if (!newOrder.organizationName.trim()) {
                newErrors.organizationName = 'Organization name is required';
            }
        }

        if (!newOrder.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newOrder.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!newOrder.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };





    const handleOptionsClick = (e: React.MouseEvent, orderId: number) => {
        e.stopPropagation();
        setSelectedOrderId(orderId);
        menuRef.current?.toggle(e);
    };

    const handleCardClick = (orderId: number) => {
        navigate(`/order/${orderId}`);
    };

    const handleMoveToColumn = (newStatus: string) => {
        if (selectedOrderId) {
            setOrders(prev => prev.map(order =>
                order.id === selectedOrderId
                    ? { ...order, status: newStatus }
                    : order
            ));
            toast.current?.show({
                severity: 'success',
                summary: 'Order Moved',
                detail: `${orders.find(o => o.id === selectedOrderId)?.orderNumber || `Order #${selectedOrderId}`} moved to ${statuses.find(s => s.key === newStatus)?.label}`,
                life: 3000
            });
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
            toast.current?.show({
                severity: 'success',
                summary: 'Order Moved',
                detail: `${orders.find(o => o.id === draggedOrder)?.orderNumber || `Order #${draggedOrder}`} moved to ${statuses.find(s => s.key === targetStatus)?.label}`,
                life: 3000
            });
            setDraggedOrder(null);
        }
    };

    const handleCreateOrder = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newOrderData: Order = {
                id: Math.max(...orders.map(o => o.id)) + 1,
                status: newOrder.status,
                priority: newOrder.priority,
                assigned: true,
                assignedUser: newOrder.assignedTo,
                comments: 0,
                attachments: 0,
                description: newOrder.description,
                date: newOrder.pickupDate ? newOrder.pickupDate.format('YYYY-MM-DD HH:mm') : 'TBD',
                customerName: newOrder.customerType === 'individual'
                    ? `${newOrder.firstName} ${newOrder.lastName}`
                    : newOrder.organizationName,
                customerEmail: newOrder.email,
                customerPhone: newOrder.phone,
                estimatedCost: newOrder.estimatedCost,
            };

            setOrders(prev => [newOrderData, ...prev]);

            // Reset form
            setNewOrder({
                customerType: 'individual',
                firstName: '',
                lastName: '',
                organizationName: '',
                email: '',
                phone: '',
                address: '',
                description: '',
                assignedTo: null,
                pickupDate: null,
                status: 'drop_by_customer',
                priority: 'normal',
                selectedServices: [],
                estimatedCost: '',
                vehicleBrand: '',
                vehicleColor: ''
            });

            setCreateOrderModal(false);
            setErrors({});

            toast.current?.show({
                severity: 'success',
                summary: 'Order Created',
                detail: `${newOrderData.orderNumber || `Order #${newOrderData.id}`} has been created successfully!`,
                life: 5000
            });

        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create order. Please try again.',
                life: 5000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setNewOrder({
            customerType: 'individual',
            firstName: '',
            lastName: '',
            organizationName: '',
            email: '',
            phone: '',
            address: '',
            description: '',
            assignedTo: null,
            pickupDate: null,
            status: 'drop_by_customer',
            priority: 'normal',
            selectedServices: [],
            estimatedCost: '',
            vehicleBrand: '',
            vehicleColor: ''
        });
        setErrors({});
        setSelectedCategory(null);
        setShowServices(false);
    };

    // Service selection helper functions
    const getCategories = () => {
        const categories = [...new Set(services.map(service => service.category))];
        return categories.map(category => ({
            name: category,
            serviceCount: services.filter(service => service.category === category).length
        }));
    };

    const getServicesForCategory = (category: string) => {
        return services.filter(service => service.category === category);
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setShowServices(true);
    };

    const handleBackToCategories = () => {
        setShowServices(false);
        setSelectedCategory(null);
    };

    const handleServiceToggle = (service: any) => {
        const isSelected = newOrder.selectedServices.some(s => s.id === service.id);
        let updatedServices;

        if (isSelected) {
            updatedServices = newOrder.selectedServices.filter(s => s.id !== service.id);
        } else {
            updatedServices = [...newOrder.selectedServices, service];
        }

        const totalCost = updatedServices.reduce((total, s) => total + s.price, 0);

        setNewOrder(prev => ({
            ...prev,
            selectedServices: updatedServices,
            estimatedCost: totalCost.toString()
        }));
    };





    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const menu = menuRef.current;
            if (
                menu &&
                typeof menu.getElement === 'function'
            ) {
                const menuElement = menu.getElement();
                if (menuElement && !menuElement.contains(event.target as Node)) {
                    (menuRef.current as any)?.hide?.(event as any);
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            <Toast ref={toast} />

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
                                                            {order.orderNumber || `Order #${order.id}`}
                                                        </span>
                                                    </div>



                                                    {/* Customer info if exists */}
                                                    {order.customerName && (
                                                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                                                            <User className="w-3 h-3" />
                                                            {order.customerName}
                                                        </div>
                                                    )}



                                                    {/* Assignee + Comments/Attachments Row */}
                                                    <div className="flex justify-between items-center mb-3">
                                                        {/* Left: Assignee */}
                                                        <div className="flex items-center gap-2">
                                                            {order.assignedUser.avatar ? (
                                                                <img
                                                                    src={order.assignedUser.avatar}
                                                                    alt={order.assignedUser.name}
                                                                    className="w-6 h-6 rounded-full border border-gray-200 object-cover"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        target.nextElementSibling?.classList.remove('hidden');
                                                                    }}
                                                                />
                                                            ) : null}
                                                            {!order.assignedUser.avatar && (
                                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                                                    {order.assignedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                                </div>
                                                            )}
                                                            <span className="text-xs text-[#5F5C5C] font-medium">{order.assignedUser.name}</span>
                                                        </div>

                                                        {/* Right: Comments and Attachments */}
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1 text-[#707070] text-xs">
                                                                <MessageCircle className="w-3 h-3" /> {order.comments}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-[#707070] text-xs">
                                                                {order.attachments}
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

                                                    {/* Estimated cost if exists */}
                                                    {order.estimatedCost && (
                                                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium mt-2">
                                                            <span className="text-green-600">$</span>
                                                            {order.estimatedCost}
                                                        </div>
                                                    )}
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

            {/* Create Order Modal */}
            <Dialog
                visible={createOrderModal}
                onHide={() => {
                    setCreateOrderModal(false);
                    resetForm();
                }}
                header="Create New Order"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => {
                                setCreateOrderModal(false);
                                resetForm();
                            }}
                        />
                        <Button
                            label={isSubmitting ? "Creating..." : "Create Order"}
                            className="p-button-success"
                            onClick={handleCreateOrder}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        />
                    </div>
                }
            >
                <div className="space-y-6 overflow-y-auto">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                value={newOrder.priority}
                                onChange={(e) => setNewOrder(prev => ({ ...prev, priority: e.value }))}
                                options={priorities}
                                optionLabel="label"
                                optionValue="key"
                                placeholder="Select priority"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order Number
                            </label>
                            <InputText
                                value={`ORD-${Math.max(...orders.map(o => o.id)) + 1}`}
                                className="w-full bg-gray-50"
                                disabled
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <InputTextarea
                            value={newOrder.description}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter order description"
                            rows={3}
                            className={`w-full ${errors.description ? 'p-invalid' : ''}`}
                        />
                        {errors.description && <small className="p-error">{errors.description}</small>}
                    </div>

                    {/* Customer Information */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Customer Information
                        </h3>

                        {/* Customer Type Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Type <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="customerType"
                                        value="individual"
                                        checked={newOrder.customerType === 'individual'}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, customerType: e.target.value as 'individual' | 'organization' }))}
                                        className="text-primary"
                                    />
                                    <span className="text-sm">Individual</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="customerType"
                                        value="organization"
                                        checked={newOrder.customerType === 'organization'}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, customerType: e.target.value as 'individual' | 'organization' }))}
                                        className="text-primary"
                                    />
                                    <span className="text-sm">Organization</span>
                                </label>
                            </div>
                        </div>

                        {/* Dynamic Customer Fields */}
                        {newOrder.customerType === 'individual' ? (
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <InputText
                                        value={newOrder.firstName}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, firstName: e.target.value }))}
                                        placeholder="Enter first name"
                                        className={`w-full ${errors.firstName ? 'p-invalid' : ''}`}
                                    />
                                    {errors.firstName && <small className="p-error">{errors.firstName}</small>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <InputText
                                        value={newOrder.lastName}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, lastName: e.target.value }))}
                                        placeholder="Enter last name"
                                        className={`w-full ${errors.lastName ? 'p-invalid' : ''}`}
                                    />
                                    {errors.lastName && <small className="p-error">{errors.lastName}</small>}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Organization Name <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    value={newOrder.organizationName}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, organizationName: e.target.value }))}
                                    placeholder="Enter organization name"
                                    className={`w-full ${errors.organizationName ? 'p-invalid' : ''}`}
                                />
                                {errors.organizationName && <small className="p-error">{errors.organizationName}</small>}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    value={newOrder.email}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Enter email"
                                    className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                                />
                                {errors.email && <small className="p-error">{errors.email}</small>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    value={newOrder.phone}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Enter phone number"
                                    className={`w-full ${errors.phone ? 'p-invalid' : ''}`}
                                />
                                {errors.phone && <small className="p-error">{errors.phone}</small>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <InputTextarea
                                value={newOrder.address}
                                onChange={(e) => setNewOrder(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Enter address"
                                rows={2}
                                className="w-full"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estimated Cost (Auto-calculated)
                            </label>
                            <InputText
                                value={newOrder.estimatedCost || '0'}
                                className="w-full bg-gray-50"
                                disabled
                            />
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Vehicle Information
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand Name
                                </label>
                                <InputText
                                    value={newOrder.vehicleBrand}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, vehicleBrand: e.target.value }))}
                                    placeholder="Enter vehicle brand"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color
                                </label>
                                <InputText
                                    value={newOrder.vehicleColor}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, vehicleColor: e.target.value }))}
                                    placeholder="Enter vehicle color"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services Selection */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Services Selection
                        </h3>

                        <div className="space-y-4">
                            {!showServices ? (
                                <>
                                    <div className="text-sm text-gray-600 mb-4">
                                        Select a service category to view available services
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {getCategories().map((category) => (
                                            <div
                                                key={category.name}
                                                onClick={() => handleCategorySelect(category.name)}
                                                className="p-4 border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {category.serviceCount} service{category.serviceCount !== 1 ? 's' : ''} available
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Button
                                            type="button"
                                            onClick={handleBackToCategories}
                                            className="p-button-text p-button-sm"
                                            icon={<ChevronLeft className="w-4 h-4" />}
                                            label="Back to Categories"
                                        />
                                    </div>

                                    <div className="text-sm text-gray-600 mb-4">
                                        Select services from <span className="font-medium">{selectedCategory}</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                                        {getServicesForCategory(selectedCategory || '').map((service) => {
                                            const isSelected = newOrder.selectedServices.some(s => s.id === service.id);
                                            return (
                                                <div
                                                    key={service.id}
                                                    onClick={() => handleServiceToggle(service)}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${isSelected
                                                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                                            : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">{service.serviceName}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">{service.serviceDescription}</p>
                                                        </div>
                                                        <div className="ml-4 text-right">
                                                            <div className="text-lg font-semibold text-secondary">${service.price}</div>
                                                            {isSelected && (
                                                                <div className="text-xs text-primary font-medium mt-1">Selected</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Selected Services Summary */}
                                    {newOrder.selectedServices.length > 0 && (
                                        <div className="p-3 bg-secondary/5 rounded-lg mt-4">
                                            <div className="font-medium text-gray-800 mb-2">Selected Services:</div>
                                            <div className="space-y-1">
                                                {newOrder.selectedServices.map((service) => (
                                                    <div key={service.id} className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-700">{service.serviceName}</span>
                                                        <span className="font-medium text-secondary">${service.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex items-center justify-between font-semibold">
                                                    <span>Services Total:</span>
                                                    <span className="text-secondary">
                                                        ${newOrder.selectedServices.reduce((total, service) => total + service.price, 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>



                    {/* Assignment and Scheduling */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Assignment & Scheduling
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assign To <span className="text-red-500">*</span>
                                </label>
                                <Dropdown
                                    value={newOrder.assignedTo}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, assignedTo: e.value }))}
                                    options={teamMembers}
                                    optionLabel="name"
                                    placeholder="Select assignee"
                                    className={`w-full ${errors.assignedTo ? 'p-invalid' : ''}`}
                                />
                                {errors.assignedTo && <small className="p-error">{errors.assignedTo}</small>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pickup Date & Time
                                </label>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    value={newOrder.pickupDate}
                                    onChange={(date) => setNewOrder(prev => ({ ...prev, pickupDate: date }))}
                                    className="w-full"
                                    placeholder="Select date and time"
                                    getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
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
                    </div>




                </div>
            </Dialog>

            {/* Order Options Menu */}
            <TieredMenu model={orderMenuItems} popup ref={menuRef} />
        </div>
    );
} 