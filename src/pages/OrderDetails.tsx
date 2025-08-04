import { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { PencilIcon } from '@heroicons/react/24/solid';
import { Menu } from 'primereact/menu';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ChromePicker } from "react-color";
import {
    AlertTriangle,
    PauseCircle,
    CheckCircle,
    Loader2,
    MessageCircle,
    Package,
    Inbox,
    Truck,
    XCircle,
    CirclePlus,
    Search,
    Edit,
    User,
    Tag,
    Paperclip,
    Play,
    Pause,
    Plus,
    Trash2,
    ChevronRight,
    MoreVertical
} from 'lucide-react';

// Custom styles for PhoneInput
const phoneInputStyles = `
  .PhoneInput {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    transition: border-color 0.2s;
  }
  
  .PhoneInput:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
  
  .PhoneInputCountry {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-right: 1px solid #d1d5db;
    background: #f9fafb;
  }
  
  .PhoneInputCountrySelect {
    border: none;
    background: transparent;
    font-size: 14px;
    padding: 0.5rem;
    outline: none;
  }
  
  .PhoneInputInput {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 14px;
  }
  
  .PhoneInputInput::placeholder {
    color: #9ca3af;
  }
`;

// Label interface
interface Label {
    id: string;
    name: string;
    icon: any;
    color: string;
    bgColor: string;
    textColor: string;
    isCustom?: boolean;
}

export default function OrderDetails() {
    const [qrOpen, setQrOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [customerInfoOpen, setCustomerInfoOpen] = useState(false);
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [additionalOrderOpen, setAdditionalOrderOpen] = useState(false);
    const [labelDialogOpen, setLabelDialogOpen] = useState(false);
    const [customLabelDialogOpen, setCustomLabelDialogOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number[]>([0]);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('Work in Progress');
    const [customLabelName, setCustomLabelName] = useState('');
    const [customLabelColor, setCustomLabelColor] = useState('#3B82F6');
    const [customerInfo, setCustomerInfo] = useState({
        referenceNumber: 'ORD-2025-001',
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        notes: '',
        customerType: 'Regular'
    });
    const [additionalOrder, setAdditionalOrder] = useState({
        title: '',
        price: '',
        description: '',
        customerWillPay: false
    });

    const menuRef = useRef<Menu>(null);

    // Predefined labels
    const predefinedLabels: Label[] = [
        { id: 'high-priority', name: 'High Priority', icon: AlertTriangle, color: '#EF4444', bgColor: 'bg-red-100', textColor: 'text-red-600' },
        { id: 'on-hold', name: 'On Hold', icon: PauseCircle, color: '#F59E0B', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
        { id: 'completed', name: 'Completed', icon: CheckCircle, color: '#10B981', bgColor: 'bg-green-100', textColor: 'text-green-600' },
        { id: 'in-progress', name: 'In Progress', icon: Loader2, color: '#3B82F6', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
        { id: 'waiting-reply', name: 'Waiting for Reply', icon: MessageCircle, color: '#8B5CF6', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
        { id: 'waiting-parts', name: 'Waiting for Parts', icon: Package, color: '#F97316', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
        { id: 'received', name: 'Received', icon: Inbox, color: '#6B7280', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
        { id: 'ready-pickup', name: 'Ready for Pickup', icon: Truck, color: '#6366F1', bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
        { id: 'cancelled', name: 'Cancelled', icon: XCircle, color: '#6B7280', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
    ];

    // Custom labels state
    const [customLabels, setCustomLabels] = useState<Label[]>([]);

    // Initialize selected label
    useEffect(() => {
        if (!selectedLabel) {
            setSelectedLabel(predefinedLabels[0]); // Default to High Priority
        }
    }, []);

    // Timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timerRunning) {
            interval = setInterval(() => {
                setTimerSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerRunning]);

    // Click outside handler for menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const menu = menuRef.current;
            // Check menu and menu.getElement exist AND menuElement exists
            if (
                menu &&
                typeof menu.getElement === 'function'
            ) {
                const menuElement = menu.getElement();
                if (menuElement && !menuElement.contains(event.target as Node)) {
                    menu.hide?.(event as any); // menu is guaranteed non-null here
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);






    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Get all labels (predefined + custom)
    const getAllLabels = (): Label[] => {
        return [...predefinedLabels, ...customLabels];
    };

    // Check if color is already used
    const isColorUsed = (color: string): boolean => {
        return getAllLabels().some(label => label.color === color);
    };

    // Generate background and text colors from hex
    const generateColorsFromHex = (hexColor: string) => {
        // Remove # from hex color for Tailwind
        const colorWithoutHash = hexColor.replace('#', '');
        const bgColor = `bg-[#${colorWithoutHash}]/10`;
        const textColor = `text-[#${colorWithoutHash}]`;
        return { bgColor, textColor };
    };

    // Handle custom label creation
    const handleCreateCustomLabel = () => {
        if (!customLabelName.trim()) return;

        if (isColorUsed(customLabelColor)) {
            alert('This color is already used by another label. Please choose a different color.');
            return;
        }

        const { bgColor, textColor } = generateColorsFromHex(customLabelColor);

        const newCustomLabel: Label = {
            id: `custom-${Date.now()}`,
            name: customLabelName.trim(),
            icon: Tag,
            color: customLabelColor,
            bgColor,
            textColor,
            isCustom: true
        };

        setCustomLabels(prev => [...prev, newCustomLabel]);
        setCustomLabelName('');
        setCustomLabelColor('#3B82F6');
        setCustomLabelDialogOpen(false);
    };

    // Handle label selection
    const handleLabelSelect = (label: Label) => {
        setSelectedLabel(label);
        setLabelDialogOpen(false);
    };

    // Handle custom label deletion
    const handleDeleteCustomLabel = (labelId: string) => {
        setCustomLabels(prev => prev.filter(label => label.id !== labelId));
        if (selectedLabel?.id === labelId) {
            setSelectedLabel(predefinedLabels[0]); // Reset to default if deleted label was selected
        }
    };

    // Mock data
    const order = {
        id: 17,
        label: 'High Priority',
        assigned: true,
        assignedUser: { name: 'John Doe', avatar: '/images/avatar/user1.jpg' },
        state: 'Work in Progress',
        paid: true,
        paymentMethod: 'Online',
        customerWillPay: false,
        customer: {
            fullName: 'John Smith',
            email: 'john.smith@example.com',
            phoneCode: '+1',
            phoneNumber: '555-123-4567',
            address: '123 Main Street, New York, NY 10001',
            notes: 'Customer prefers morning appointments'
        },
        serviceLog: [
            { name: 'Brake Adjustment', qty: 1, rate: 500, amount: 500 },
            { name: 'Chain Replacement', qty: 1, rate: 800, amount: 800 },
            { name: 'Tire Replacement', qty: 1, rate: 400, amount: 400 },
        ],
        total: 1700,
        description: 'Reduce noise, Install new chain.',
        log: [
            { text: 'Order created', date: 'Mar 13,2025; 18:00:45' },
            { text: 'Message sent', date: 'Mar 13,2025; 18:00:45' },
            { text: 'Status changed to "Work started"', date: 'Mar 13,2025; 18:00:45' },
            { text: 'Status changed to "Waiting for parts"', date: 'Mar 13,2025; 18:00:45' },
        ],
        attachments: [
            { name: 'invoice.pdf', type: 'pdf', size: '2.3 MB' },
            { name: 'photo.jpg', type: 'image', size: '1.1 MB' },
        ],
        comments: [
            { user: 'John Doe', avatar: '/images/avatar/user1.jpg', date: 'Mar 13,2025', text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.' },
            { user: 'Jane Smith', avatar: '/images/avatar/user1.jpg', date: 'Mar 13,2025', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        ],
        requests: 2,
    };
    const [isPaid, setIsPaid] = useState(order.paid ?? false);
    const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod ?? '');
    const [customerWillPay, setCustomerWillPay] = useState(order.customerWillPay ?? false);

    const teamMembers = [
        { name: 'John Doe', avatar: '/images/avatar/user1.jpg', role: 'Technician' },
        { name: 'Jane Smith', avatar: '/images/avatar/user1.jpg', role: 'Manager' },
        { name: 'Mike Johnson', avatar: '/images/avatar/user1.jpg', role: 'Technician' },
        { name: 'Sarah Wilson', avatar: '/images/avatar/user1.jpg', role: 'Assistant' },
    ];

    // Initialize customer info with order data
    useEffect(() => {
        if (order.customer) {
            setCustomerInfo({
                referenceNumber: `ORD-${order.id.toString().padStart(4, '0')}`,
                fullName: order.customer.fullName,
                email: order.customer.email,
                phoneNumber: order.customer.phoneNumber,
                address: order.customer.address,
                notes: order.customer.notes,
                customerType: 'Regular'
            });
        }
    }, [order]);

    const fileMenuItems = [
        { label: 'Edit', icon: 'pi pi-pencil', command: () => { console.log('Edit'); } },
        { label: 'View', icon: 'pi pi-eye', command: () => { console.log('View'); } },
        { label: 'Download', icon: 'pi pi-download', command: () => { console.log('Download'); } },
        { label: 'Delete', icon: 'pi pi-trash', command: () => { console.log('Delete'); } },
    ];

    const handleTimerToggle = () => {
        setTimerRunning(!timerRunning);
    };

    const handleMarkComplete = () => {
        setSelectedStatus('Completed');
        // Additional logic for marking complete
    };

    const handleOnHold = () => {
        setSelectedStatus('On Hold');
        // Additional logic for on hold
    };

    return (
        <>
            <style>{phoneInputStyles}</style>
            <div className="px-6 py-4 mx-auto">
                <div className='p-4 shadow-lg rounded-[8px] border border-[#AFAFAF] shadow-custom'>
                    {/* Top Status and Action Bar */}
                    <div className="bg-[#E3F8EC] rounded-lg shadow-custom p-4 grid grid-cols-12 gap-4 mb-6">
                        {/* 9-Column Feature Section */}
                        <div className="col-span-12 lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-center gap-4">
                            {/* QR Code Preview */}
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setQrOpen(true)}>
                                <div className="w-14 h-14 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                    <div className="w-10 h-10 bg-black grid grid-cols-3 gap-0.5">
                                        {Array.from({ length: 9 }, (_, i) => (
                                            <div key={i} className={`w-full h-full ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="font-[500] text-md text-primary bg-white inline-block p-1 mb-2">Order # {order.id}</div>
                                    <div className="text-[9px] text-[#5F5C5C]">Created date - 03/13/2025</div>
                                </div>
                            </div>

                            {/* Order Assignee */}
                            <div className="px-4 border-l border-[#d6d6d6] flex flex-col gap-3">
                                <div className="text-sm font-medium whitespace-nowrap text-[#5F5C5C]">Order assigned</div>
                                <div className="flex items-center gap-2">
                                    {order.assigned && (
                                        <img
                                            src={order.assignedUser.avatar}
                                            alt={order.assignedUser.name}
                                            className="w-7 h-7 rounded-full"
                                        />
                                    )}
                                    <Button
                                        icon={<CirclePlus className="text-green-500 w-4 h-4" />}
                                        className="p-1 m-0 rounded-full !bg-transparent !border-none"
                                        onClick={() => setAssignOpen(true)}
                                        style={{ width: 'auto', height: '0' }}
                                    />

                                </div>
                            </div>

                            {/* Labels */}
                            <div className="px-4 border-r border-l border-[#d6d6d6] flex flex-col gap-3">
                                <div className="text-sm font-medium whitespace-nowrap text-[#5F5C5C]">Label</div>
                                <div className="flex items-center gap-1">
                                    {selectedLabel && (
                                        <span className={`text-sm px-2 py-1 rounded-[4px] ${selectedLabel.bgColor} ${selectedLabel.textColor}`}>
                                            {selectedLabel.name}
                                        </span>
                                    )}

                                    {/* Clickable Edit Icon without Button */}
                                    <div
                                        onClick={() => setLabelDialogOpen(true)}
                                        className="cursor-pointer p-1 rounded-full transition-all duration-200 hover:bg-gray-100 hover:scale-110 hover:text-green-600"
                                    >
                                        <PencilIcon className="w-4 h-4 text-green-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Activity Timer */}
                            <div className="flex flex-col gap-3">
                                <div className="text-sm font-medium whitespace-nowrap text-[#5F5C5C]">Activity Timer</div>
                                <div className="flex items-center gap-2">
                                    {/* Start/Stop Button */}
                                    <Button
                                        label={timerRunning ? "Stop" : "Start"}
                                        className={`p-button-sm !px-3 !py-0.5 text-sm ${timerRunning ? 'p-button-warning' : 'p-button-success'}`}
                                        onClick={handleTimerToggle}
                                    />

                                    {/* Timer Display */}
                                    <span className="font-mono text-primary text-sm">{formatTime(timerSeconds)}</span>

                                    {/* Play/Pause Icon */}
                                    <div
                                        onClick={handleTimerToggle}
                                        className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
                                        role="button"
                                        tabIndex={0}
                                    >
                                        {timerRunning ? (
                                            <Pause className="w-4 h-4 text-yellow-500" />
                                        ) : (
                                            <Play className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Card State */}
                            <div className="px-4 border-l border-[#d6d6d6] flex flex-col gap-3">
                                <div className="text-sm font-medium whitespace-nowrap text-[#5F5C5C]">Ticket State</div>
                                <div className="bg-white text-black text-md px-2 py-1 rounded-[4px] w-fit">{selectedStatus}</div>
                            </div>
                        </div>

                        {/* 3-Column Action Buttons */}
                        <div className="col-span-12 lg:col-span-2 flex flex-col items-center justify-end gap-2">
                            <Button
                                label="MARK COMPLETE"
                                className="p-button-success p-button-sm"
                                onClick={handleMarkComplete}
                            />
                            <Button
                                label="On Hold"
                                className="p-button-outlined p-button-sm"
                                onClick={handleOnHold}
                            />
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        <Button
                            label="Customer Info"
                            icon={<User className="w-4 h- me-2" />}
                            className="p-button-outlined p-button-md"
                            onClick={() => setCustomerInfoOpen(true)}
                        />
                        <Button
                            label="Label"
                            icon={<Tag className="w-4 h-4 me-2" />}
                            className="p-button-outlined p-button-md"
                            onClick={() => setLabelDialogOpen(true)}
                        />
                        <Button
                            label="Attachments"
                            icon={<Paperclip className="w-4 h-4 me-2" />}
                            className="p-button-outlined p-button-md"
                            onClick={() => setAttachmentsOpen(true)}
                        />
                        <Button
                            label="Additional Order"
                            icon={<CirclePlus className="w-4 h-4 me-2" />}
                            className="p-button-outlined p-button-md"
                            onClick={() => setAdditionalOrderOpen(true)}
                        />
                        <Button
                            label="Chat"
                            icon={<MessageCircle className="w-4 h-4 me-2" />}
                            className="p-button-outlined p-button-md"
                        />
                    </div>

                    {/* Main Content: Accordions */}
                    <div className="space-y-4">
                        {/* Left Column: Order Accordions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                {/* Custom Accordion for Order Details */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    {/* Order Cost */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(0) ? 'bg-gray-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(0)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 0));
                                                } else {
                                                    setActiveIndex([...activeIndex, 0]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-gray-900">Order cost</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(0) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(0) && (
                                            <div className="px-4 pb-4 space-y-4">
                                                {/* Paid Toggle */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-900">Paid</span>
                                                        <div
                                                            className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${isPaid ? 'bg-green-500' : 'bg-gray-300'}`}
                                                            onClick={() => setIsPaid(!isPaid)}
                                                        >
                                                            <div
                                                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isPaid ? 'translate-x-6' : ''}`}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Method + Checkbox */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    {/* Radio Buttons */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <RadioButton
                                                                inputId="cash"
                                                                name="paymentMethod"
                                                                value="Cash"
                                                                checked={paymentMethod === 'Cash'}
                                                                onChange={(e) => setPaymentMethod(e.value)}
                                                            />
                                                            <label htmlFor="cash" className="text-sm text-gray-700">Cash</label>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <RadioButton
                                                                inputId="online"
                                                                name="paymentMethod"
                                                                value="Online"
                                                                checked={paymentMethod === 'Online'}
                                                                onChange={(e) => setPaymentMethod(e.value)}
                                                            />
                                                            <label htmlFor="online" className="text-sm text-gray-700">Online</label>
                                                        </div>
                                                    </div>

                                                    {/* Checkbox + Info */}
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            inputId="customerWillPay"
                                                            checked={customerWillPay}
                                                            onChange={(e) => setCustomerWillPay(Boolean(e.checked))}
                                                        />
                                                        <label htmlFor="customerWillPay" className="text-sm text-gray-700">Customer will pay in store</label>
                                                        <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs cursor-help">i</div>
                                                    </div>
                                                </div>
                                            </div>

                                        )}
                                    </div>

                                    {/* Order Info */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(1) ? 'bg-gray-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(1)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 1));
                                                } else {
                                                    setActiveIndex([...activeIndex, 1]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-gray-900">Order Info</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(1) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(1) && (
                                            <div className="px-4 pb-4">
                                                <div className="text-sm font-medium text-gray-700 mb-3">Service log</div>
                                                <div className="space-y-2">
                                                    {order.serviceLog.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                                            <span className="text-sm text-gray-700">{item.name}</span>
                                                            <div className="flex items-center gap-6">
                                                                <span className="text-sm text-gray-500">Qty {item.qty}</span>
                                                                <span className="text-sm text-gray-500">Rate {item.rate}</span>
                                                                <span className="text-sm font-medium text-gray-700">Kr {item.amount}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between items-center py-2 pt-3 border-t border-gray-200">
                                                        <span className="text-sm font-semibold text-gray-900">Total</span>
                                                        <span className="text-sm font-semibold text-gray-900">Kr {order.total}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Description */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(2) ? 'bg-gray-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(2)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 2));
                                                } else {
                                                    setActiveIndex([...activeIndex, 2]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-gray-900">Description</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(2) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(2) && (
                                            <div className="px-4 pb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">{order.description}</span>
                                                    <Button
                                                        icon={<Edit className="w-4 h-4" />}
                                                        className="p-button-text p-0 w-8 h-8"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Log */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(3) ? 'bg-gray-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(3)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 3));
                                                } else {
                                                    setActiveIndex([...activeIndex, 3]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-gray-900">Order Log</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(3) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(3) && (
                                            <div className="px-4 pb-4">
                                                <div className="space-y-2">
                                                    {order.log.map((entry, idx) => (
                                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                                            <span className="text-sm text-gray-700">{entry.text}</span>
                                                            <span className="text-xs text-gray-400">{entry.date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Attachments, Comments, Requests Accordions */}
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    {/* Attachments */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(4) ? 'bg-gray-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(4)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 4));
                                                } else {
                                                    setActiveIndex([...activeIndex, 4]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-gray-900">Attachments</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(4) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(4) && (
                                            <div className="px-4 pb-4 space-y-2">
                                                {order.attachments.map((_file, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                                                <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center">
                                                                    <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">File name. extension</div>
                                                            </div>
                                                        </div>
                                                        <Menu model={fileMenuItems} popup ref={menuRef} />
                                                        <Button
                                                            icon={<MoreVertical />}
                                                            className="p-button-text p-0 w-8 h-8"
                                                            onClick={(e) => menuRef.current?.toggle(e)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Comments */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(5) ? 'bg-gray-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(5)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 5));
                                                } else {
                                                    setActiveIndex([...activeIndex, 5]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-gray-900">Comments</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(5) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(5) && (
                                            <div className="px-4 pb-4 space-y-3">
                                                {order.comments.map((_comment, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 border-b border-gray-200 last:border-b-0 pb-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="font-semibold text-sm text-gray-900">John Doe</div>
                                                                <div className="text-xs text-gray-400">Mar 13, 2025</div>
                                                            </div>
                                                            <div className="text-gray-700 text-sm leading-relaxed">
                                                                Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Requests */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(6) ? 'bg-gray-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(6)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 6));
                                                } else {
                                                    setActiveIndex([...activeIndex, 6]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-gray-900 flex items-center gap-2">
                                                Requests
                                                <Badge value={order.requests} severity="danger" />
                                            </span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(6) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(6) && (
                                            <div className="px-4 pb-4 space-y-2">
                                                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                                                    <div className="text-sm font-medium">Change pickup time</div>
                                                    <div className="text-xs text-gray-500">Customer requested earlier pickup</div>
                                                </div>
                                                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                                                    <div className="text-sm font-medium">Add service</div>
                                                    <div className="text-xs text-gray-500">Customer wants to add tire rotation</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Modal */}
                    <Dialog header="Order QR Code" visible={qrOpen} onHide={() => setQrOpen(false)} className="w-96">
                        <div className="text-center space-y-4">
                            <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                                <div className="w-48 h-48 bg-black grid grid-cols-5 gap-0.5">
                                    {Array.from({ length: 25 }, (_, i) => (
                                        <div key={i} className={`w-full h-full ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold">Order #{order.id}</div>
                                <div className="text-sm text-gray-500">Created: 03/13/2025 18:00:45</div>
                            </div>
                        </div>
                    </Dialog>

                    {/* Assign User Modal */}
                    <Dialog header="Members" visible={assignOpen} onHide={() => setAssignOpen(false)} position="right" style={{ width: '400px' }} modal dismissableMask>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <InputText placeholder="Search members" className="w-full pl-10" />
                            </div>

                            <div>
                                <div className="font-medium text-sm mb-2">Board members</div>
                                <div className="space-y-2">
                                    {teamMembers.map((member, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{member.name}</div>
                                                <div className="text-xs text-gray-500">{member.role}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    {/* Customer Info Modal */}
                    <Dialog header="UPDATE ORDER" visible={customerInfoOpen} onHide={() => setCustomerInfoOpen(false)} className="w-[800px]">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Reference Number</label>
                                    <InputText value={customerInfo.referenceNumber} disabled className="w-full bg-gray-100" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <InputText
                                        placeholder="Enter full name"
                                        value={customerInfo.fullName}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <InputText
                                        placeholder="Enter email address"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        value={customerInfo.phoneNumber}
                                        onChange={(value) => setCustomerInfo({ ...customerInfo, phoneNumber: value || '' })}
                                        className="w-full"
                                        international
                                        defaultCountry="US"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <InputText
                                        placeholder="Enter address"
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Notes</label>
                                    <InputText
                                        placeholder="Enter notes"
                                        value={customerInfo.notes}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Customer Type</label>
                                    <Dropdown
                                        value={customerInfo.customerType}
                                        options={[
                                            { label: 'Regular', value: 'Regular' },
                                            { label: 'VIP', value: 'VIP' },
                                            { label: 'Premium', value: 'Premium' }
                                        ]}
                                        optionLabel="label"
                                        optionValue="value"
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, customerType: e.value })}
                                        className="w-full"
                                        placeholder="Select customer type"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-6">
                            <Button label="Cancel" className="p-button-outlined flex-1" onClick={() => setCustomerInfoOpen(false)} />
                            <Button label="Save" className="p-button-success flex-1" />
                        </div>
                    </Dialog>

                    {/* Attachments Modal */}
                    <Dialog header="FILE UPLOAD" visible={attachmentsOpen} onHide={() => setAttachmentsOpen(false)} className="w-96">
                        <div className="space-y-4">
                            <div>
                                <div className="font-medium mb-2">Upload File</div>
                                <div className="text-sm text-gray-600 mb-4">Add your files or document here</div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Paperclip className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        Drop your files here, or <span className="text-green-600 underline cursor-pointer">Click to browse</span>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                        <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">i</span>
                                        Supported files docx, png, webp, pdf | Max size 10 KB
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button label="Cancel" className="p-button-outlined flex-1" onClick={() => setAttachmentsOpen(false)} />
                                <Button label="Upload" className="p-button-success flex-1" />
                            </div>
                        </div>
                    </Dialog>

                    {/* Additional Order Modal */}
                    <Dialog header="ADDITIONAL ORDER" visible={additionalOrderOpen} onHide={() => setAdditionalOrderOpen(false)} className="w-96">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <InputText
                                    placeholder="Enter order title"
                                    value={additionalOrder.title}
                                    onChange={(e) => setAdditionalOrder({ ...additionalOrder, title: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <InputText
                                    placeholder="Enter price"
                                    value={additionalOrder.price}
                                    onChange={(e) => setAdditionalOrder({ ...additionalOrder, price: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <InputText
                                    placeholder="Enter description"
                                    value={additionalOrder.description}
                                    onChange={(e) => setAdditionalOrder({ ...additionalOrder, description: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    inputId="additionalCustomerWillPay"
                                    checked={additionalOrder.customerWillPay || false}
                                    onChange={(e) => setAdditionalOrder({ ...additionalOrder, customerWillPay: e.checked || false })}
                                />
                                <label htmlFor="additionalCustomerWillPay" className="text-sm">Customer will pay in store</label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button label="Cancel" className="p-button-outlined flex-1" onClick={() => setAdditionalOrderOpen(false)} />
                                <Button label="Save" className="p-button-success flex-1" />
                            </div>
                        </div>
                    </Dialog>

                    {/* Label Management Dialog */}
                    <Dialog header="Manage Labels" visible={labelDialogOpen} onHide={() => setLabelDialogOpen(false)} className="w-96">
                        <div className="space-y-4">
                            <div className="font-medium text-sm mb-2">Predefined Labels</div>
                            <div className="grid grid-cols-2 gap-2">
                                {predefinedLabels.map((label) => (
                                    <div
                                        key={label.id}
                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${selectedLabel?.id === label.id ? 'bg-blue-50 border border-blue-200' : ''
                                            }`}
                                        onClick={() => handleLabelSelect(label)}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${label.bgColor}`}>
                                            <label.icon className={`w-3 h-3 ${label.textColor}`} />
                                        </div>
                                        <span className={`text-sm ${label.textColor}`}>{label.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm">Custom Labels</span>
                                    <Button icon={<Plus className="w-4 h-4" />} className="p-button-text p-button-sm" onClick={() => setCustomLabelDialogOpen(true)} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {customLabels.map((label) => (
                                        <div key={label.id} className="flex items-center gap-2">
                                            <span
                                                className="text-sm px-3 py-1 rounded-full text-white"
                                                style={{ backgroundColor: label.color }}
                                            >
                                                {label.name}
                                            </span>
                                            <Button
                                                icon={<Trash2 className="w-4 h-4 text-red-500" />}
                                                className="p-button-text p-0 w-8 h-8"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCustomLabel(label.id);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    {/* Custom Label Creation Dialog */}
                    <Dialog header="Create Custom Label" visible={customLabelDialogOpen} onHide={() => setCustomLabelDialogOpen(false)} className="w-96">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-gray-700">Label Name</label>
                                <input
                                    type="text"
                                    value={customLabelName}
                                    onChange={(e) => setCustomLabelName(e.target.value)}
                                    className="border rounded px-3 py-2 text-sm"
                                    placeholder="Enter label name"
                                />

                                <label className="text-sm font-medium text-gray-700 mt-2">Pick a Color</label>
                                <ChromePicker
                                    color={customLabelColor}
                                    onChange={(color) => setCustomLabelColor(color.hex)}
                                    disableAlpha
                                />

                            </div>


                            <div className="flex gap-2">
                                <Button
                                    label="Cancel"
                                    className="p-button-outlined flex-1"
                                    onClick={() => setCustomLabelDialogOpen(false)}
                                />
                                <Button
                                    label="Create Label"
                                    className="p-button-success flex-1"
                                    onClick={handleCreateCustomLabel}
                                    disabled={!customLabelName.trim()}
                                />
                            </div>
                        </div>
                    </Dialog>

                    {/* File Menu */}
                    <Menu model={fileMenuItems} popup ref={menuRef} />
                </div>
            </div>
        </>
    );
} 