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
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate } from 'react-router-dom';

export default function GeneralSettings() {
    const navigate = useNavigate();
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedOpeningHour, setSelectedOpeningHour] = useState<any>(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<any>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editedDeliverySlot, setEditedDeliverySlot] = useState<any>(null);
    const [openingHours, setOpeningHours] = useState([
        { day: 'Monday', opens: '11:30', closes: '21:30', status: 'Open' },
        { day: 'Tuesday', opens: '11:30', closes: '21:30', status: 'Open' },
        { day: 'Wednesday', opens: '11:30', closes: '21:30', status: 'Open' },
    ]);

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


    const handleDeleteClick = (rowData: any) => {
        setSelectedOpeningHour(rowData);
        setDeleteDialogVisible(true);
    };

    const confirmDelete = () => {
        setOpeningHours((prev) =>
            prev.filter((item) => item !== selectedOpeningHour)
        );
        setDeleteDialogVisible(false);
    };


    const cancelDelete = () => {
        setDeleteDialogVisible(false);
    };

    const handleEditClick = (rowData: any) => {
        setSelectedDeliverySlot(rowData);
        setEditedDeliverySlot({ ...rowData });
        setEditDialogVisible(true);
    };

    const deleteTemplate = (rowData: any) => (
        <TrashIcon
            className="h-5 w-5 text-red-500 cursor-pointer"
            onClick={() => handleDeleteClick(rowData)}
        />
    );

    const editTemplate = (rowData: any) => (
        <PencilIcon
            className="h-5 w-5 text-green-500 cursor-pointer"
            onClick={() => handleEditClick(rowData)}
        />
    );

    const booleanTemplate = (value: boolean) => value ? 'Yes' : 'No';

    const statusTemplate = (rowData: { status: string }) => (
        <Tag
            value={rowData.status}
            severity={rowData.status === 'Active' ? 'success' : 'danger'}
        />
    );


    return (
        <div className="">
            {/* <h2 className="text-2xl font-semibold mb-6">General Settings</h2> */}

            {/* Opening Hours Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <h5 className="website-title">Opening hours</h5>
                    <span id="opening-hours-info" className="cursor-pointer">
                        <Info className="h-5 w-5 text-gray-500" />
                    </span>
                </div>
                <Tooltip target="#opening-hours-info" content="Define the time slots when your store or service is open. Customers can only place orders during these hours." />
                <DataTable value={openingHours} className="p-datatable-sm mb-8">
                    <Column field="day" header="Day" />
                    <Column field="opens" header="Opens" />
                    <Column field="closes" header="Closes" />
                    <Column field="status" header="Status" />
                    <Column body={deleteTemplate} header="Delete" />
                </DataTable>
                <Button
                    label="Add Open Hours"
                    icon="pi pi-plus"
                    className="pt-6"
                    onClick={() => setShowCreateDialog(true)}
                />
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
                            <InputText
                                id="opens"
                                type="time"
                                value={newOpeningHours.opens}
                                onChange={e => {
                                    setNewOpeningHours({ ...newOpeningHours, opens: e.target.value });
                                    setOpenHoursErrors(prev => ({ ...prev, opens: false }));
                                }}
                                className="w-full"
                                invalid={openHoursErrors.opens}
                            />
                            {openHoursErrors.opens && <span className="text-xs text-red-500">Opening time is required</span>}
                        </div>
                        <div className="field">
                            <label htmlFor="closes" className="block mb-2">Closing Time</label>
                            <InputText
                                id="closes"
                                type="time"
                                value={newOpeningHours.closes}
                                onChange={e => {
                                    setNewOpeningHours({ ...newOpeningHours, closes: e.target.value });
                                    setOpenHoursErrors(prev => ({ ...prev, closes: false }));
                                }}
                                className="w-full"
                                invalid={openHoursErrors.closes}
                            />
                            {openHoursErrors.closes && <span className="text-xs text-red-500">Closing time is required</span>}
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog for Opening Hours */}
            <Dialog header="Confirm Delete" visible={deleteDialogVisible} style={{ width: '350px' }}
                onHide={cancelDelete}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button label="Cancel" className="p-button-primary" outlined onClick={cancelDelete} />
                        <Button label="Delete" className="p-button-danger" onClick={confirmDelete} />
                    </div>
                }>
                <p>Are you sure you want to delete this opening hour entry?</p>
            </Dialog>

            {/* Delivery Hours Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <h5 className="website-title">Delivery hours</h5>
                    <span id="delivery-hours-info" className="cursor-pointer">
                        <Info className="h-5 w-5 text-gray-500" />
                    </span>
                </div>
                <Tooltip target="#delivery-hours-info" content="Specify the time slots during which deliveries are available. Ensure they align with your operational capabilities." />
                <DataTable value={deliverySlots} className="p-datatable-sm">
                    <Column field="region" header="Regions" />
                    <Column field="interval" header="Delivery slot interval" />
                    <Column field="status" header="Status" body={statusTemplate} />
                    <Column field="capacity" header="Max delivery capacity" />
                    <Column field="marketplace" header="Offer marketplace" body={rowData => booleanTemplate(rowData.marketplace)} />
                    <Column field="subscription" header="Offer Subscription" body={rowData => booleanTemplate(rowData.subscription)} />
                    <Column body={editTemplate} header="Edit" />
                </DataTable>
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
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </Dialog>

            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex !space-x-3">
                <Button label="Cancel" className="btn btn-outline" onClick={() => navigate('/settings/website')} outlined />
                <Button label="Next" className="btn btn-primary" onClick={() => navigate('/settings/financial')} />
            </div>
        </div>
    );
}