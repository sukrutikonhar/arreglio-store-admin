import { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';

export default function OrderDetails() {
    const [qrOpen, setQrOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number[]>([0]);

    // Mock data
    const order = {
        id: 17,
        label: 'High Priority',
        assigned: true,
        assignedUser: { name: 'John Doe', avatar: '/images/avatar/user1.jpg' },
        timer: '00:00:00',
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
            { name: 'File name. extension' },
            { name: 'File name. extension' },
        ],
        comments: [
            { user: 'John Doe', avatar: '/images/avatar/user1.jpg', date: 'Mar 13,2025', text: 'Neque porro quisquam est qui dolorem...' },
            { user: 'John Doe', avatar: '/images/avatar/user1.jpg', date: 'Mar 13,2025', text: 'Neque porro quisquam est qui dolorem...' },
            { user: 'John Doe', avatar: '/images/avatar/user1.jpg', date: 'Mar 13,2025', text: 'Neque porro quisquam est qui dolorem...' },
        ],
        requests: 2,
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {/* Top bar */}
            <div className="bg-green-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* QR code */}
                    <div className="cursor-pointer" onClick={() => setQrOpen(true)}>
                        <img src="/images/logos/logo.svg" alt="QR" className="w-16 h-16 border rounded" />
                        <div className="text-xs text-gray-500 text-center">Order # {order.id}</div>
                    </div>
                    {/* Assigned user */}
                    <div className="flex items-center gap-2">
                        <span>Order assigned</span>
                        {order.assigned ? (
                            <img src={order.assignedUser.avatar} alt={order.assignedUser.name} className="w-8 h-8 rounded-full border" />
                        ) : null}
                        <Button icon="pi pi-plus" className="p-button-text p-0" onClick={() => setAssignOpen(true)} />
                    </div>
                    {/* Label */}
                    <div className="flex items-center gap-2">
                        <span>Label</span>
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">{order.label}</span>
                        <Button icon="pi pi-pencil" className="p-button-text p-0" />
                    </div>
                    {/* Timer */}
                    <div className="flex items-center gap-2">
                        <span>Activity Timer</span>
                        <Button label="Start Timer" className="p-button-success p-button-sm" />
                        <span>{order.timer}</span>
                    </div>
                    {/* State */}
                    <div className="flex items-center gap-2">
                        <span>Ticket Card State</span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{order.state}</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <Button label="MARK COMPLETE" className="p-button-success" />
                    <Button label="On Hold" className="p-button-outlined" />
                </div>
            </div>

            {/* QR code popup */}
            <Dialog header="Order QR Code" visible={qrOpen} onHide={() => setQrOpen(false)}>
                <img src="/images/logos/logo.svg" alt="QR Large" className="w-64 h-64 mx-auto" />
            </Dialog>

            {/* Assign user side panel */}
            <Dialog header="Assign Order" visible={assignOpen} onHide={() => setAssignOpen(false)} position="right" style={{ width: '400px' }} modal dismissableMask>
                <input type="text" placeholder="Search people..." className="p-inputtext w-full mb-4" />
                {/* List of people (mock) */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                        <img src="/images/avatar/user1.jpg" alt="User" className="w-8 h-8 rounded-full" />
                        <span>John Doe</span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                        <img src="/images/avatar/user1.jpg" alt="User" className="w-8 h-8 rounded-full" />
                        <span>Jane Smith</span>
                    </div>
                </div>
            </Dialog>

            {/* Main content: Accordions and right panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Accordions */}
                <div className="md:col-span-2">
                    <Accordion activeIndex={activeIndex} onTabChange={e => setActiveIndex(Array.isArray(e.index) ? e.index : [e.index])} multiple>
                        <AccordionTab header="Order cost">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="font-semibold">Paid</span>
                                <Button icon={order.paid ? 'pi pi-check' : 'pi pi-times'} className={order.paid ? 'p-button-success' : 'p-button-secondary'} />
                                <span className="ml-4">{order.paid ? 'Paid' : 'Unpaid'}</span>
                                <span className="ml-8">{order.paymentMethod === 'Cash' ? 'Cash' : 'Online'}</span>
                                <span className="ml-8">{order.customerWillPay ? 'Customer will pay in store' : ''}</span>
                            </div>
                        </AccordionTab>
                        <AccordionTab header="Order Info">
                            <table className="w-full text-sm mb-2">
                                <thead>
                                    <tr className="text-gray-500">
                                        <th className="text-left">Service log</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.serviceLog.map((item, idx) => (
                                        <tr key={idx} className="border-b last:border-b-0">
                                            <td className="py-1 text-gray-700">{item.name}</td>
                                            <td className="text-center">{item.qty}</td>
                                            <td className="text-center">Kr {item.rate}</td>
                                            <td className="text-center">Kr {item.amount}</td>
                                        </tr>
                                    ))}
                                    <tr className="font-bold">
                                        <td colSpan={3} className="text-right">Total</td>
                                        <td className="text-center">Kr {order.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </AccordionTab>
                        <AccordionTab header="Order Description">
                            <div className="text-gray-700">{order.description}</div>
                        </AccordionTab>
                        <AccordionTab header="Order Log">
                            <ul className="text-sm">
                                {order.log.map((entry, idx) => (
                                    <li key={idx} className="flex justify-between border-b last:border-b-0 py-1">
                                        <span>{entry.text}</span>
                                        <span className="text-gray-400 text-xs">{entry.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionTab>
                    </Accordion>
                </div>
                {/* Right: Attachments, Comments, Requests */}
                <div className="space-y-4">
                    <Card title="Attachments">
                        {order.attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b last:border-b-0 py-2">
                                <div className="flex items-center gap-2">
                                    <img src="/images/logos/logo.svg" alt="File" className="w-8 h-8 rounded" />
                                    <span>{file.name}</span>
                                </div>
                                <Button icon="pi pi-ellipsis-v" className="p-button-text" />
                            </div>
                        ))}
                    </Card>
                    <Card title="Comments">
                        {order.comments.map((comment, idx) => (
                            <div key={idx} className="flex items-start gap-2 border-b last:border-b-0 py-2">
                                <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full" />
                                <div>
                                    <div className="font-semibold text-sm">{comment.user}</div>
                                    <div className="text-xs text-gray-400 mb-1">{comment.date}</div>
                                    <div className="text-gray-700 text-sm">{comment.text}</div>
                                </div>
                            </div>
                        ))}
                    </Card>
                    <Card title={<span>Requests <Badge value={order.requests} severity="danger" /></span>}>
                        <div className="text-gray-700">Requests content here...</div>
                    </Card>
                </div>
            </div>
        </div>
    );
} 