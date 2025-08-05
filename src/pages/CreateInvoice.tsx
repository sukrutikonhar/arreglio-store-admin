import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface Customer {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
}

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Invoice {
    id: string;
    customerId: number;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    invoiceDate: Date;
    dueDate: Date;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    notes: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const mockCustomers: Customer[] = [
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', address: '123 Main St, New York, NY 10001', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', address: '456 Oak Ave, Los Angeles, CA 90210', phone: '+1 (555) 234-5678' },
    { id: 3, name: 'Mike Wilson', email: 'mike.wilson@email.com', address: '789 Pine Rd, Chicago, IL 60601', phone: '+1 (555) 345-6789' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@email.com', address: '321 Elm St, Miami, FL 33101', phone: '+1 (555) 456-7890' },
    { id: 5, name: 'David Brown', email: 'david.brown@email.com', address: '654 Maple Dr, Seattle, WA 98101', phone: '+1 (555) 567-8901' }
];

const taxRates = [
    { label: '0%', value: 0 },
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '15%', value: 15 },
    { label: '20%', value: 20 }
];

const CreateInvoice: React.FC = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
    const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    const [taxRate, setTaxRate] = useState<number>(10);
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [toast, setToast] = useState<any>(null);
    const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
        description: '',
        quantity: 1,
        unitPrice: 0
    });

    const calculateItemTotal = (item: InvoiceItem) => {
        return item.quantity * item.unitPrice;
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };

    const calculateTaxAmount = () => {
        return (calculateSubtotal() * taxRate) / 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTaxAmount();
    };

    const handleAddItem = () => {
        if (newItem.description && newItem.quantity && newItem.unitPrice) {
            const item: InvoiceItem = {
                id: Date.now(),
                description: newItem.description!,
                quantity: newItem.quantity!,
                unitPrice: newItem.unitPrice!,
                total: calculateItemTotal({ ...newItem, id: 0 } as InvoiceItem)
            };

            setItems([...items, item]);
            setNewItem({
                description: '',
                quantity: 1,
                unitPrice: 0
            });
        }
    };

    const handleRemoveItem = (itemId: number) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const handleItemChange = (itemId: number, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item => {
            if (item.id === itemId) {
                const updatedItem = { ...item, [field]: value };
                return { ...updatedItem, total: calculateItemTotal(updatedItem) };
            }
            return item;
        }));
    };

    const handleCreateInvoice = () => {
        if (!selectedCustomer || items.length === 0) {
            setToast({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please select a customer and add at least one item.',
                life: 3000
            });
            return;
        }

        const invoice: Invoice = {
            id: `INV-${Date.now()}`,
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            customerEmail: selectedCustomer.email,
            customerAddress: selectedCustomer.address,
            invoiceDate,
            dueDate,
            items,
            subtotal: calculateSubtotal(),
            taxRate,
            taxAmount: calculateTaxAmount(),
            total: calculateTotal(),
            notes,
            status: 'draft'
        };

        setToast({
            severity: 'success',
            summary: 'Invoice Created',
            detail: `Invoice ${invoice.id} has been created successfully.`,
            life: 3000
        });

        // Here you would typically save the invoice to your backend
        console.log('Invoice created:', invoice);
    };

    const itemTotalBodyTemplate = (rowData: InvoiceItem) => {
        return `$${rowData.total.toFixed(2)}`;
    };

    const actionBodyTemplate = (rowData: InvoiceItem) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-text p-button-danger p-button-sm"
                onClick={() => handleRemoveItem(rowData.id)}
            />
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Invoice</h1>
                <p className="text-gray-600">Create and manage invoices for your customers</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Invoice Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Selection */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer *</label>
                                <Dropdown
                                    value={selectedCustomer}
                                    options={mockCustomers}
                                    onChange={(e) => setSelectedCustomer(e.value)}
                                    optionLabel="name"
                                    placeholder="Choose a customer"
                                    className="w-full"
                                />
                            </div>

                            {selectedCustomer && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <span className="text-sm text-gray-500">Email:</span>
                                        <p className="font-medium">{selectedCustomer.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Phone:</span>
                                        <p className="font-medium">{selectedCustomer.phone}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="text-sm text-gray-500">Address:</span>
                                        <p className="font-medium">{selectedCustomer.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                                <Calendar
                                    value={invoiceDate}
                                    onChange={(e) => setInvoiceDate(e.value as Date)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                <Calendar
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.value as Date)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate</label>
                                <Dropdown
                                    value={taxRate}
                                    options={taxRates}
                                    onChange={(e) => setTaxRate(e.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Items</h2>

                        {/* Add Item Form */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <InputText
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    placeholder="Item description"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <InputNumber
                                    value={newItem.quantity}
                                    onValueChange={(e) => setNewItem({ ...newItem, quantity: e.value || 1 })}
                                    min={1}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                                <InputNumber
                                    value={newItem.unitPrice}
                                    onValueChange={(e) => setNewItem({ ...newItem, unitPrice: e.value || 0 })}
                                    mode="currency"
                                    currency="USD"
                                    min={0}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    label="Add Item"
                                    icon="pi pi-plus"
                                    onClick={handleAddItem}
                                    disabled={!newItem.description || !newItem.quantity || !newItem.unitPrice}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Items Table */}
                        <DataTable
                            value={items}
                            emptyMessage="No items added yet."
                            className="p-0"
                        >
                            <Column field="description" header="Description" />
                            <Column
                                field="quantity"
                                header="Qty"
                                body={(rowData) => (
                                    <InputNumber
                                        value={rowData.quantity}
                                        onValueChange={(e) => handleItemChange(rowData.id, 'quantity', e.value || 1)}
                                        min={1}
                                        className="w-20"
                                    />
                                )}
                            />
                            <Column
                                field="unitPrice"
                                header="Unit Price"
                                body={(rowData) => (
                                    <InputNumber
                                        value={rowData.unitPrice}
                                        onValueChange={(e) => handleItemChange(rowData.id, 'unitPrice', e.value || 0)}
                                        mode="currency"
                                        currency="USD"
                                        min={0}
                                        className="w-32"
                                    />
                                )}
                            />
                            <Column field="total" header="Total" body={itemTotalBodyTemplate} />
                            <Column header="Actions" body={actionBodyTemplate} style={{ width: '80px' }} />
                        </DataTable>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes for this invoice..."
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Invoice Summary */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Summary</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax ({taxRate}%):</span>
                                <span className="font-medium">${calculateTaxAmount().toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Button
                                label="Preview Invoice"
                                icon="pi pi-eye"
                                onClick={() => setShowPreview(true)}
                                className="w-full"
                                disabled={!selectedCustomer || items.length === 0}
                            />
                            <Button
                                label="Create Invoice"
                                icon="pi pi-check"
                                onClick={handleCreateInvoice}
                                className="w-full"
                                disabled={!selectedCustomer || items.length === 0}
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button
                                label="Save as Draft"
                                icon="pi pi-save"
                                className="p-button-text w-full justify-start"
                            />
                            <Button
                                label="Send to Customer"
                                icon="pi pi-send"
                                className="p-button-text w-full justify-start"
                            />
                            <Button
                                label="Download PDF"
                                icon="pi pi-download"
                                className="p-button-text w-full justify-start"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Preview Dialog */}
            <Dialog
                header="Invoice Preview"
                visible={showPreview}
                onHide={() => setShowPreview(false)}
                style={{ width: '800px', maxWidth: '90vw' }}
                modal
            >
                {selectedCustomer && (
                    <div className="space-y-6">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                                <p className="text-gray-600">Invoice #: {`INV-${Date.now()}`}</p>
                                <p className="text-gray-600">Date: {invoiceDate.toLocaleDateString()}</p>
                                <p className="text-gray-600">Due Date: {dueDate.toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-900">Bill To:</h3>
                                <p className="text-gray-700">{selectedCustomer.name}</p>
                                <p className="text-gray-600">{selectedCustomer.email}</p>
                                <p className="text-gray-600">{selectedCustomer.address}</p>
                            </div>
                        </div>

                        {/* Invoice Items */}
                        <div className="border-t border-gray-200 pt-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2">Description</th>
                                        <th className="text-right py-2">Qty</th>
                                        <th className="text-right py-2">Unit Price</th>
                                        <th className="text-right py-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-100">
                                            <td className="py-2">{item.description}</td>
                                            <td className="text-right py-2">{item.quantity}</td>
                                            <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                                            <td className="text-right py-2">${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Invoice Summary */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${calculateSubtotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax ({taxRate}%):</span>
                                        <span>${calculateTaxAmount().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                        <span>Total:</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {notes && (
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                                <p className="text-gray-700">{notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
};

export default CreateInvoice; 