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

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Payment {
    id: number;
    date: Date;
    amount: number;
    method: string;
    reference: string;
    status: 'completed' | 'pending' | 'failed';
}

interface Invoice {
    id: string;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    customerPhone: string;
    invoiceDate: Date;
    dueDate: Date;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    paidAmount: number;
    balance: number;
    notes: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    payments: Payment[];
}

const mockInvoice: Invoice = {
    id: 'INV-2024-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerAddress: '123 Main St, New York, NY 10001',
    customerPhone: '+1 (555) 123-4567',
    invoiceDate: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    items: [
        {
            id: 1,
            description: 'Website Design Services',
            quantity: 1,
            unitPrice: 1500.00,
            total: 1500.00
        },
        {
            id: 2,
            description: 'SEO Optimization',
            quantity: 1,
            unitPrice: 500.00,
            total: 500.00
        },
        {
            id: 3,
            description: 'Content Creation',
            quantity: 10,
            unitPrice: 50.00,
            total: 500.00
        }
    ],
    subtotal: 2500.00,
    taxRate: 10,
    taxAmount: 250.00,
    total: 2750.00,
    paidAmount: 1375.00,
    balance: 1375.00,
    notes: 'Payment terms: 50% upfront, 50% upon completion. Rush delivery available for additional fee.',
    status: 'sent',
    payments: [
        {
            id: 1,
            date: new Date('2024-01-20'),
            amount: 1375.00,
            method: 'Credit Card',
            reference: 'CC-2024-001',
            status: 'completed'
        }
    ]
};

const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Sent', value: 'sent' },
    { label: 'Paid', value: 'paid' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Cancelled', value: 'cancelled' }
];

const paymentMethods = [
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Cash', value: 'cash' },
    { label: 'Check', value: 'check' }
];

const InvoiceDetails: React.FC = () => {
    const [invoice, setInvoice] = useState<Invoice>(mockInvoice);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [toast, setToast] = useState<any>(null);
    const [newPayment, setNewPayment] = useState<Partial<Payment>>({
        amount: 0,
        method: 'credit_card',
        reference: ''
    });

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'paid': return 'success';
            case 'sent': return 'info';
            case 'overdue': return 'danger';
            case 'draft': return 'warning';
            case 'cancelled': return 'secondary';
            default: return 'info';
        }
    };

    const getPaymentStatusSeverity = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'danger';
            default: return 'info';
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setInvoice({ ...invoice, status: newStatus as any });
        setToast({
            severity: 'success',
            summary: 'Status Updated',
            detail: `Invoice status has been updated to ${newStatus}.`,
            life: 3000
        });
    };

    const handleAddPayment = () => {
        if (newPayment.amount && newPayment.method && newPayment.reference) {
            const payment: Payment = {
                id: Date.now(),
                date: new Date(),
                amount: newPayment.amount!,
                method: newPayment.method!,
                reference: newPayment.reference!,
                status: 'completed'
            };

            const updatedPayments = [...invoice.payments, payment];
            const newPaidAmount = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
            const newBalance = invoice.total - newPaidAmount;

            setInvoice({
                ...invoice,
                payments: updatedPayments,
                paidAmount: newPaidAmount,
                balance: newBalance,
                status: newBalance <= 0 ? 'paid' : 'sent'
            });

            setNewPayment({
                amount: 0,
                method: 'credit_card',
                reference: ''
            });
            setShowPaymentDialog(false);

            setToast({
                severity: 'success',
                summary: 'Payment Added',
                detail: `Payment of $${payment.amount.toFixed(2)} has been recorded.`,
                life: 3000
            });
        }
    };

    const handleDeleteInvoice = () => {
        setInvoice({ ...invoice, status: 'cancelled' });
        setShowDeleteDialog(false);
        setToast({
            severity: 'success',
            summary: 'Invoice Cancelled',
            detail: 'Invoice has been cancelled successfully.',
            life: 3000
        });
    };

    const itemTotalBodyTemplate = (rowData: InvoiceItem) => {
        return `$${rowData.total.toFixed(2)}`;
    };

    const paymentStatusBodyTemplate = (rowData: Payment) => {
        return <Badge value={rowData.status} severity={getPaymentStatusSeverity(rowData.status)} />;
    };

    const paymentAmountBodyTemplate = (rowData: Payment) => {
        return `$${rowData.amount.toFixed(2)}`;
    };

    const paymentDateBodyTemplate = (rowData: Payment) => {
        return rowData.date.toLocaleDateString();
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Details</h1>
                        <p className="text-gray-600">View and manage invoice information</p>
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
                {/* Main Invoice Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Invoice Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{invoice.id}</h2>
                                <p className="text-gray-600">Invoice Date: {invoice.invoiceDate.toLocaleDateString()}</p>
                                <p className="text-gray-600">Due Date: {invoice.dueDate.toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <Badge value={invoice.status} severity={getStatusSeverity(invoice.status)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                                <p className="font-medium">{invoice.customerName}</p>
                                <p className="text-gray-600">{invoice.customerEmail}</p>
                                <p className="text-gray-600">{invoice.customerPhone}</p>
                                <p className="text-gray-600">{invoice.customerAddress}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Payment Summary:</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-medium">${invoice.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Paid Amount:</span>
                                        <span className="font-medium text-green-600">${invoice.paidAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Balance:</span>
                                        <span className={`font-medium ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            ${invoice.balance.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Invoice Items</h3>
                        <DataTable value={invoice.items} className="p-0">
                            <Column field="description" header="Description" />
                            <Column field="quantity" header="Qty" />
                            <Column
                                field="unitPrice"
                                header="Unit Price"
                                body={(rowData) => `$${rowData.unitPrice.toFixed(2)}`}
                            />
                            <Column field="total" header="Total" body={itemTotalBodyTemplate} />
                        </DataTable>

                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span>${invoice.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                                        <span>${invoice.taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                        <span>Total:</span>
                                        <span>${invoice.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Payment History</h3>
                            <Button
                                label="Add Payment"
                                icon="pi pi-plus"
                                onClick={() => setShowPaymentDialog(true)}
                                disabled={invoice.status === 'paid'}
                            />
                        </div>

                        {invoice.payments.length > 0 ? (
                            <DataTable value={invoice.payments} className="p-0">
                                <Column field="date" header="Date" body={paymentDateBodyTemplate} />
                                <Column field="amount" header="Amount" body={paymentAmountBodyTemplate} />
                                <Column field="method" header="Method" />
                                <Column field="reference" header="Reference" />
                                <Column field="status" header="Status" body={paymentStatusBodyTemplate} />
                            </DataTable>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No payments recorded yet.</p>
                        )}
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Notes</h3>
                            <p className="text-gray-700">{invoice.notes}</p>
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
                                    value={invoice.status}
                                    options={statusOptions}
                                    onChange={(e) => handleStatusChange(e.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button
                                label="Mark as Paid"
                                icon="pi pi-check"
                                onClick={() => handleStatusChange('paid')}
                                disabled={invoice.status === 'paid'}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">
                                    {invoice.status === 'paid' ? '100%' :
                                        invoice.status === 'sent' ? '75%' :
                                            invoice.status === 'draft' ? '50%' :
                                                invoice.status === 'overdue' ? '25%' : '0%'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                        width: `${invoice.status === 'paid' ? 100 :
                                            invoice.status === 'sent' ? 75 :
                                                invoice.status === 'draft' ? 50 :
                                                    invoice.status === 'overdue' ? 25 : 0}%`
                                    }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {invoice.status === 'paid' ? 'Payment completed' :
                                    invoice.status === 'sent' ? 'Invoice sent to customer' :
                                        invoice.status === 'draft' ? 'Draft invoice' :
                                            invoice.status === 'overdue' ? 'Payment overdue' : 'Invoice pending'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Invoice Dialog */}
            <Dialog
                header="Edit Invoice"
                visible={showEditDialog}
                onHide={() => setShowEditDialog(false)}
                style={{ width: '600px' }}
                modal
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                            <Calendar
                                value={invoice.invoiceDate}
                                onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.value as Date })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                            <Calendar
                                value={invoice.dueDate}
                                onChange={(e) => setInvoice({ ...invoice, dueDate: e.value as Date })}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                            value={invoice.notes}
                            onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
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
                                    summary: 'Invoice Updated',
                                    detail: 'Invoice has been updated successfully.',
                                    life: 3000
                                });
                            }}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Add Payment Dialog */}
            <Dialog
                header="Add Payment"
                visible={showPaymentDialog}
                onHide={() => setShowPaymentDialog(false)}
                style={{ width: '500px' }}
                modal
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                        <InputText
                            type="number"
                            value={newPayment.amount?.toString() || ''}
                            onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                            placeholder="Enter payment amount"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                        <Dropdown
                            value={newPayment.method}
                            options={paymentMethods}
                            onChange={(e) => setNewPayment({ ...newPayment, method: e.value })}
                            placeholder="Select payment method"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reference *</label>
                        <InputText
                            value={newPayment.reference}
                            onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                            placeholder="Payment reference number"
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowPaymentDialog(false)}
                        />
                        <Button
                            label="Add Payment"
                            onClick={handleAddPayment}
                            disabled={!newPayment.amount || !newPayment.method || !newPayment.reference}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                header="Delete Invoice"
                visible={showDeleteDialog}
                onHide={() => setShowDeleteDialog(false)}
                style={{ width: '400px' }}
                modal
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to delete this invoice? This action cannot be undone.
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
                            onClick={handleDeleteInvoice}
                        />
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
};

export default InvoiceDetails; 