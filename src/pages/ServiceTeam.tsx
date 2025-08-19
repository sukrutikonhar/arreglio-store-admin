import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Search } from 'lucide-react';
import { useTeamContext, TeamMember } from '../context/TeamContext';

const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Technician', value: 'technician' },
    { label: 'Support', value: 'support' },
    { label: 'Intern', value: 'intern' }
];

const departments = [
    { label: 'IT', value: 'it' },
    { label: 'Customer Service', value: 'customer_service' },
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Operations', value: 'operations' }
];

const statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'On Leave', value: 'on_leave' }
];

export default function ServiceTeam() {
    const {
        teamMembers,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        getOrdersByMember
    } = useTeamContext();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = React.useRef<Toast>(null);

    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        status: 'active' as 'active' | 'inactive' | 'on_leave'
    });

    const filteredMembers = teamMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !selectedRole || member.role === selectedRole;
        const matchesStatus = !selectedStatus || member.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleAddMember = async () => {
        if (!newMember.name || !newMember.email || !newMember.role || !newMember.department) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields',
                life: 3000
            });
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            addTeamMember({
                name: newMember.name,
                email: newMember.email,
                phone: newMember.phone,
                role: newMember.role,
                department: newMember.department,
                status: newMember.status,
                avatar: '/images/avatar/user1.jpg',
                joinDate: new Date().toISOString().split('T')[0],
                lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16)
            });

            setShowAddDialog(false);
            setNewMember({
                name: '',
                email: '',
                phone: '',
                role: '',
                department: '',
                status: 'active'
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Team member added successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add team member',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditMember = async () => {
        if (!editingMember) return;

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            updateTeamMember(editingMember.id, {
                name: editingMember.name,
                email: editingMember.email,
                phone: editingMember.phone,
                role: editingMember.role,
                department: editingMember.department,
                status: editingMember.status
            });

            setShowEditDialog(false);
            setEditingMember(null);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Team member updated successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update team member',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMember = async (id: string) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            deleteTeamMember(id);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Team member deleted successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete team member',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const statusBodyTemplate = (rowData: TeamMember) => {
        const statusConfig = {
            active: { severity: 'success' as const, value: 'Active' },
            inactive: { severity: 'danger' as const, value: 'Inactive' },
            on_leave: { severity: 'warning' as const, value: 'On Leave' }
        };

        const config = statusConfig[rowData.status];
        return <Badge value={config.value} severity={config.severity} />;
    };

    const actionBodyTemplate = (rowData: TeamMember) => {
        return (
            <div className="flex space-x-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm"
                    onClick={() => {
                        setEditingMember(rowData);
                        setShowEditDialog(true);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-text p-button-danger p-button-sm"
                    onClick={() => handleDeleteMember(rowData.id)}
                />
            </div>
        );
    };

    const avatarBodyTemplate = (rowData: TeamMember) => {
        if (rowData.avatar) {
            return (
                <img
                    src={rowData.avatar}
                    alt={rowData.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
            );
        }

        // Show initials if no avatar
        const initials = rowData.name.split(' ').map(n => n[0]).join('').toUpperCase();
        return (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {initials}
            </div>
        );
    };

    const assignedOrdersBodyTemplate = (rowData: TeamMember) => {
        const orders = getOrdersByMember(rowData.id);
        if (orders.length === 0) {
            return <span className="text-gray-400 text-sm">No orders assigned</span>;
        }

        return (
            <div className="space-y-1">
                {orders.map(order => (
                    <div key={order.id} className="flex items-center gap-2">
                        <Badge
                            value={`#${order.id}`}
                            severity="info"
                            className="text-xs"
                        />
                        <span className="text-xs text-gray-600 truncate max-w-[120px]" title={order.customerName}>
                            {order.customerName}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <Toast ref={toast} />

            <div className="mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Service Team</h1>
                            <p className="mt-2 text-gray-600">Manage your team members and their roles</p>
                        </div>
                        <Button
                            label="Add Member"
                            icon="pi pi-plus"
                            onClick={() => setShowAddDialog(true)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <InputText
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <Dropdown
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.value)}
                                options={roles}
                                placeholder="All Roles"
                                className="w-full"
                                showClear
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <Dropdown
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.value)}
                                options={statuses}
                                placeholder="All Statuses"
                                className="w-full"
                                showClear
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                label="Clear Filters"
                                className="p-button-text"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedRole('');
                                    setSelectedStatus('');
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Team Members Table */}
                <div className="">
                    <DataTable
                        value={filteredMembers}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        loading={isLoading}
                        emptyMessage="No team members found"
                        scrollable
                        scrollHeight="600px"
                    >
                        <Column field="avatar" header="Avatar" body={avatarBodyTemplate} style={{ width: '80px', minWidth: '80px' }} />
                        <Column field="name" header="Name" sortable style={{ width: '150px', minWidth: '150px' }} />
                        <Column field="email" header="Email" sortable style={{ width: '200px', minWidth: '200px' }} />
                        <Column field="phone" header="Phone" style={{ width: '150px', minWidth: '150px' }} />
                        <Column field="role" header="Role" sortable style={{ width: '120px', minWidth: '120px' }} />
                        <Column field="department" header="Department" sortable style={{ width: '140px', minWidth: '140px' }} />
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ width: '120px', minWidth: '120px' }} />
                        <Column field="joinDate" header="Join Date" sortable style={{ width: '120px', minWidth: '120px' }} />
                        <Column field="lastActive" header="Last Active" sortable style={{ width: '140px', minWidth: '140px' }} />
                        <Column header="Assigned Orders" body={assignedOrdersBodyTemplate} style={{ width: '200px', minWidth: '200px' }} />
                        <Column header="Actions" body={actionBodyTemplate} style={{ width: '120px', minWidth: '120px' }} />
                    </DataTable>
                </div>
            </div>

            {/* Add Member Dialog */}
            <Dialog
                visible={showAddDialog}
                onHide={() => setShowAddDialog(false)}
                header="Add Team Member"
                style={{ width: '600px' }}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowAddDialog(false)}
                        />
                        <Button
                            label="Add Member"
                            icon="pi pi-check"
                            loading={isLoading}
                            onClick={handleAddMember}
                        />
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <InputText
                                value={newMember.name}
                                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <InputText
                                value={newMember.email}
                                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full"
                                placeholder="Enter email address"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <InputText
                                value={newMember.phone}
                                onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <Dropdown
                                value={newMember.status}
                                onChange={(e) => setNewMember(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'on_leave' }))}
                                options={statuses}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <Dropdown
                                value={newMember.role}
                                onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                                options={roles}
                                className="w-full"
                                placeholder="Select role"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                            <Dropdown
                                value={newMember.department}
                                onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                                options={departments}
                                className="w-full"
                                placeholder="Select department"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Edit Member Dialog */}
            <Dialog
                visible={showEditDialog}
                onHide={() => setShowEditDialog(false)}
                header="Edit Team Member"
                style={{ width: '600px' }}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowEditDialog(false)}
                        />
                        <Button
                            label="Update Member"
                            icon="pi pi-check"
                            loading={isLoading}
                            onClick={handleEditMember}
                        />
                    </div>
                }
            >
                {editingMember && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <InputText
                                    value={editingMember.name}
                                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <InputText
                                    value={editingMember.email}
                                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, email: e.target.value } : null)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <InputText
                                    value={editingMember.phone}
                                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <Dropdown
                                    value={editingMember.status}
                                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, status: e.target.value as 'active' | 'inactive' | 'on_leave' } : null)}
                                    options={statuses}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <Dropdown
                                    value={editingMember.role}
                                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, role: e.target.value } : null)}
                                    options={roles}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <Dropdown
                                    value={editingMember.department}
                                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, department: e.target.value } : null)}
                                    options={departments}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 