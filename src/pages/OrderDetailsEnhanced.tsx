import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import {
    Package,
    Truck,
    CheckCircle
} from 'lucide-react';

interface OrderItem {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface TrackingEvent {
    id: number;
    timestamp: Date;
    status: string;
    location: string;
    description: string;
    icon: string;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    orderDate: Date;
    estimatedDelivery: Date;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: string;
    shippingMethod: string;
    trackingNumber: string;
    carrier: string;
    notes: string;
    trackingEvents: TrackingEvent[];
}

const mockOrder: Order = {
    id: 'ORD-2024-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 (555) 123-4567',
    customerAddress: '123 Main St, New York, NY 10001',
    orderDate: new Date('2024-01-15'),
    estimatedDelivery: new Date('2024-01-25'),
    items: [
        {
            id: 1,
            name: 'iPhone 15 Pro',
            sku: 'IPHONE-15-PRO-256',
            quantity: 1,
            unitPrice: 999.00,
            total: 999.00,
            status: 'in_stock'
        },
        {
            id: 2,
            name: 'Apple Watch Series 9',
            sku: 'AW-SERIES-9-45',
            quantity: 1,
            unitPrice: 399.00,
            total: 399.00,
            status: 'in_stock'
        },
        {
            id: 3,
            name: 'AirPods Pro',
            sku: 'AIRPODS-PRO-2',
            quantity: 1,
            unitPrice: 249.00,
            total: 249.00,
            status: 'in_stock'
        }
    ],
    subtotal: 1647.00,
    shipping: 15.00,
    tax: 131.76,
    total: 1793.76,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Express Delivery',
    trackingNumber: '1Z999AA1234567890',
    carrier: 'FedEx',
    notes: 'Customer requested signature confirmation. Handle with care - fragile items.',
    trackingEvents: [
        {
            id: 1,
            timestamp: new Date('2024-01-20 14:30:00'),
            status: 'Delivered',
            location: 'New York, NY',
            description: 'Package delivered to recipient',
            icon: 'CheckCircle'
        },
        {
            id: 2,
            timestamp: new Date('2024-01-20 08:15:00'),
            status: 'Out for Delivery',
            location: 'New York, NY',
            description: 'Package out for delivery with local courier',
            icon: 'Truck'
        },
        {
            id: 3,
            timestamp: new Date('2024-01-19 20:45:00'),
            status: 'In Transit',
            location: 'Memphis, TN',
            description: 'Package departed from FedEx facility',
            icon: 'Package'
        },
        {
            id: 4,
            timestamp: new Date('2024-01-19 16:20:00'),
            status: 'In Transit',
            location: 'Memphis, TN',
            description: 'Package arrived at FedEx facility',
            icon: 'Package'
        },
        {
            id: 5,
            timestamp: new Date('2024-01-18 14:10:00'),
            status: 'Shipped',
            location: 'Los Angeles, CA',
            description: 'Package picked up by FedEx',
            icon: 'Truck'
        }
    ]
};

const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
];

const paymentStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
    { label: 'Failed', value: 'failed' },
    { label: 'Refunded', value: 'refunded' }
];

const shippingMethods = [
    { label: 'Standard Shipping', value: 'standard' },
    { label: 'Express Delivery', value: 'express' },
    { label: 'Overnight Shipping', value: 'overnight' },
    { label: 'Same Day Delivery', value: 'same_day' }
];

const carriers = [
    { label: 'FedEx', value: 'fedex' },
    { label: 'UPS', value: 'ups' },
    { label: 'USPS', value: 'usps' },
    { label: 'DHL', value: 'dhl' }
];

const OrderDetailsEnhanced: React.FC = () => {
    const [order, setOrder] = useState<Order>(mockOrder);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showTrackingDialog, setShowTrackingDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [toast, setToast] = useState<any>(null);
    const [newTrackingEvent, setNewTrackingEvent] = useState<Partial<TrackingEvent>>({
        status: '',
        location: '',
        description: ''
    });

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'shipped': return 'info';
            case 'processing': return 'warning';
            case 'confirmed': return 'info';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'info';
        }
    };

    const getPaymentStatusSeverity = (status: string) => {
        switch (status) {
            case 'paid': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'danger';
            case 'refunded': return 'info';
            default: return 'info';
        }
    };

    const getItemStatusSeverity = (status: string) => {
        switch (status) {
            case 'in_stock': return 'success';
            case 'low_stock': return 'warning';
            case 'out_of_stock': return 'danger';
            default: return 'info';
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setOrder({ ...order, status: newStatus as any });
        setToast({
            severity: 'success',
            summary: 'Status Updated',
            detail: `Order status has been updated to ${newStatus}.`,
            life: 3000
        });
    };

    const handlePaymentStatusChange = (newStatus: string) => {
        setOrder({ ...order, paymentStatus: newStatus as any });
        setToast({
            severity: 'success',
            summary: 'Payment Status Updated',
            detail: `Payment status has been updated to ${newStatus}.`,
            life: 3000
        });
    };

    const handleAddTrackingEvent = () => {
        if (newTrackingEvent.status && newTrackingEvent.location && newTrackingEvent.description) {
            const event: TrackingEvent = {
                id: Date.now(),
                timestamp: new Date(),
                status: newTrackingEvent.status!,
                location: newTrackingEvent.location!,
                description: newTrackingEvent.description!,
                icon: 'Package'
            };

            setOrder({
                ...order,
                trackingEvents: [event, ...order.trackingEvents]
            });

            setNewTrackingEvent({
                status: '',
                location: '',
                description: ''
            });
            setShowTrackingDialog(false);

            setToast({
                severity: 'success',
                summary: 'Tracking Event Added',
                detail: 'New tracking event has been added successfully.',
                life: 3000
            });
        }
    };

    const handleDeleteOrder = () => {
        setOrder({ ...order, status: 'cancelled' });
        setShowDeleteDialog(false);
        setToast({
            severity: 'success',
            summary: 'Order Cancelled',
            detail: 'Order has been cancelled successfully.',
            life: 3000
        });
    };

    const itemTotalBodyTemplate = (rowData: OrderItem) => {
        return `$${rowData.total.toFixed(2)}`;
    };

    const itemStatusBodyTemplate = (rowData: OrderItem) => {
        return <Badge value={rowData.status.replace('_', ' ')} severity={getItemStatusSeverity(rowData.status)} />;
    };

    const trackingEventBodyTemplate = (rowData: TrackingEvent) => {
        return (
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {rowData.icon === 'CheckCircle' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {rowData.icon === 'Truck' && <Truck className="w-5 h-5 text-blue-500" />}
                    {rowData.icon === 'Package' && <Package className="w-5 h-5 text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{rowData.status}</h4>
                        <span className="text-sm text-gray-500">{rowData.timestamp.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{rowData.location}</p>
                    <p className="text-sm text-gray-500">{rowData.description}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
                        <p className="text-gray-600">View and manage order information</p>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                        <Button
                            label="Edit"
                            icon="pi pi-pencil"
                            onClick={() => setShowEditDialog(true)}
                            className="p-button-outlined"
                        />
                        <Button
                            label="Print"
                            icon="pi pi-print"
                            className="p-button-outlined"
                        />
                        <Button
                            label="Download"
                            icon="pi pi-download"
                            className="p-button-outlined"
                        />
                        <Button
                            label="Send"
                            icon="pi pi-send"
                            className="p-button-outlined"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Order Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{order.id}</h2>
                                <p className="text-gray-600">Order Date: {order.orderDate.toLocaleDateString()}</p>
                                <p className="text-gray-600">Estimated Delivery: {order.estimatedDelivery.toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex gap-2">
                                <Badge value={order.status} severity={getStatusSeverity(order.status)} />
                                <Badge value={order.paymentStatus} severity={getPaymentStatusSeverity(order.paymentStatus)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Customer Information:</h3>
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-gray-600">{order.customerEmail}</p>
                                <p className="text-gray-600">{order.customerPhone}</p>
                                <p className="text-gray-600">{order.customerAddress}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Order Summary:</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="font-medium">${order.shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax:</span>
                                        <span className="font-medium">${order.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                        <span>Total:</span>
                                        <span>${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h3>
                        <DataTable value={order.items} className="p-0">
                            <Column field="name" header="Product" />
                            <Column field="sku" header="SKU" />
                            <Column field="quantity" header="Qty" />
                            <Column
                                field="unitPrice"
                                header="Unit Price"
                                body={(rowData) => `$${rowData.unitPrice.toFixed(2)}`}
                            />
                            <Column field="total" header="Total" body={itemTotalBodyTemplate} />
                            <Column field="status" header="Status" body={itemStatusBodyTemplate} />
                        </DataTable>
                    </div>

                    {/* Tracking Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Tracking Information</h3>
                            <Button
                                label="Add Tracking Event"
                                icon="pi pi-plus"
                                onClick={() => setShowTrackingDialog(true)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <span className="text-sm text-gray-500">Tracking Number:</span>
                                <p className="font-medium">{order.trackingNumber}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Carrier:</span>
                                <p className="font-medium">{order.carrier}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Shipping Method:</span>
                                <p className="font-medium">{order.shippingMethod}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Payment Method:</span>
                                <p className="font-medium">{order.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {order.trackingEvents.map((event) => (
                                <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                                    {trackingEventBodyTemplate(event)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Notes</h3>
                            <p className="text-gray-700">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Management */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                                <Dropdown
                                    value={order.status}
                                    options={statusOptions}
                                    onChange={(e) => handleStatusChange(e.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                                <Dropdown
                                    value={order.paymentStatus}
                                    options={paymentStatusOptions}
                                    onChange={(e) => handlePaymentStatusChange(e.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button
                                label="Mark as Delivered"
                                icon="pi pi-check"
                                onClick={() => handleStatusChange('delivered')}
                                disabled={order.status === 'delivered'}
                                className="w-full"
                            />
                            <Button
                                label="Send Tracking Update"
                                icon="pi pi-send"
                                className="p-button-outlined w-full"
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button
                                label="View on Map"
                                icon="pi pi-map"
                                className="p-button-text w-full justify-start"
                            />
                            <Button
                                label="Contact Customer"
                                icon="pi pi-phone"
                                className="p-button-text w-full justify-start"
                            />
                            <Button
                                label="Download Label"
                                icon="pi pi-download"
                                className="p-button-text w-full justify-start"
                            />
                            <Button
                                label="Print Packing Slip"
                                icon="pi pi-print"
                                className="p-button-text w-full justify-start"
                            />
                        </div>
                    </div>

                    {/* Delivery Progress */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Progress</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">
                                    {order.status === 'delivered' ? '100%' :
                                        order.status === 'shipped' ? '75%' :
                                            order.status === 'processing' ? '50%' :
                                                order.status === 'confirmed' ? '25%' : '0%'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                        width: `${order.status === 'delivered' ? 100 :
                                            order.status === 'shipped' ? 75 :
                                                order.status === 'processing' ? 50 :
                                                    order.status === 'confirmed' ? 25 : 0}%`
                                    }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {order.status === 'delivered' ? 'Delivered successfully' :
                                    order.status === 'shipped' ? 'Package in transit' :
                                        order.status === 'processing' ? 'Processing order' :
                                            order.status === 'confirmed' ? 'Order confirmed' : 'Order pending'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Order Dialog */}
            <Dialog
                header="Edit Order"
                visible={showEditDialog}
                onHide={() => setShowEditDialog(false)}
                style={{ width: '600px' }}
                modal
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Order Date</label>
                            <Calendar
                                value={order.orderDate}
                                onChange={(e) => setOrder({ ...order, orderDate: e.value as Date })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery</label>
                            <Calendar
                                value={order.estimatedDelivery}
                                onChange={(e) => setOrder({ ...order, estimatedDelivery: e.value as Date })}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                            <Dropdown
                                value={order.shippingMethod}
                                options={shippingMethods}
                                onChange={(e) => setOrder({ ...order, shippingMethod: e.value })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
                            <Dropdown
                                value={order.carrier}
                                options={carriers}
                                onChange={(e) => setOrder({ ...order, carrier: e.value })}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                        <InputText
                            value={order.trackingNumber}
                            onChange={(e) => setOrder({ ...order, trackingNumber: e.target.value })}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                            value={order.notes}
                            onChange={(e) => setOrder({ ...order, notes: e.target.value })}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowEditDialog(false)}
                        />
                        <Button
                            label="Save Changes"
                            onClick={() => {
                                setShowEditDialog(false);
                                setToast({
                                    severity: 'success',
                                    summary: 'Order Updated',
                                    detail: 'Order has been updated successfully.',
                                    life: 3000
                                });
                            }}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Add Tracking Event Dialog */}
            <Dialog
                header="Add Tracking Event"
                visible={showTrackingDialog}
                onHide={() => setShowTrackingDialog(false)}
                style={{ width: '500px' }}
                modal
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                        <InputText
                            value={newTrackingEvent.status}
                            onChange={(e) => setNewTrackingEvent({ ...newTrackingEvent, status: e.target.value })}
                            placeholder="e.g., In Transit, Delivered"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                        <InputText
                            value={newTrackingEvent.location}
                            onChange={(e) => setNewTrackingEvent({ ...newTrackingEvent, location: e.target.value })}
                            placeholder="e.g., New York, NY"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                            value={newTrackingEvent.description}
                            onChange={(e) => setNewTrackingEvent({ ...newTrackingEvent, description: e.target.value })}
                            placeholder="Detailed description of the tracking event"
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowTrackingDialog(false)}
                        />
                        <Button
                            label="Add Event"
                            onClick={handleAddTrackingEvent}
                            disabled={!newTrackingEvent.status || !newTrackingEvent.location || !newTrackingEvent.description}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                header="Delete Order"
                visible={showDeleteDialog}
                onHide={() => setShowDeleteDialog(false)}
                style={{ width: '400px' }}
                modal
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to delete this order? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowDeleteDialog(false)}
                        />
                        <Button
                            label="Delete"
                            className="p-button-danger"
                            onClick={handleDeleteOrder}
                        />
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
};

export default OrderDetailsEnhanced; 