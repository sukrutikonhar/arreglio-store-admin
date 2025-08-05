import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Filter } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending';
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
    joinDate: string;
    address: string;
    notes: string;
}

const mockCustomers: Customer[] = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        totalOrders: 15,
        totalSpent: 2450.00,
        lastOrder: '2024-01-15',
        joinDate: '2023-03-10',
        address: '123 Main St, New York, NY 10001',
        notes: 'Premium customer, prefers express delivery'
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 234-5678',
        status: 'active',
        totalOrders: 8,
        totalSpent: 1200.00,
        lastOrder: '2024-01-10',
        joinDate: '2023-06-15',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        notes: 'Likes eco-friendly products'
    },
    {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        phone: '+1 (555) 345-6789',
        status: 'inactive',
        totalOrders: 3,
        totalSpent: 450.00,
        lastOrder: '2023-11-20',
        joinDate: '2023-08-22',
        address: '789 Pine Rd, Chicago, IL 60601',
        notes: 'Inactive for 2 months'
    },
    {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 456-7890',
        status: 'pending',
        totalOrders: 0,
        totalSpent: 0.00,
        lastOrder: 'N/A',
        joinDate: '2024-01-20',
        address: '321 Elm St, Miami, FL 33101',
        notes: 'New customer, needs verification'
    },
    {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+1 (555) 567-8901',
        status: 'active',
        totalOrders: 22,
        totalSpent: 3800.00,
        lastOrder: '2024-01-18',
        joinDate: '2022-12-05',
        address: '654 Maple Dr, Seattle, WA 98101',
        notes: 'VIP customer, high-value orders'
    }
];

const statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' }
];

const CustomersList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showCustomerDialog, setShowCustomerDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
        name: '',
        email: '',
        phone: '',
        status: 'pending',
        address: '',
        notes: ''
    });
    const [toast, setToast] = useState<any>(null);

    const statusBodyTemplate = (rowData: Customer) => {
        const getStatusSeverity = (status: string) => {
            switch (status) {
                case 'active': return 'success';
                case 'inactive': return 'danger';
                case 'pending': return 'warning';
                default: return 'info';
            }
        };

        return <Badge value={rowData.status} severity={getStatusSeverity(rowData.status)} />;
    };

    const actionBodyTemplate = (rowData: Customer) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    className="p-button-text p-button-sm"
                    onClick={() => handleViewCustomer(rowData)}
                />
                <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm"
                    onClick={() => handleEditCustomer(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-text p-button-sm p-button-danger"
                    onClick={() => handleDeleteCustomer(rowData)}
                />
            </div>
        );
    };

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowCustomerDialog(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowCustomerDialog(true);
    };

    const handleDeleteCustomer = (customer: Customer) => {
        setCustomers(customers.filter(c => c.id !== customer.id));
        setToast({
            severity: 'success',
            summary: 'Customer Deleted',
            detail: `${customer.name} has been deleted successfully.`,
            life: 3000
        });
    };

    const handleAddCustomer = () => {
        if (newCustomer.name && newCustomer.email) {
            const customer: Customer = {
                id: Math.max(...customers.map(c => c.id)) + 1,
                name: newCustomer.name!,
                email: newCustomer.email!,
                phone: newCustomer.phone || '',
                status: newCustomer.status as 'active' | 'inactive' | 'pending',
                totalOrders: 0,
                totalSpent: 0.00,
                lastOrder: 'N/A',
                joinDate: new Date().toISOString().split('T')[0],
                address: newCustomer.address || '',
                notes: newCustomer.notes || ''
            };

            setCustomers([...customers, customer]);
            setNewCustomer({
                name: '',
                email: '',
                phone: '',
                status: 'pending',
                address: '',
                notes: ''
            });
            setShowAddDialog(false);
            setToast({
                severity: 'success',
                summary: 'Customer Added',
                detail: `${customer.name} has been added successfully.`,
                life: 3000
            });
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        filterCustomers(value, statusFilter);
    };

    const handleStatusFilter = (value: string | null) => {
        setStatusFilter(value);
        filterCustomers(searchTerm, value);
    };

    const filterCustomers = (search: string, status: string | null) => {
        let filtered = customers;

        if (search) {
            filtered = filtered.filter(customer =>
                customer.name.toLowerCase().includes(search.toLowerCase()) ||
                customer.email.toLowerCase().includes(search.toLowerCase()) ||
                customer.phone.includes(search)
            );
        }

        if (status) {
            filtered = filtered.filter(customer => customer.status === status);
        }

        setFilteredCustomers(filtered);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
                <p className="text-gray-600">Manage your customer database and view customer information</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <InputText
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                            <Dropdown
                                value={statusFilter}
                                options={statusOptions}
                                onChange={(e) => handleStatusFilter(e.value)}
                                placeholder="Filter by status"
                                className="w-full sm:w-48"
                            />
                        </div>
                        <Button
                            label="Add Customer"
                            icon="pi pi-plus"
                            onClick={() => setShowAddDialog(true)}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>

                <DataTable
                    value={filteredCustomers}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    className="p-0"
                    emptyMessage="No customers found."
                >
                    <Column field="name" header="Name" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="phone" header="Phone" />
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                    <Column field="totalOrders" header="Orders" sortable />
                    <Column
                        field="totalSpent"
                        header="Total Spent"
                        sortable
                        body={(rowData) => `$${rowData.totalSpent.toFixed(2)}`}
                    />
                    <Column field="lastOrder" header="Last Order" sortable />
                    <Column header="Actions" body={actionBodyTemplate} style={{ width: '120px' }} />
                </DataTable>
            </div>

            {/* Customer Details Dialog */}
            <Dialog
                header={selectedCustomer ? `Customer Details - ${selectedCustomer.name}` : 'Customer Details'}
                visible={showCustomerDialog}
                onHide={() => setShowCustomerDialog(false)}
                style={{ width: '600px' }}
                modal
            >
                {selectedCustomer && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <InputText value={selectedCustomer.name} className="w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <InputText value={selectedCustomer.email} className="w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <InputText value={selectedCustomer.phone} className="w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <Dropdown
                                    value={selectedCustomer.status}
                                    options={[
                                        { label: 'Active', value: 'active' },
                                        { label: 'Inactive', value: 'inactive' },
                                        { label: 'Pending', value: 'pending' }
                                    ]}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <InputText value={selectedCustomer.address} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <InputText value={selectedCustomer.notes} className="w-full" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Total Orders:</span>
                                <p className="font-medium">{selectedCustomer.totalOrders}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Total Spent:</span>
                                <p className="font-medium">${selectedCustomer.totalSpent.toFixed(2)}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Join Date:</span>
                                <p className="font-medium">{selectedCustomer.joinDate}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* Add Customer Dialog */}
            <Dialog
                header="Add New Customer"
                visible={showAddDialog}
                onHide={() => setShowAddDialog(false)}
                style={{ width: '500px' }}
                modal
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <InputText
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <InputText
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <InputText
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <Dropdown
                                value={newCustomer.status}
                                options={[
                                    { label: 'Active', value: 'active' },
                                    { label: 'Inactive', value: 'inactive' },
                                    { label: 'Pending', value: 'pending' }
                                ]}
                                onChange={(e) => setNewCustomer({ ...newCustomer, status: e.value })}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <InputText
                            value={newCustomer.address}
                            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <InputText
                            value={newCustomer.notes}
                            onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowAddDialog(false)}
                        />
                        <Button
                            label="Add Customer"
                            onClick={handleAddCustomer}
                            disabled={!newCustomer.name || !newCustomer.email}
                        />
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
};

export default CustomersList; 