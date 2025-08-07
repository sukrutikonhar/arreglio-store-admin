// src/pages/GeneralSettings.tsx
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

interface Service {
    id: number;
    category: string;
    serviceName: string;
    serviceDescription: string;
    price: number;
    vatRate: number;
    deliveryPrice: number;
}

export default function GeneralSettings() {
    const navigate = useNavigate();

    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<any>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editedDeliverySlot, setEditedDeliverySlot] = useState<any>(null);
    const [editOpeningHourDialog, setEditOpeningHourDialog] = useState(false);
    const [editingOpeningHour, setEditingOpeningHour] = useState<any>(null);
    const [toast, setToast] = useState<any>(null);
    const [openingHours, setOpeningHours] = useState([
        { day: 'Monday', opens: '11:30', closes: '21:30', status: 'Open' },
        { day: 'Tuesday', opens: '11:30', closes: '21:30', status: 'Open' },
        { day: 'Wednesday', opens: '11:30', closes: '21:30', status: 'Open' },
    ]);

    // Services state
    const [services, setServices] = useState<Service[]>([
        {
            id: 1,
            category: 'Electric Bike',
            serviceName: 'Bike wash',
            serviceDescription: 'Bike wash',
            price: 250.00,
            vatRate: 25.00,
            deliveryPrice: 0.00
        },
        {
            id: 2,
            category: 'Regular Bike',
            serviceName: 'Vet du inte vilket problem produkten har?',
            serviceDescription: 'Vi hämtar din produkt och verkstaden bedömer vad som är fel och återkommer till dig med ett förslag genom Fixi.',
            price: 0.00,
            vatRate: 25.00,
            deliveryPrice: 0.00
        },
        {
            id: 3,
            category: 'Cargo Bike',
            serviceName: 'Wheel alignment',
            serviceDescription: 'wheel alignment',
            price: 400.00,
            vatRate: 25.00,
            deliveryPrice: 299.00
        },
        {
            id: 4,
            category: 'Scooter',
            serviceName: 'Bike Wash Service',
            serviceDescription: 'Wash Service',
            price: 25.00,
            vatRate: 25.00,
            deliveryPrice: 0.00
        },
        {
            id: 5,
            category: 'Electric Bike',
            serviceName: 'make something',
            serviceDescription: 'make something',
            price: 55.00,
            vatRate: 25.00,
            deliveryPrice: 0.00
        }
    ]);

    const [showServiceDialog, setShowServiceDialog] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [newService, setNewService] = useState<Omit<Service, 'id'>>({
        category: '',
        serviceName: '',
        serviceDescription: '',
        price: 0,
        vatRate: 25,
        deliveryPrice: 0
    });
    const [serviceErrors, setServiceErrors] = useState({
        category: false,
        serviceName: false,
        serviceDescription: false,
        price: false,
        vatRate: false,
        deliveryPrice: false
    });

    // Delete confirmation states
    const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
    const [deleteOpeningHourDialog, setDeleteOpeningHourDialog] = useState(false);
    const [deleteDeliverySlotDialog, setDeleteDeliverySlotDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDeliveryRegion, setSelectedDeliveryRegion] = useState('');
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('');

    const [newOpeningHours, setNewOpeningHours] = useState({
        day: '',
        opens: '',
        closes: '',
        status: 'Open'
    });
    const [openHoursErrors, setOpenHoursErrors] = useState({
        day: false,
        opens: false,
        closes: false,
        status: false
    });

    const daysOfWeek = [
        'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    const categoryOptions = [
        { label: 'Electric Bike', value: 'Electric Bike' },
        { label: 'Cargo Bike', value: 'Cargo Bike' },
        { label: 'Regular Bike', value: 'Regular Bike' },
        { label: 'Scooter', value: 'Scooter' }
    ];

    const statusOptions = [
        { label: 'Open', value: 'Open' },
        { label: 'Closed', value: 'Closed' }
    ];

    const regionOptions = [
        { label: 'Stockholm', value: 'Stockholm' },
        { label: 'Gothenburg', value: 'Gothenburg' },
        { label: 'Malmo', value: 'Malmo' }
    ];

    const deliveryStatusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Scheduled', value: 'Scheduled' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];

    const marketplaceOptions = [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
    ];

    const subscriptionOptions = [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
    ];

    const availableDays = daysOfWeek.filter(
        (day) => !openingHours.some((item) => item.day === day)
    );

    // Service functions
    const handleCreateService = () => {
        const errors = {
            category: !newService.category.trim(),
            serviceName: !newService.serviceName.trim(),
            serviceDescription: !newService.serviceDescription.trim(),
            price: newService.price < 0,
            vatRate: newService.vatRate < 0 || newService.vatRate > 100,
            deliveryPrice: newService.deliveryPrice < 0
        };
        setServiceErrors(errors);

        if (Object.values(errors).some(Boolean)) return;

        const newServiceWithId: Service = {
            ...newService,
            id: Math.max(...services.map(s => s.id), 0) + 1
        };

        setServices([...services, newServiceWithId]);
        setShowServiceDialog(false);
        setNewService({
            category: '',
            serviceName: '',
            serviceDescription: '',
            price: 0,
            vatRate: 25,
            deliveryPrice: 0
        });
        setServiceErrors({
            category: false,
            serviceName: false,
            serviceDescription: false,
            price: false,
            vatRate: false,
            deliveryPrice: false
        });
        setToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Service has been created successfully.',
            life: 3000
        });
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setShowServiceDialog(true);
    };

    const handleUpdateService = () => {
        if (!editingService) return;

        const errors = {
            category: !editingService.category.trim(),
            serviceName: !editingService.serviceName.trim(),
            serviceDescription: !editingService.serviceDescription.trim(),
            price: editingService.price < 0,
            vatRate: editingService.vatRate < 0 || editingService.vatRate > 100,
            deliveryPrice: editingService.deliveryPrice < 0
        };
        setServiceErrors(errors);

        if (Object.values(errors).some(Boolean)) return;

        setServices(services.map(s => s.id === editingService.id ? editingService : s));
        setShowServiceDialog(false);
        setEditingService(null);
        setServiceErrors({
            category: false,
            serviceName: false,
            serviceDescription: false,
            price: false,
            vatRate: false,
            deliveryPrice: false
        });
        setToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Service has been updated successfully.',
            life: 3000
        });
    };

    const handleDeleteService = (service: Service) => {
        setItemToDelete(service);
        setDeleteServiceDialog(true);
    };

    const confirmDeleteService = () => {
        setServices(services.filter(s => s.id !== itemToDelete.id));
        setDeleteServiceDialog(false);
        setItemToDelete(null);
        setToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Service has been deleted successfully.',
            life: 3000
        });
    };

    const serviceDialogFooter = (
        <div className="flex justify-end gap-2">
            <Button
                label="Cancel"
                className="p-button-primary"
                outlined
                onClick={() => {
                    setShowServiceDialog(false);
                    setEditingService(null);
                    setServiceErrors({
                        category: false,
                        serviceName: false,
                        serviceDescription: false,
                        price: false,
                        vatRate: false,
                        deliveryPrice: false
                    });
                }}
            />
            <Button
                label={editingService ? "Update" : "Create"}
                className="p-button-primary"
                onClick={editingService ? handleUpdateService : handleCreateService}
            />
        </div>
    );

    const serviceDeleteTemplate = (rowData: Service) => (
        <div className="flex gap-2">
            <PencilIcon
                className="h-5 w-5 text-green-500 cursor-pointer"
                onClick={() => handleEditService(rowData)}
                data-pr-tooltip="Edit Service"
            />
            <TrashIcon
                className="h-5 w-5 text-red-500 cursor-pointer"
                onClick={() => handleDeleteService(rowData)}
                data-pr-tooltip="Delete Service"
            />
        </div>
    );

    const priceTemplate = (rowData: Service) => (
        <span>{rowData.price.toFixed(2)} kr</span>
    );

    const vatTemplate = (rowData: Service) => (
        <span>{rowData.vatRate.toFixed(2)}%</span>
    );

    const deliveryPriceTemplate = (rowData: Service) => (
        <span>{rowData.deliveryPrice.toFixed(2)} kr</span>
    );

    const handleCreate = () => {
        const errors = {
            day: !newOpeningHours.day,
            opens: !newOpeningHours.opens,
            closes: !newOpeningHours.closes,
            status: !newOpeningHours.status
        };
        setOpenHoursErrors(errors);
        const hasError = Object.values(errors).some(Boolean);
        if (hasError) return;
        setOpeningHours([...openingHours, newOpeningHours]);
        setShowCreateDialog(false);
        setNewOpeningHours({ day: '', opens: '', closes: '', status: 'Open' });
        setOpenHoursErrors({ day: false, opens: false, closes: false, status: false });
        setToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Opening hours have been added successfully.',
            life: 3000
        });
    };

    const dialogFooter = (
        <div className="flex justify-end gap-2">
            <Button label="Cancel" className="p-button-primary" outlined
                onClick={() => {
                    setShowCreateDialog(false);
                    setOpenHoursErrors({ day: false, opens: false, closes: false, status: false });
                }} />
            <Button label="Add" className="p-button-primary"
                onClick={handleCreate} />
        </div>
    );

    const [deliverySlots, setDeliverySlots] = useState([
        {
            region: 'Stockholm',
            interval: '02:00:00',
            status: 'Inactive',
            capacity: 20,
            marketplace: false,
            subscription: false
        }
    ]);

    const [showDeliverySlotDialog, setShowDeliverySlotDialog] = useState(false);
    const [newDeliverySlot, setNewDeliverySlot] = useState({
        region: '',
        interval: '',
        status: 'Inactive',
        capacity: '',
        marketplace: false,
        subscription: false
    });

    const handleDeleteClick = (rowData: any) => {
        setItemToDelete(rowData);
        setDeleteOpeningHourDialog(true);
    };

    const confirmDeleteOpeningHour = () => {
        setOpeningHours((prev) =>
            prev.filter((item) => item !== itemToDelete)
        );
        setDeleteOpeningHourDialog(false);
        setItemToDelete(null);
        setToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Opening hours have been deleted successfully.',
            life: 3000
        });
    };



    const handleEditClick = (rowData: any) => {
        setSelectedDeliverySlot(rowData);
        setEditedDeliverySlot({ ...rowData });
        setEditDialogVisible(true);
    };

    const handleEditOpeningHour = (rowData: any) => {
        setEditingOpeningHour({ ...rowData });
        setEditOpeningHourDialog(true);
    };

    const handleDeleteDeliverySlot = (rowData: any) => {
        setItemToDelete(rowData);
        setDeleteDeliverySlotDialog(true);
    };

    const confirmDeleteDeliverySlot = () => {
        setDeliverySlots((prev) =>
            prev.filter((item) => item !== itemToDelete)
        );
        setDeleteDeliverySlotDialog(false);
        setItemToDelete(null);
        setToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Delivery slot has been deleted successfully.',
            life: 3000
        });
    };

    const deleteTemplate = (rowData: any) => (
        <div className="flex gap-2">
            <PencilIcon
                className="h-5 w-5 text-green-500 cursor-pointer"
                onClick={() => handleEditOpeningHour(rowData)}
                data-pr-tooltip="Edit Opening Hours"
            />
            <TrashIcon
                className="h-5 w-5 text-red-500 cursor-pointer"
                onClick={() => handleDeleteClick(rowData)}
                data-pr-tooltip="Delete Opening Hours"
            />
        </div>
    );

    const editTemplate = (rowData: any) => (
        <div className="flex gap-2">
            <PencilIcon
                className="h-5 w-5 text-green-500 cursor-pointer"
                onClick={() => handleEditClick(rowData)}
                data-pr-tooltip="Edit Delivery Slot"
            />
            <TrashIcon
                className="h-5 w-5 text-red-500 cursor-pointer"
                onClick={() => handleDeleteDeliverySlot(rowData)}
                data-pr-tooltip="Delete Delivery Slot"
            />
        </div>
    );

    const booleanTemplate = (value: boolean) => value ? 'Yes' : 'No';

    const statusTemplate = (rowData: { status: string }) => {
        const getStatusSeverity = (status: string) => {
            switch (status) {
                case 'Active': return 'success';
                case 'Inactive': return 'danger';
                case 'Scheduled': return 'warning';
                case 'Cancelled': return 'secondary';
                default: return 'info';
            }
        };

        return (
            <Tag
                value={rowData.status}
                severity={getStatusSeverity(rowData.status)}
            />
        );
    };

    const handleCreateDeliverySlot = () => {
        const deliverySlotWithDefaults = {
            ...newDeliverySlot,
            capacity: newDeliverySlot.capacity ? parseInt(newDeliverySlot.capacity) : 0
        };
        setDeliverySlots([...deliverySlots, deliverySlotWithDefaults]);
        setShowDeliverySlotDialog(false);
        setNewDeliverySlot({
            region: '',
            interval: '',
            status: 'Inactive',
            capacity: '',
            marketplace: false,
            subscription: false
        });
        setToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Delivery slot has been added successfully.',
            life: 3000
        });
    };

    const deliverySlotDialogFooter = (
        <div className="flex justify-end gap-2">
            <Button
                label="Cancel"
                className="p-button-primary"
                outlined
                onClick={() => setShowDeliverySlotDialog(false)}
            />
            <Button
                label="Add"
                className="p-button-primary"
                onClick={handleCreateDeliverySlot}
            />
        </div>
    );

    // Use the original data for PrimeReact's built-in filtering
    const filteredServices = services;
    const filteredDeliverySlots = deliverySlots;

    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            const hourStr = hour.toString().padStart(2, '0');
            options.push({ label: `${hourStr}:00`, value: `${hourStr}:00` });
            options.push({ label: `${hourStr}:30`, value: `${hourStr}:30` });
        }
        return options;
    };

    return (
        <div className="">
            {/* Services Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h5 className="website-title">Services</h5>
                        <span id="services-info" className="cursor-pointer">
                            <Info className="h-5 w-5 text-gray-500" />
                        </span>
                    </div>
                    <Button
                        label="Create Service"
                        icon="pi pi-plus"
                        className="p-button-primary"
                        onClick={() => {
                            setEditingService(null);
                            setNewService({
                                category: '',
                                serviceName: '',
                                serviceDescription: '',
                                price: 0,
                                vatRate: 25,
                                deliveryPrice: 0
                            });
                            setShowServiceDialog(true);
                        }}
                    />
                </div>
                <Tooltip target="#services-info" content="Manage your service offerings, including pricing, VAT rates, and delivery costs." />

                <DataTable
                    value={filteredServices}
                    className="p-datatable-sm mb-4"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} services"
                    emptyMessage="No services found."
                >
                    <Column
                        field="category"
                        header="Category"
                        sortable
                        filter
                        filterPlaceholder="Filter by category"
                        filterMatchMode="equals"
                        filterElement={
                            <Dropdown
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.value)}
                                options={categoryOptions}
                                className="w-full"
                                placeholder="Select category"
                            />
                        }
                    />
                    <Column
                        field="serviceName"
                        header="Service (sv)"
                        sortable
                        filter
                        filterPlaceholder="Search services..."
                        filterMatchMode="contains"
                    />
                    <Column
                        field="serviceDescription"
                        header="Service Description (sv)"
                        sortable
                        filter
                        filterPlaceholder="Search descriptions..."
                        filterMatchMode="contains"
                    />
                    <Column field="price" header="Price (kr)" body={priceTemplate} sortable />
                    <Column field="vatRate" header="Vat Rate %" body={vatTemplate} sortable />
                    <Column field="deliveryPrice" header="Delivery price (kr)" body={deliveryPriceTemplate} sortable />
                    <Column body={serviceDeleteTemplate} header="Actions" style={{ width: '100px' }} />
                </DataTable>
            </div>

            {/* Service Dialog */}
            <Dialog
                header={editingService ? "Edit Service" : "Create Service"}
                visible={showServiceDialog}
                style={{ width: '700px' }}
                footer={serviceDialogFooter}
                onHide={() => {
                    setShowServiceDialog(false);
                    setEditingService(null);
                    setServiceErrors({
                        category: false,
                        serviceName: false,
                        serviceDescription: false,
                        price: false,
                        vatRate: false,
                        deliveryPrice: false
                    });
                }}
            >
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="field">
                            <label htmlFor="category" className="block mb-2">Category</label>
                            <Dropdown
                                id="category"
                                value={editingService ? editingService.category : newService.category}
                                onChange={(e) => {
                                    if (editingService) {
                                        setEditingService({ ...editingService, category: e.value });
                                    } else {
                                        setNewService({ ...newService, category: e.value });
                                    }
                                    setServiceErrors(prev => ({ ...prev, category: false }));
                                }}
                                options={categoryOptions}
                                className={`w-full ${serviceErrors.category ? 'p-invalid' : ''}`}
                                placeholder="Select category"
                            />
                            {serviceErrors.category && <span className="text-xs text-red-500">Category is required</span>}
                        </div>
                        <div className="field">
                            <label htmlFor="serviceName" className="block mb-2">Service Name</label>
                            <InputText
                                id="serviceName"
                                value={editingService ? editingService.serviceName : newService.serviceName}
                                onChange={(e) => {
                                    if (editingService) {
                                        setEditingService({ ...editingService, serviceName: e.target.value });
                                    } else {
                                        setNewService({ ...newService, serviceName: e.target.value });
                                    }
                                    setServiceErrors(prev => ({ ...prev, serviceName: false }));
                                }}
                                className={`w-full ${serviceErrors.serviceName ? 'p-invalid' : ''}`}
                                placeholder="Enter service name"
                            />
                            {serviceErrors.serviceName && <span className="text-xs text-red-500">Service name is required</span>}
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="serviceDescription" className="block mb-2">Service Description</label>
                        <textarea
                            id="serviceDescription"
                            value={editingService ? editingService.serviceDescription : newService.serviceDescription}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                if (editingService) {
                                    setEditingService({ ...editingService, serviceDescription: e.target.value });
                                } else {
                                    setNewService({ ...newService, serviceDescription: e.target.value });
                                }
                                setServiceErrors(prev => ({ ...prev, serviceDescription: false }));
                            }}
                            className={`w-full p-3 border rounded-md ${serviceErrors.serviceDescription ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter service description"
                            rows={3}
                        />
                        {serviceErrors.serviceDescription && <span className="text-xs text-red-500">Service description is required</span>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="field">
                            <label htmlFor="price" className="block mb-2">Price (kr)</label>
                            <InputNumber
                                id="price"
                                value={editingService ? editingService.price : newService.price}
                                onValueChange={(e) => {
                                    if (editingService) {
                                        setEditingService({ ...editingService, price: e.value || 0 });
                                    } else {
                                        setNewService({ ...newService, price: e.value || 0 });
                                    }
                                    setServiceErrors(prev => ({ ...prev, price: false }));
                                }}
                                className={`w-full ${serviceErrors.price ? 'p-invalid' : ''}`}
                                mode="currency"
                                currency="SEK"
                                locale="en-US"
                                minFractionDigits={2}
                                maxFractionDigits={2}
                            />
                            {serviceErrors.price && <span className="text-xs text-red-500">Price must be non-negative</span>}
                        </div>

                        <div className="field">
                            <label htmlFor="vatRate" className="block mb-2">VAT Rate (%)</label>
                            <InputNumber
                                id="vatRate"
                                value={editingService ? editingService.vatRate : newService.vatRate}
                                onValueChange={(e) => {
                                    if (editingService) {
                                        setEditingService({ ...editingService, vatRate: e.value || 0 });
                                    } else {
                                        setNewService({ ...newService, vatRate: e.value || 0 });
                                    }
                                    setServiceErrors(prev => ({ ...prev, vatRate: false }));
                                }}
                                className={`w-full ${serviceErrors.vatRate ? 'p-invalid' : ''}`}
                                min={0}
                                max={100}
                                suffix="%"
                            />
                            {serviceErrors.vatRate && <span className="text-xs text-red-500">VAT rate must be between 0-100%</span>}
                        </div>

                        <div className="field">
                            <label htmlFor="deliveryPrice" className="block mb-2">Delivery Price (kr)</label>
                            <InputNumber
                                id="deliveryPrice"
                                value={editingService ? editingService.deliveryPrice : newService.deliveryPrice}
                                onValueChange={(e) => {
                                    if (editingService) {
                                        setEditingService({ ...editingService, deliveryPrice: e.value || 0 });
                                    } else {
                                        setNewService({ ...newService, deliveryPrice: e.value || 0 });
                                    }
                                    setServiceErrors(prev => ({ ...prev, deliveryPrice: false }));
                                }}
                                className={`w-full ${serviceErrors.deliveryPrice ? 'p-invalid' : ''}`}
                                mode="currency"
                                currency="SEK"
                                locale="en-US"
                                minFractionDigits={2}
                                maxFractionDigits={2}
                            />
                            {serviceErrors.deliveryPrice && <span className="text-xs text-red-500">Delivery price must be non-negative</span>}
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Delete Service Confirmation Dialog */}
            <Dialog
                header="Confirm Delete Service"
                visible={deleteServiceDialog}
                style={{ width: '400px' }}
                onHide={() => setDeleteServiceDialog(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-primary"
                            outlined
                            onClick={() => setDeleteServiceDialog(false)}
                        />
                        <Button
                            label="Delete"
                            className="p-button-danger"
                            onClick={confirmDeleteService}
                        />
                    </div>
                }
            >
                <p>Are you sure you want to delete this service?</p>
                {itemToDelete && (
                    <p className="font-semibold mt-2">{itemToDelete.serviceName}</p>
                )}
            </Dialog>

            {/* Opening Hours Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h5 className="website-title">Opening hours</h5>
                        <span id="opening-hours-info" className="cursor-pointer">
                            <Info className="h-5 w-5 text-gray-500" />
                        </span>
                    </div>
                    <Button
                        label="Add Open Hours"
                        icon="pi pi-plus"
                        className="p-button-primary"
                        onClick={() => setShowCreateDialog(true)}
                    />
                </div>
                <Tooltip target="#opening-hours-info" content="Define the time slots when your store or service is open. Customers can only place orders during these hours." />
                <DataTable
                    value={openingHours}
                    className="p-datatable-sm mb-8"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} opening hours"
                >
                    <Column field="day" header="Day" sortable />
                    <Column field="opens" header="Opens" sortable />
                    <Column field="closes" header="Closes" sortable />
                    <Column field="status" header="Status" sortable />
                    <Column body={deleteTemplate} header="Actions" style={{ width: '100px' }} />
                </DataTable>
            </div>

            <Dialog header="Create Open Hours"
                visible={showCreateDialog}
                style={{ width: '500px' }}
                footer={dialogFooter}
                onHide={() => {
                    setShowCreateDialog(false);
                    setOpenHoursErrors({ day: false, opens: false, closes: false, status: false });
                }}>

                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="field">
                            <label htmlFor="day" className="block mb-2">Day</label>
                            <Dropdown
                                id="day"
                                options={availableDays.map(d => ({ label: d, value: d }))}
                                value={newOpeningHours.day}
                                onChange={e => {
                                    setNewOpeningHours({ ...newOpeningHours, day: e.value });
                                    setOpenHoursErrors(prev => ({ ...prev, day: false }));
                                }}
                                placeholder="Select day"
                                className="w-full"
                                invalid={openHoursErrors.day}
                            />
                            {openHoursErrors.day && <span className="text-xs text-red-500">Day is required</span>}
                        </div>
                        <div className="field">
                            <label htmlFor="status" className="block mb-2">Status</label>
                            <Dropdown
                                id="status"
                                options={statusOptions}
                                value={newOpeningHours.status}
                                onChange={e => {
                                    setNewOpeningHours({ ...newOpeningHours, status: e.value });
                                    setOpenHoursErrors(prev => ({ ...prev, status: false }));
                                }}
                                className="w-full"
                                invalid={openHoursErrors.status}
                            />
                            {openHoursErrors.status && <span className="text-xs text-red-500">Status is required</span>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="field">
                            <label htmlFor="opens" className="block mb-2">Opening Time</label>
                            <Dropdown
                                id="opens"
                                value={newOpeningHours.opens}
                                onChange={(e) => {
                                    setNewOpeningHours({ ...newOpeningHours, opens: e.value });
                                    setOpenHoursErrors(prev => ({ ...prev, opens: false }));
                                }}
                                options={generateTimeOptions()}
                                className={`w-full ${openHoursErrors.opens ? 'p-invalid' : ''}`}
                                placeholder="Select opening time"
                            />
                            {openHoursErrors.opens && <span className="text-xs text-red-500">Opening time is required</span>}
                        </div>
                        <div className="field">
                            <label htmlFor="closes" className="block mb-2">Closing Time</label>
                            <Dropdown
                                id="closes"
                                value={newOpeningHours.closes}
                                onChange={(e) => {
                                    setNewOpeningHours({ ...newOpeningHours, closes: e.value });
                                    setOpenHoursErrors(prev => ({ ...prev, closes: false }));
                                }}
                                options={generateTimeOptions()}
                                className={`w-full ${openHoursErrors.closes ? 'p-invalid' : ''}`}
                                placeholder="Select closing time"
                            />
                            {openHoursErrors.closes && <span className="text-xs text-red-500">Closing time is required</span>}
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Delete Opening Hours Confirmation Dialog */}
            <Dialog
                header="Confirm Delete Opening Hours"
                visible={deleteOpeningHourDialog}
                style={{ width: '400px' }}
                onHide={() => setDeleteOpeningHourDialog(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-primary"
                            outlined
                            onClick={() => setDeleteOpeningHourDialog(false)}
                        />
                        <Button
                            label="Delete"
                            className="p-button-danger"
                            onClick={confirmDeleteOpeningHour}
                        />
                    </div>
                }
            >
                <p>Are you sure you want to delete this opening hour entry?</p>
                {itemToDelete && (
                    <p className="font-semibold mt-2">{itemToDelete.day} - {itemToDelete.opens} to {itemToDelete.closes}</p>
                )}
            </Dialog>

            {/* Edit Opening Hours Dialog */}
            <Dialog
                header="Edit Opening Hours"
                visible={editOpeningHourDialog}
                style={{ width: '500px' }}
                onHide={() => setEditOpeningHourDialog(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-primary"
                            outlined
                            onClick={() => setEditOpeningHourDialog(false)}
                        />
                        <Button
                            label="Save"
                            className="p-button-primary"
                            onClick={() => {
                                if (editingOpeningHour) {
                                    setOpeningHours(prev =>
                                        prev.map(hour =>
                                            hour === editingOpeningHour ? editingOpeningHour : hour
                                        )
                                    );
                                    setEditOpeningHourDialog(false);
                                    setEditingOpeningHour(null);
                                    setToast({
                                        severity: 'success',
                                        summary: 'Success',
                                        detail: 'Opening hours have been updated successfully.',
                                        life: 3000
                                    });
                                }
                            }}
                        />
                    </div>
                }
            >
                {editingOpeningHour && (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="field">
                                <label htmlFor="editDay" className="block mb-2">Day</label>
                                <Dropdown
                                    id="editDay"
                                    value={editingOpeningHour.day}
                                    onChange={(e) => setEditingOpeningHour({ ...editingOpeningHour, day: e.value })}
                                    options={daysOfWeek.map(d => ({ label: d, value: d }))}
                                    className="w-full"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="editStatus" className="block mb-2">Status</label>
                                <Dropdown
                                    id="editStatus"
                                    value={editingOpeningHour.status}
                                    onChange={(e) => setEditingOpeningHour({ ...editingOpeningHour, status: e.value })}
                                    options={statusOptions}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="field">
                                <label htmlFor="editOpens" className="block mb-2">Opening Time</label>
                                <Dropdown
                                    id="editOpens"
                                    value={editingOpeningHour.opens}
                                    onChange={(e) => {
                                        setEditingOpeningHour({ ...editingOpeningHour, opens: e.value });
                                    }}
                                    options={generateTimeOptions()}
                                    className="w-full"
                                    placeholder="Select opening time"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="editCloses" className="block mb-2">Closing Time</label>
                                <Dropdown
                                    id="editCloses"
                                    value={editingOpeningHour.closes}
                                    onChange={(e) => {
                                        setEditingOpeningHour({ ...editingOpeningHour, closes: e.value });
                                    }}
                                    options={generateTimeOptions()}
                                    className="w-full"
                                    placeholder="Select closing time"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* Delivery Hours Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h5 className="website-title">Delivery hours</h5>
                        <span id="delivery-hours-info" className="cursor-pointer">
                            <Info className="h-5 w-5 text-gray-500" />
                        </span>
                    </div>
                    <Button
                        label="Add Delivery Slot"
                        icon="pi pi-plus"
                        className="p-button-primary"
                        onClick={() => setShowDeliverySlotDialog(true)}
                    />
                </div>
                <Tooltip target="#delivery-hours-info" content="Specify the time slots during which deliveries are available. Ensure they align with your operational capabilities." />

                <DataTable
                    value={filteredDeliverySlots}
                    className="p-datatable-sm"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} delivery slots"
                    emptyMessage="No delivery slots found."
                >
                    <Column
                        field="region"
                        header="Regions"
                        sortable
                        filter
                        filterPlaceholder="Filter by region"
                        filterMatchMode="equals"
                        filterElement={
                            <Dropdown
                                value={selectedDeliveryRegion}
                                onChange={(e) => setSelectedDeliveryRegion(e.value)}
                                options={regionOptions}
                                className="w-full"
                                placeholder="Select region"
                            />
                        }
                    />
                    <Column
                        field="interval"
                        header="Delivery slot interval"
                        sortable
                        filter
                        filterPlaceholder="Search intervals..."
                        filterMatchMode="contains"
                    />
                    <Column
                        field="status"
                        header="Status"
                        body={statusTemplate}
                        sortable
                        filter
                        filterPlaceholder="Filter by status"
                        filterMatchMode="equals"
                        filterElement={
                            <Dropdown
                                value={selectedDeliveryStatus}
                                onChange={(e) => setSelectedDeliveryStatus(e.value)}
                                options={deliveryStatusOptions}
                                className="w-full"
                                placeholder="Select status"
                            />
                        }
                    />
                    <Column field="capacity" header="Max delivery capacity" sortable />
                    <Column field="marketplace" header="Offer marketplace" body={rowData => booleanTemplate(rowData.marketplace)} sortable />
                    <Column field="subscription" header="Offer Subscription" body={rowData => booleanTemplate(rowData.subscription)} sortable />
                    <Column body={editTemplate} header="Actions" style={{ width: '100px' }} />
                </DataTable>

                {/* Add Delivery Slot Dialog */}
                <Dialog
                    header="Add Delivery Slot"
                    visible={showDeliverySlotDialog}
                    style={{ width: '600px' }}
                    footer={deliverySlotDialogFooter}
                    onHide={() => setShowDeliverySlotDialog(false)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Region Dropdown */}
                        <div className="field">
                            <label htmlFor="newRegion" className="block mb-2">Region</label>
                            <Dropdown
                                id="newRegion"
                                value={newDeliverySlot.region}
                                onChange={(e) =>
                                    setNewDeliverySlot((prev: any) => ({ ...prev, region: e.value }))
                                }
                                options={regionOptions}
                                className="w-full"
                                placeholder="Select Region"
                            />
                        </div>

                        {/* Delivery Slot Interval */}
                        <div className="field">
                            <label htmlFor="newInterval" className="block mb-2">Delivery Slot Interval</label>
                            <InputText
                                id="newInterval"
                                type="time"
                                value={newDeliverySlot.interval.length === 8 ? newDeliverySlot.interval.slice(0, 5) : newDeliverySlot.interval}
                                onChange={(e) =>
                                    setNewDeliverySlot((prev: any) => ({ ...prev, interval: e.target.value.length === 5 ? e.target.value + ':00' : e.target.value }))
                                }
                                className="w-full"
                            />
                        </div>

                        {/* Status Dropdown */}
                        <div className="field">
                            <label htmlFor="newStatus" className="block mb-2">Status</label>
                            <Dropdown
                                id="newStatus"
                                value={newDeliverySlot.status}
                                onChange={(e) =>
                                    setNewDeliverySlot((prev: any) => ({ ...prev, status: e.value }))
                                }
                                options={deliveryStatusOptions}
                                className="w-full"
                                placeholder="Select Status"
                            />
                        </div>

                        {/* Max Delivery Capacity */}
                        <div className="field">
                            <label htmlFor="newCapacity" className="block mb-2">Max Delivery Capacity</label>
                            <InputText
                                id="newCapacity"
                                value={newDeliverySlot.capacity}
                                onChange={(e) =>
                                    setNewDeliverySlot((prev: any) => ({ ...prev, capacity: e.target.value }))
                                }
                                className="w-full"
                                type="number"
                                placeholder="Enter capacity"
                            />
                        </div>

                        {/* Offer Marketplace */}
                        <div className="field">
                            <label htmlFor="newMarketplace" className="block mb-2">Offer Marketplace</label>
                            <Dropdown
                                id="newMarketplace"
                                value={newDeliverySlot.marketplace}
                                onChange={(e) =>
                                    setNewDeliverySlot((prev: any) => ({ ...prev, marketplace: e.value }))
                                }
                                options={marketplaceOptions}
                                className="w-full"
                                placeholder="Select Option"
                            />
                        </div>

                        {/* Offer Subscription */}
                        <div className="field">
                            <label htmlFor="newSubscription" className="block mb-2">Offer Subscription</label>
                            <Dropdown
                                id="newSubscription"
                                value={newDeliverySlot.subscription}
                                onChange={(e) =>
                                    setNewDeliverySlot((prev: any) => ({ ...prev, subscription: e.value }))
                                }
                                options={subscriptionOptions}
                                className="w-full"
                                placeholder="Select Option"
                            />
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    header="Edit Delivery Hour"
                    visible={editDialogVisible}
                    style={{ width: '600px' }}
                    onHide={() => setEditDialogVisible(false)}
                >
                    {editedDeliverySlot && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Region Dropdown */}
                            <div className="field">
                                <label htmlFor="region" className="block mb-2">Region</label>
                                <Dropdown
                                    id="region"
                                    value={editedDeliverySlot.region}
                                    onChange={(e) =>
                                        setEditedDeliverySlot((prev: any) => ({ ...prev, region: e.value }))
                                    }
                                    options={regionOptions}
                                    className="w-full"
                                    placeholder="Select Region"
                                />
                            </div>

                            {/* Delivery Slot Interval */}
                            <div className="field">
                                <label htmlFor="interval" className="block mb-2">Delivery Slot Interval</label>
                                <InputText
                                    id="interval"
                                    type="time"
                                    value={editedDeliverySlot.interval.length === 8 ? editedDeliverySlot.interval.slice(0, 5) : editedDeliverySlot.interval}
                                    onChange={(e) =>
                                        setEditedDeliverySlot((prev: any) => ({ ...prev, interval: e.target.value.length === 5 ? e.target.value + ':00' : e.target.value }))
                                    }
                                    className="w-full"
                                />
                            </div>

                            {/* Status Dropdown */}
                            <div className="field">
                                <label htmlFor="status" className="block mb-2">Status</label>
                                <Dropdown
                                    id="status"
                                    value={editedDeliverySlot.status}
                                    onChange={(e) =>
                                        setEditedDeliverySlot((prev: any) => ({ ...prev, status: e.value }))
                                    }
                                    options={deliveryStatusOptions}
                                    className="w-full"
                                    placeholder="Select Status"
                                />
                            </div>

                            {/* Max Delivery Capacity */}
                            <div className="field">
                                <label htmlFor="capacity" className="block mb-2">Max Delivery Capacity</label>
                                <InputText
                                    id="capacity"
                                    value={editedDeliverySlot.capacity}
                                    onChange={(e) =>
                                        setEditedDeliverySlot((prev: any) => ({ ...prev, capacity: e.target.value }))
                                    }
                                    className="w-full"
                                />
                            </div>

                            {/* Offer Marketplace */}
                            <div className="field">
                                <label htmlFor="marketplace" className="block mb-2">Offer Marketplace</label>
                                <Dropdown
                                    id="marketplace"
                                    value={editedDeliverySlot.marketplace}
                                    onChange={(e) =>
                                        setEditedDeliverySlot((prev: any) => ({ ...prev, marketplace: e.value }))
                                    }
                                    options={marketplaceOptions}
                                    className="w-full"
                                    placeholder="Select Option"
                                />
                            </div>

                            {/* Offer Subscription */}
                            <div className="field">
                                <label htmlFor="subscription" className="block mb-2">Offer Subscription</label>
                                <Dropdown
                                    id="subscription"
                                    value={editedDeliverySlot.subscription}
                                    onChange={(e) =>
                                        setEditedDeliverySlot((prev: any) => ({ ...prev, subscription: e.value }))
                                    }
                                    options={subscriptionOptions}
                                    className="w-full"
                                    placeholder="Select Option"
                                />
                            </div>

                            {/* Full Width for Buttons */}
                            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                                <Button
                                    label="Cancel"
                                    className="p-button-primary"
                                    outlined
                                    onClick={() => setEditDialogVisible(false)}
                                />
                                <Button
                                    label="Save"
                                    className="p-button-primary"
                                    onClick={() => {
                                        setDeliverySlots((prev) => {
                                            const idx = prev.findIndex(slot => slot === selectedDeliverySlot);
                                            if (idx !== -1) {
                                                const updated = [...prev];
                                                updated[idx] = { ...editedDeliverySlot };
                                                return updated;
                                            }
                                            return prev;
                                        });
                                        setEditDialogVisible(false);
                                        setToast({
                                            severity: 'success',
                                            summary: 'Success',
                                            detail: 'Delivery slot has been updated successfully.',
                                            life: 3000
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </Dialog>

                {/* Delete Delivery Slot Confirmation Dialog */}
                <Dialog
                    header="Confirm Delete Delivery Slot"
                    visible={deleteDeliverySlotDialog}
                    style={{ width: '400px' }}
                    onHide={() => setDeleteDeliverySlotDialog(false)}
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button
                                label="Cancel"
                                className="p-button-primary"
                                outlined
                                onClick={() => setDeleteDeliverySlotDialog(false)}
                            />
                            <Button
                                label="Delete"
                                className="p-button-danger"
                                onClick={confirmDeleteDeliverySlot}
                            />
                        </div>
                    }
                >
                    <p>Are you sure you want to delete this delivery slot?</p>
                    {itemToDelete && (
                        <p className="font-semibold mt-2">{itemToDelete.region} - {itemToDelete.interval}</p>
                    )}
                </Dialog>

            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex !space-x-3">
                <Button label="Cancel" className="btn btn-outline" onClick={() => navigate('/settings/website')} outlined />
                <Button label="Next" className="btn btn-primary" onClick={() => navigate('/settings/financial')} />
            </div>

            <Toast ref={toast} />
        </div>
    );
}