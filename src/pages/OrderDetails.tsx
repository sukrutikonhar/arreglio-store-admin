import { useState, useEffect } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';

import { Menu } from 'primereact/menu';
import { useRef } from 'react';
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
    Plus,
    Search,
    Edit,
    Eye,
    User,
    Tag,
    Paperclip,
    MessageSquare,
    Play,
    Pause
} from 'lucide-react';

export default function OrderDetails() {
    const [qrOpen, setQrOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [customerInfoOpen, setCustomerInfoOpen] = useState(false);
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [additionalOrderOpen, setAdditionalOrderOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number[]>([0]);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [selectedLabel] = useState('High Priority');
    const [selectedStatus, setSelectedStatus] = useState('Work in Progress');
    const [customerInfo, setCustomerInfo] = useState({
        referenceNumber: 'ORD-2025-001',
        fullName: '',
        email: '',
        phoneCode: '+1',
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

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

    const labels = [
        { name: 'High Priority', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
        { name: 'On Hold', icon: PauseCircle, color: 'bg-yellow-100 text-yellow-600' },
        { name: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
        { name: 'In Progress', icon: Loader2, color: 'bg-blue-100 text-blue-600' },
        { name: 'Waiting for Reply', icon: MessageCircle, color: 'bg-purple-100 text-purple-600' },
        { name: 'Waiting for Parts', icon: Package, color: 'bg-orange-100 text-orange-600' },
        { name: 'Received', icon: Inbox, color: 'bg-gray-100 text-gray-600' },
        { name: 'Ready for Pickup', icon: Truck, color: 'bg-indigo-100 text-indigo-600' },
        { name: 'Cancelled', icon: XCircle, color: 'bg-gray-100 text-gray-600' },
    ];

    const teamMembers = [
        { name: 'John Doe', avatar: '/images/avatar/user1.jpg', role: 'Technician' },
        { name: 'Jane Smith', avatar: '/images/avatar/user1.jpg', role: 'Manager' },
        { name: 'Mike Johnson', avatar: '/images/avatar/user1.jpg', role: 'Technician' },
        { name: 'Sarah Wilson', avatar: '/images/avatar/user1.jpg', role: 'Assistant' },
    ];



    const phoneCodes = [
        { label: 'USA (+1)', value: '+1' },
        { label: 'UK (+44)', value: '+44' },
        { label: 'Germany (+49)', value: '+49' },
        { label: 'France (+33)', value: '+33' },
        { label: 'India (+91)', value: '+91' },
    ];

    const fileMenuItems = [
        { label: 'Edit', icon: 'pi pi-pencil', command: () => console.log('Edit') },
        { label: 'View', icon: 'pi pi-eye', command: () => console.log('View') },
        { label: 'Download', icon: 'pi pi-download', command: () => console.log('Download') },
        { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('Delete') },
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
        <div className="p-4 max-w-7xl mx-auto">
            {/* Top Status and Action Bar */}
            <div className="bg-green-50 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* QR Code Preview */}
                    <div className="cursor-pointer" onClick={() => setQrOpen(true)}>
                        <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                            <div className="w-12 h-12 bg-black grid grid-cols-3 gap-0.5">
                                {Array.from({ length: 9 }, (_, i) => (
                                    <div key={i} className={`w-full h-full ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}></div>
                                ))}
                            </div>
                        </div>
                        <div className="text-center mt-1">
                            <div className="font-semibold text-sm">Order # {order.id}</div>
                            <div className="text-xs text-gray-500">Created date - 03/13/2025</div>
                        </div>
                    </div>

                    {/* Order Assignee */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Order assigned</span>
                        {order.assigned ? (
                            <img src={order.assignedUser.avatar} alt={order.assignedUser.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                        ) : null}
                        <Button
                            icon={<Plus className="w-4 h-4" />}
                            className="p-button-text p-0 w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600"
                            onClick={() => setAssignOpen(true)}
                        />
                    </div>

                    {/* Labels */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Label</span>
                        <div className="flex items-center gap-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${labels.find(l => l.name === selectedLabel)?.color || 'bg-red-100 text-red-600'}`}>
                                {selectedLabel}
                            </span>
                            <Button
                                icon={<Edit className="w-3 h-3" />}
                                className="p-button-text p-0 w-6 h-6"
                            />
                        </div>
                    </div>

                    {/* Activity Timer */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Activity Timer</span>
                        <Button
                            label={timerRunning ? "Pause Timer" : "Start Timer"}
                            icon={timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            className={`p-button-sm ${timerRunning ? 'p-button-warning' : 'p-button-success'}`}
                            onClick={handleTimerToggle}
                        />
                        <span className="font-mono text-sm">{formatTime(timerSeconds)}</span>
                    </div>

                    {/* Ticket Card State */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Ticket Card State</span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{selectedStatus}</span>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
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
                    icon={<User className="w-4 h-4" />}
                    className="p-button-outlined p-button-sm"
                    onClick={() => setCustomerInfoOpen(true)}
                />
                <Button
                    label="Label"
                    icon={<Tag className="w-4 h-4" />}
                    className="p-button-outlined p-button-sm"
                />
                <Button
                    label="Attachments"
                    icon={<Paperclip className="w-4 h-4" />}
                    className="p-button-outlined p-button-sm"
                    onClick={() => setAttachmentsOpen(true)}
                />
                <Button
                    label="Additional Order"
                    icon={<Plus className="w-4 h-4" />}
                    className="p-button-outlined p-button-sm"
                    onClick={() => setAdditionalOrderOpen(true)}
                />
                <Button
                    label="Chat"
                    icon={<MessageSquare className="w-4 h-4" />}
                    className="p-button-outlined p-button-sm"
                />
            </div>

            {/* Main Content: Accordions and Right Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Accordions */}
                <div className="lg:col-span-2">
                    <Accordion activeIndex={activeIndex} onTabChange={e => setActiveIndex(Array.isArray(e.index) ? e.index : [e.index])} multiple>
                        <AccordionTab header="Order cost">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold">Payment Status</span>
                                    <div className="flex items-center gap-2">
                                        <RadioButton inputId="paid" name="paid" value="paid" checked={order.paid || false} />
                                        <label htmlFor="paid" className="text-sm">Paid</label>
                                        <RadioButton inputId="unpaid" name="paid" value="unpaid" checked={!order.paid || false} />
                                        <label htmlFor="unpaid" className="text-sm">Unpaid</label>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="font-semibold">Payment Method</span>
                                    <div className="flex items-center gap-2">
                                        <RadioButton inputId="cash" name="paymentMethod" value="cash" checked={(order.paymentMethod === 'Cash') || false} />
                                        <label htmlFor="cash" className="text-sm">Cash</label>
                                        <RadioButton inputId="online" name="paymentMethod" value="online" checked={(order.paymentMethod === 'Online') || false} />
                                        <label htmlFor="online" className="text-sm">Online</label>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox inputId="customerWillPay" checked={order.customerWillPay || false} />
                                    <label htmlFor="customerWillPay" className="text-sm">Customer will pay in store</label>
                                </div>
                            </div>
                        </AccordionTab>

                        <AccordionTab header="Order Info">
                            <div className="space-y-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b">
                                            <th className="text-left py-2">Service</th>
                                            <th className="text-center py-2">Qty</th>
                                            <th className="text-center py-2">Rate</th>
                                            <th className="text-center py-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.serviceLog.map((item, idx) => (
                                            <tr key={idx} className="border-b last:border-b-0">
                                                <td className="py-2 text-gray-700">{item.name}</td>
                                                <td className="text-center py-2">{item.qty}</td>
                                                <td className="text-center py-2">Kr {item.rate}</td>
                                                <td className="text-center py-2">Kr {item.amount}</td>
                                            </tr>
                                        ))}
                                        <tr className="font-bold">
                                            <td colSpan={3} className="text-right py-2">Total</td>
                                            <td className="text-center py-2">Kr {order.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </AccordionTab>

                        <AccordionTab header="Order Description">
                            <div className="space-y-4">
                                <div className="text-gray-700">{order.description}</div>
                                <Button label="Edit" icon={<Edit className="w-4 h-4" />} className="p-button-text p-button-sm" />
                            </div>
                        </AccordionTab>

                        <AccordionTab header="Order Log">
                            <div className="space-y-3">
                                {order.log.map((entry, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b last:border-b-0 py-2">
                                        <span className="text-sm">{entry.text}</span>
                                        <span className="text-gray-400 text-xs">{entry.date}</span>
                                    </div>
                                ))}
                            </div>
                        </AccordionTab>
                    </Accordion>
                </div>

                {/* Right Column: Attachments, Comments, Requests */}
                <div className="space-y-4">
                    <Card title="Attachments" className="h-fit">
                        <div className="space-y-2">
                            {order.attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                            <Paperclip className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{file.name}</div>
                                            <div className="text-xs text-gray-500">{file.size}</div>
                                        </div>
                                    </div>
                                    <Button
                                        icon={<Eye className="w-4 h-4" />}
                                        className="p-button-text p-0 w-8 h-8"
                                        onClick={(e) => menuRef.current?.toggle(e)}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Comments" className="h-fit">
                        <div className="space-y-3">
                            {order.comments.map((comment, idx) => (
                                <div key={idx} className="flex items-start gap-3 border-b last:border-b-0 pb-3">
                                    <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm">{comment.user}</div>
                                        <div className="text-xs text-gray-400 mb-1">{comment.date}</div>
                                        <div className="text-gray-700 text-sm">{comment.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title={<span className="flex items-center gap-2">Requests <Badge value={order.requests} severity="danger" /></span>} className="h-fit">
                        <div className="space-y-2">
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <div className="text-sm font-medium">Change pickup time</div>
                                <div className="text-xs text-gray-500">Customer requested earlier pickup</div>
                            </div>
                            <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                                <div className="text-sm font-medium">Add service</div>
                                <div className="text-xs text-gray-500">Customer wants to add tire rotation</div>
                            </div>
                        </div>
                    </Card>
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
            <Dialog header="UPDATE ORDER" visible={customerInfoOpen} onHide={() => setCustomerInfoOpen(false)} className="w-96">
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
                        <div className="flex gap-2">
                            <Dropdown
                                value={customerInfo.phoneCode}
                                options={phoneCodes}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setCustomerInfo({ ...customerInfo, phoneCode: e.value })}
                                className="w-24"
                                placeholder="Code"
                            />
                            <InputText
                                placeholder="Enter phone number"
                                value={customerInfo.phoneNumber}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value })}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button label="Cancel" className="p-button-outlined flex-1" onClick={() => setCustomerInfoOpen(false)} />
                        <Button label="Save" className="p-button-success flex-1" />
                    </div>
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

            {/* File Menu */}
            <Menu model={fileMenuItems} popup ref={menuRef} />
        </div>
    );
} 