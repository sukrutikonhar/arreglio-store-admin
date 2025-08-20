import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useTeamContext } from '../context/TeamContext';
import { useServiceContext } from '../context/ServiceContext';
import {
    ArrowLeft, User, Building, Tag, Calendar, FileText, Plus, XCircle,
    Paperclip, AlertCircle, Bolt, CheckCircle
} from 'lucide-react';

const statuses = [
    { key: 'drop_by_customer', label: 'Drop by customer', color: 'bg-[#5CABE080]', topBarColor: '#5CABE0' },
    { key: 'received', label: 'Received', color: 'bg-[#A468BC80]', topBarColor: '#A468BC' },
    { key: 'work_in_progress', label: 'Work in Progress', color: 'bg-[#F4D03F80]', topBarColor: '#F4D03F' },
    { key: 'waiting_customer_reply', label: 'Waiting for Customer Reply', color: 'bg-[#E37C2180]', topBarColor: '#E37C21' },
    { key: 'waiting_for_parts', label: 'Waiting for Parts', color: 'bg-[#D8181880]', topBarColor: '#D81818' },
    { key: 'pickup_by_customer', label: 'Pickup by Customer', color: 'bg-[#58D68D]', topBarColor: '#58D68D' },
];

const priorities = [
    { key: 'low', label: 'Low', color: 'text-blue-500', icon: <AlertCircle className="w-4 h-4 text-blue-500" /> },
    { key: 'normal', label: 'Normal', color: 'text-green-500', icon: <AlertCircle className="w-4 h-4 text-green-500" /> },
    { key: 'high', label: 'High', color: 'text-orange-500', icon: <AlertCircle className="w-4 h-4 text-orange-500" /> },
    { key: 'urgent', label: 'Urgent', color: 'text-red-500', icon: <Bolt className="w-4 h-4 text-red-500" /> },
];



interface NewOrder {
    customerType: 'individual' | 'organization';
    // Individual fields
    firstName?: string;
    lastName?: string;
    // Organization fields
    organizationName?: string;
    contactPerson?: string;
    // Common fields
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    // Order details
    description: string;
    assignedTo: any;
    pickupDate: any;
    status: string;
    priority: string;
    selectedServices: any[];
    estimatedCost: string;
    files: File[];
}

export default function CreateOrder() {
    const { teamMembers } = useTeamContext();
    const { services } = useServiceContext();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const [newOrder, setNewOrder] = useState<NewOrder>({
        customerType: 'individual',
        firstName: '',
        lastName: '',
        organizationName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        description: '',
        assignedTo: null,
        pickupDate: null,
        status: 'drop_by_customer',
        priority: 'normal',
        selectedServices: [],
        estimatedCost: '',
        files: []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    // Service selection state
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showServices, setShowServices] = useState(false);

    // Get unique categories from services
    const getCategories = () => {
        const categories = [...new Set(services.map(service => service.category))];
        return categories.map(category => ({
            name: category,
            serviceCount: services.filter(service => service.category === category).length,
            services: services.filter(service => service.category === category)
        }));
    };

    // Get services for selected category
    const getServicesForCategory = (category: string) => {
        return services.filter(service => service.category === category);
    };



    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Customer type specific validation
        if (newOrder.customerType === 'individual') {
            if (!newOrder.firstName?.trim()) newErrors.firstName = 'First name is required';
            if (!newOrder.lastName?.trim()) newErrors.lastName = 'Last name is required';
        } else {
            if (!newOrder.organizationName?.trim()) newErrors.organizationName = 'Organization name is required';
            if (!newOrder.contactPerson?.trim()) newErrors.contactPerson = 'Contact person is required';
        }

        // Common validation
        if (!newOrder.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newOrder.email)) newErrors.email = 'Invalid email format';

        if (!newOrder.phone.trim()) newErrors.phone = 'Phone is required';
        if (!newOrder.address.trim()) newErrors.address = 'Address is required';
        if (!newOrder.city.trim()) newErrors.city = 'City is required';
        if (!newOrder.state.trim()) newErrors.state = 'State is required';
        if (!newOrder.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

        if (!newOrder.description.trim()) newErrors.description = 'Description is required';
        if (!newOrder.assignedTo) newErrors.assignedTo = 'Please assign the order to someone';
        if (newOrder.selectedServices.length === 0) newErrors.selectedServices = 'Please select at least one service';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setShowServices(true);
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
        setShowServices(false);
    };

    const handleServiceToggle = (service: any) => {
        setNewOrder(prev => {
            const isSelected = prev.selectedServices.some(s => s.id === service.id);
            if (isSelected) {
                return {
                    ...prev,
                    selectedServices: prev.selectedServices.filter(s => s.id !== service.id)
                };
            } else {
                return {
                    ...prev,
                    selectedServices: [...prev.selectedServices, service]
                };
            }
        });
    };

    const calculateTotalCost = () => {
        const servicesCost = newOrder.selectedServices.reduce((total, service) => total + service.price, 0);
        const additionalCost = parseFloat(newOrder.estimatedCost) || 0;
        return servicesCost + additionalCost;
    };

    const handleFileUpload = (event: any) => {
        const files = Array.from(event.files) as File[];
        setNewOrder(prev => ({
            ...prev,
            files: [...prev.files, ...files]
        }));
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setNewOrder(prev => ({
            ...prev,
            files: prev.files.filter(file => file !== fileToRemove)
        }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields',
                life: 3000
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate a realistic order number (starting from 1000 for better readability)
            const baseOrderNumber = 1000;
            const timestamp = Date.now();
            const orderNumber = baseOrderNumber + Math.floor((timestamp % 900000) / 1000); // Creates numbers like 1001, 1002, etc.

            // Create the order data
            const orderData = {
                id: orderNumber,
                orderNumber: `ORD-${orderNumber}`, // Add a formatted order number
                status: newOrder.status,
                priority: newOrder.priority,
                assigned: true,
                assignedUser: newOrder.assignedTo,
                comments: 0,
                attachments: newOrder.files.length,
                description: newOrder.description,
                date: newOrder.pickupDate ? newOrder.pickupDate.format('YYYY-MM-DD HH:mm') : 'TBD',
                customerName: newOrder.customerType === 'individual'
                    ? `${newOrder.firstName} ${newOrder.lastName}`
                    : newOrder.organizationName,
                customerEmail: newOrder.email,
                customerPhone: newOrder.phone,
                estimatedCost: calculateTotalCost().toString(),
                selectedServices: newOrder.selectedServices,
                customerType: newOrder.customerType,
                address: newOrder.address,
                city: newOrder.city,
                state: newOrder.state,
                zipCode: newOrder.zipCode
            };

            // Store in localStorage to pass to Overview page
            localStorage.setItem('newOrder', JSON.stringify(orderData));

            toast.current?.show({
                severity: 'success',
                summary: 'Order Created',
                detail: 'Order has been created successfully!',
                life: 5000
            });

            // Redirect back to Overview after a short delay
            setTimeout(() => {
                navigate('/overview');
            }, 2000);

        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create order. Please try again.',
                life: 5000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex flex-col space-y-4">
            {[
                { step: 1, title: 'Customer Information', icon: <User className="w-5 h-5" /> },
                { step: 2, title: 'Services Selection', icon: <Tag className="w-5 h-5" /> },
                { step: 3, title: 'Order Details', icon: <FileText className="w-5 h-5" /> },
                { step: 4, title: 'Assignment & Scheduling', icon: <Calendar className="w-5 h-5" /> }
            ].map(({ step, title, icon }) => (
                <div key={step} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${step < currentStep
                        ? 'bg-secondary text-white'
                        : step === currentStep
                            ? 'bg-secondary text-white ring-4 ring-secondary/20'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                        {step < currentStep ? <CheckCircle className="w-5 h-5" /> : icon}
                    </div>
                    <div className={`flex-1 ${step <= currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
                        <div className="font-medium">{title}</div>
                        {step === currentStep && (
                            <div className="text-sm text-secondary">Current Step</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderCustomerInfo = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Information</h2>
                <p className="text-gray-600">Tell us about the customer for this order</p>
            </div>

            {/* Customer Type Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Type</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setNewOrder(prev => ({ ...prev, customerType: 'individual' }))}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${newOrder.customerType === 'individual'
                            ? 'border-secondary bg-secondary/5'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${newOrder.customerType === 'individual' ? 'bg-secondary' : 'bg-gray-200'
                                }`}>
                                <User className={`w-5 h-5 ${newOrder.customerType === 'individual' ? 'text-white' : 'text-gray-500'
                                    }`} />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-800">Individual</div>
                                <div className="text-sm text-gray-500">Personal customer</div>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setNewOrder(prev => ({ ...prev, customerType: 'organization' }))}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${newOrder.customerType === 'organization'
                            ? 'border-secondary bg-secondary/5'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${newOrder.customerType === 'organization' ? 'bg-secondary' : 'bg-gray-200'
                                }`}>
                                <Building className={`w-5 h-5 ${newOrder.customerType === 'organization' ? 'text-white' : 'text-gray-500'
                                    }`} />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-800">Organization</div>
                                <div className="text-sm text-gray-500">Business customer</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Dynamic Customer Fields */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h3>

                {newOrder.customerType === 'individual' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                value={newOrder.firstName || ''}
                                onChange={(e) => setNewOrder(prev => ({ ...prev, firstName: e.target.value }))}
                                placeholder="Enter first name"
                                className={`w-full ${errors.firstName ? 'p-invalid' : ''}`}
                            />
                            {errors.firstName && <small className="p-error">{errors.firstName}</small>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                value={newOrder.lastName || ''}
                                onChange={(e) => setNewOrder(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Enter last name"
                                className={`w-full ${errors.lastName ? 'p-invalid' : ''}`}
                            />
                            {errors.lastName && <small className="p-error">{errors.lastName}</small>}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Organization Name <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                value={newOrder.organizationName || ''}
                                onChange={(e) => setNewOrder(prev => ({ ...prev, organizationName: e.target.value }))}
                                placeholder="Enter organization name"
                                className={`w-full ${errors.organizationName ? 'p-invalid' : ''}`}
                            />
                            {errors.organizationName && <small className="p-error">{errors.organizationName}</small>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Person <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                value={newOrder.contactPerson || ''}
                                onChange={(e) => setNewOrder(prev => ({ ...prev, contactPerson: e.target.value }))}
                                placeholder="Enter contact person name"
                                className={`w-full ${errors.contactPerson ? 'p-invalid' : ''}`}
                            />
                            {errors.contactPerson && <small className="p-error">{errors.contactPerson}</small>}
                        </div>
                    </div>
                )}

                {/* Common Contact Fields */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={newOrder.email}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email address"
                            className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                        />
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={newOrder.phone}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter phone number"
                            className={`w-full ${errors.phone ? 'p-invalid' : ''}`}
                        />
                        {errors.phone && <small className="p-error">{errors.phone}</small>}
                    </div>
                </div>

                {/* Address Fields */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        value={newOrder.address}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter street address"
                        className={`w-full ${errors.address ? 'p-invalid' : ''}`}
                    />
                    {errors.address && <small className="p-error">{errors.address}</small>}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={newOrder.city}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Enter city"
                            className={`w-full ${errors.city ? 'p-invalid' : ''}`}
                        />
                        {errors.city && <small className="p-error">{errors.city}</small>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={newOrder.state}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="Enter state"
                            className={`w-full ${errors.state ? 'p-invalid' : ''}`}
                        />
                        {errors.state && <small className="p-error">{errors.state}</small>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={newOrder.zipCode}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, zipCode: e.target.value }))}
                            placeholder="Enter ZIP code"
                            className={`w-full ${errors.zipCode ? 'p-invalid' : ''}`}
                        />
                        {errors.zipCode && <small className="p-error">{errors.zipCode}</small>}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderServicesSelection = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Services Selection</h2>
                <p className="text-gray-600">
                    {!showServices
                        ? "First, choose a service category to explore available services"
                        : `Select services from ${selectedCategory} category`
                    }
                </p>
            </div>

            {/* Error Message */}
            {errors.selectedServices && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <small className="p-error">{errors.selectedServices}</small>
                </div>
            )}

            {/* Category Selection View */}
            {!showServices && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Service Categories</h3>
                        <span className="text-sm text-gray-500">{getCategories().length} categories available</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getCategories().map((category) => (
                            <div
                                key={category.name}
                                onClick={() => handleCategorySelect(category.name)}
                                className="p-4 rounded-lg border-2 border-gray-200 hover:border-secondary hover:bg-secondary/5 cursor-pointer transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                                        <Tag className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800 group-hover:text-secondary transition-colors">
                                            {category.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {category.serviceCount} service{category.serviceCount !== 1 ? 's' : ''} available
                                        </p>
                                    </div>
                                    <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:text-secondary transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Services Selection View */}
            {showServices && selectedCategory && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Button
                                icon={<ArrowLeft className="w-4 h-4" />}
                                label="Back to Categories"
                                className="p-button-text p-button-sm"
                                onClick={handleBackToCategories}
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{selectedCategory} Services</h3>
                                <p className="text-sm text-gray-500">
                                    {getServicesForCategory(selectedCategory).length} services available
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getServicesForCategory(selectedCategory).map((service) => {
                            const isSelected = newOrder.selectedServices.some(s => s.id === service.id);
                            return (
                                <div
                                    key={service.id}
                                    onClick={() => handleServiceToggle(service)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
                                        ? 'border-secondary bg-secondary/5 ring-2 ring-secondary/20'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-medium text-gray-800">{service.serviceName}</h4>
                                                {isSelected && (
                                                    <span className="px-2 py-1 bg-secondary text-white text-xs rounded-full">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.serviceDescription}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="text-lg font-semibold text-secondary">
                                                    ${service.price.toFixed(2)}
                                                </div>
                                                {service.vatRate > 0 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{service.vatRate}% VAT
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 ${isSelected
                                            ? 'border-secondary bg-secondary'
                                            : 'border-gray-300'
                                            }`}>
                                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Continue Browsing */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <Button
                            label="Browse Other Categories"
                            className="p-button-outlined p-button-sm"
                            onClick={handleBackToCategories}
                        />
                    </div>
                </div>
            )}

            {/* Selected Services Summary */}
            {newOrder.selectedServices.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Selected Services Summary</h4>
                    <div className="space-y-3">
                        {newOrder.selectedServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-800">{service.serviceName}</div>
                                    <div className="text-sm text-gray-500">{service.category}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-secondary">${service.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => handleServiceToggle(service)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="border-t pt-3 mt-3">
                            <div className="flex items-center justify-between font-semibold text-lg">
                                <span>Services Total:</span>
                                <span className="text-secondary">
                                    ${newOrder.selectedServices.reduce((total, service) => total + service.price, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Costs */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Costs</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Estimated Cost
                    </label>
                    <InputText
                        value={newOrder.estimatedCost}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, estimatedCost: e.target.value }))}
                        placeholder="Enter additional costs (optional)"
                        className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter any additional costs like parts, materials, etc.</p>
                </div>

                {newOrder.selectedServices.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>Total Estimated Cost:</span>
                            <span className="text-green-600">${calculateTotalCost().toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderOrderDetails = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Details</h2>
                <p className="text-gray-600">Provide specific details about the work to be done</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Description</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <InputTextarea
                        value={newOrder.description}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the work to be done, issues to be resolved, or specific requirements..."
                        rows={4}
                        className={`w-full ${errors.description ? 'p-invalid' : ''}`}
                    />
                    {errors.description && <small className="p-error">{errors.description}</small>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority & Status</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            value={newOrder.priority}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, priority: e.value }))}
                            options={priorities}
                            optionLabel="label"
                            optionValue="key"
                            placeholder="Select priority"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Status
                        </label>
                        <Dropdown
                            value={newOrder.status}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, status: e.value }))}
                            options={statuses}
                            optionLabel="label"
                            optionValue="key"
                            placeholder="Select status"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h3>
                <FileUpload
                    mode="basic"
                    name="files"
                    accept="*"
                    maxFileSize={10000000}
                    chooseLabel="Choose Files"
                    className="w-full"
                    onSelect={handleFileUpload}
                    multiple
                />
                {newOrder.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {newOrder.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{file.name}</span>
                                    <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveFile(file)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderAssignmentScheduling = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Assignment & Scheduling</h2>
                <p className="text-gray-600">Assign the order and set pickup/delivery schedule</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Assignment</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign To <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={newOrder.assignedTo}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, assignedTo: e.value }))}
                        options={teamMembers}
                        optionLabel="name"
                        placeholder="Select team member"
                        className={`w-full ${errors.assignedTo ? 'p-invalid' : ''}`}
                    />
                    {errors.assignedTo && <small className="p-error">{errors.assignedTo}</small>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Date & Time
                    </label>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        value={newOrder.pickupDate}
                        onChange={(date) => setNewOrder(prev => ({ ...prev, pickupDate: date }))}
                        className="w-full"
                        placeholder="Select date and time"
                        getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                    />
                    <p className="text-sm text-gray-500 mt-1">When should the customer drop off their item?</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">
                            {newOrder.customerType === 'individual'
                                ? `${newOrder.firstName} ${newOrder.lastName}`
                                : newOrder.organizationName
                            }
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Services:</span>
                        <span className="font-medium">{newOrder.selectedServices.length} selected</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className="font-medium capitalize">{newOrder.priority}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Assigned to:</span>
                        <span className="font-medium">{newOrder.assignedTo?.name || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="font-medium text-green-600">${calculateTotalCost()}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return renderCustomerInfo();
            case 2:
                return renderServicesSelection();
            case 3:
                return renderOrderDetails();
            case 4:
                return renderAssignmentScheduling();
            default:
                return renderCustomerInfo();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Toast ref={toast} />

            <div className="p-2 sm:p-4 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        icon={<ArrowLeft className="w-4 h-4" />}
                        label="Back to Overview"
                        className="p-button-text"
                        onClick={() => navigate('/overview')}
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-primary">
                            Create New Order
                        </h1>
                        <p className="text-primary mt-1">Fill out the form below to create a new order</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-8 max-w-7xl mx-auto">
                    {/* Left Sidebar - Step Indicator */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Progress</h3>
                            {renderStepIndicator()}
                        </div>
                    </div>

                    {/* Right Side - Step Content */}
                    <div className="flex-1">
                        {renderCurrentStep()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8">
                            <Button
                                label="Previous"
                                icon={<ArrowLeft className="w-4 h-4" />}
                                className="p-button-outlined"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                            />

                            <div className="flex gap-3">
                                {currentStep < totalSteps ? (
                                    <Button
                                        label="Next"
                                        icon={<Plus className="w-4 h-4" />}
                                        className="p-button-secondary"
                                        onClick={nextStep}
                                    />
                                ) : (
                                    <Button
                                        label={isSubmitting ? "Creating..." : "Create Order"}
                                        icon={<CheckCircle className="w-4 h-4" />}
                                        className="p-button-success"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        loading={isSubmitting}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
