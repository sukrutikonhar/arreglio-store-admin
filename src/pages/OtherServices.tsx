import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import {
    ShoppingCart,
    Truck,
    Shield,
    BarChart3,
    Users,
    Globe,
    Zap,
    Target,
    Award,
    Clock,
    CheckCircle,
    Star,
} from 'lucide-react';

interface Service {
    id: number;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: 'ecommerce' | 'logistics' | 'analytics' | 'security' | 'consulting' | 'integration';
    features: string[];
    pricing: {
        basic: number;
        pro: number;
        enterprise: string;
    };
    status: 'available' | 'coming-soon' | 'beta';
    popular?: boolean;
}

const OtherServices: React.FC = () => {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showServiceDialog, setShowServiceDialog] = useState(false);
    const [toast, setToast] = useState<any>(null);

    const services: Service[] = [
        {
            id: 1,
            name: 'Multi-Channel Inventory Management',
            description: 'Synchronize inventory across multiple sales channels including Amazon, eBay, Shopify, and more.',
            icon: <ShoppingCart className="w-8 h-8 text-blue-500" />,
            category: 'ecommerce',
            features: [
                'Real-time inventory synchronization',
                'Automated stock level alerts',
                'Multi-warehouse support',
                'Bulk inventory updates',
                'Channel-specific pricing'
            ],
            pricing: {
                basic: 49,
                pro: 99,
                enterprise: 'Custom'
            },
            status: 'available',
            popular: true
        },
        {
            id: 2,
            name: 'Advanced Shipping & Logistics',
            description: 'Optimize shipping routes, track packages, and manage delivery operations efficiently.',
            icon: <Truck className="w-8 h-8 text-green-500" />,
            category: 'logistics',
            features: [
                'Route optimization',
                'Real-time tracking',
                'Delivery scheduling',
                'Carrier integration',
                'Shipping cost optimization'
            ],
            pricing: {
                basic: 79,
                pro: 149,
                enterprise: 'Custom'
            },
            status: 'available'
        },
        {
            id: 3,
            name: 'Business Intelligence & Analytics',
            description: 'Advanced analytics and reporting to help you make data-driven business decisions.',
            icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
            category: 'analytics',
            features: [
                'Custom dashboards',
                'Real-time reporting',
                'Predictive analytics',
                'Performance metrics',
                'Export capabilities'
            ],
            pricing: {
                basic: 99,
                pro: 199,
                enterprise: 'Custom'
            },
            status: 'available'
        },
        {
            id: 4,
            name: 'Enterprise Security Suite',
            description: 'Comprehensive security solutions to protect your business data and customer information.',
            icon: <Shield className="w-8 h-8 text-red-500" />,
            category: 'security',
            features: [
                'Advanced threat protection',
                'Data encryption',
                'Compliance monitoring',
                'Access control',
                'Security audits'
            ],
            pricing: {
                basic: 199,
                pro: 399,
                enterprise: 'Custom'
            },
            status: 'available'
        },
        {
            id: 5,
            name: 'Customer Relationship Management',
            description: 'Build stronger relationships with your customers through personalized experiences.',
            icon: <Users className="w-8 h-8 text-orange-500" />,
            category: 'ecommerce',
            features: [
                'Customer segmentation',
                'Automated marketing',
                'Loyalty programs',
                'Customer support tools',
                'Feedback management'
            ],
            pricing: {
                basic: 69,
                pro: 129,
                enterprise: 'Custom'
            },
            status: 'available'
        },
        {
            id: 6,
            name: 'Global Expansion Platform',
            description: 'Expand your business globally with multi-language and multi-currency support.',
            icon: <Globe className="w-8 h-8 text-indigo-500" />,
            category: 'ecommerce',
            features: [
                'Multi-language support',
                'Currency conversion',
                'Local payment methods',
                'Regional compliance',
                'International shipping'
            ],
            pricing: {
                basic: 149,
                pro: 299,
                enterprise: 'Custom'
            },
            status: 'coming-soon'
        },
        {
            id: 7,
            name: 'AI-Powered Automation',
            description: 'Leverage artificial intelligence to automate repetitive tasks and optimize operations.',
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            category: 'integration',
            features: [
                'Smart order processing',
                'Automated customer service',
                'Predictive inventory',
                'Dynamic pricing',
                'Fraud detection'
            ],
            pricing: {
                basic: 199,
                pro: 399,
                enterprise: 'Custom'
            },
            status: 'beta'
        },
        {
            id: 8,
            name: 'Strategic Consulting',
            description: 'Expert consulting services to help you optimize your e-commerce strategy and operations.',
            icon: <Target className="w-8 h-8 text-teal-500" />,
            category: 'consulting',
            features: [
                'Strategy development',
                'Performance optimization',
                'Technology assessment',
                'Process improvement',
                'Training & support'
            ],
            pricing: {
                basic: 299,
                pro: 599,
                enterprise: 'Custom'
            },
            status: 'available'
        }
    ];

    const categories = [
        { key: 'all', label: 'All Services', icon: <Award className="w-4 h-4" /> },
        { key: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4" /> },
        { key: 'logistics', label: 'Logistics', icon: <Truck className="w-4 h-4" /> },
        { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { key: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
        { key: 'consulting', label: 'Consulting', icon: <Target className="w-4 h-4" /> },
        { key: 'integration', label: 'Integration', icon: <Zap className="w-4 h-4" /> }
    ];

    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredServices = selectedCategory === 'all'
        ? services
        : services.filter(service => service.category === selectedCategory);

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'available': return 'success';
            case 'coming-soon': return 'warning';
            case 'beta': return 'info';
            default: return 'info';
        }
    };

    const handleServiceClick = (service: Service) => {
        setSelectedService(service);
        setShowServiceDialog(true);
    };

    const handleRequestDemo = (service: Service) => {
        setToast({
            severity: 'success',
            summary: 'Demo Requested',
            detail: `Demo request for ${service.name} has been submitted. We'll contact you within 24 hours.`,
            life: 5000
        });
        setShowServiceDialog(false);
    };

    return (
        <div className="p-6">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Additional Services</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover our comprehensive suite of services designed to enhance your e-commerce
                    operations and drive business growth.
                </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => (
                        <Button
                            key={category.key}
                            label={category.label}
                            icon={category.icon}
                            className={`p-button-outlined ${selectedCategory === category.key ? 'p-button-primary' : ''
                                }`}
                            onClick={() => setSelectedCategory(category.key)}
                        />
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredServices.map((service) => (
                    <Card key={service.id} className="h-full hover:shadow-lg transition-shadow">
                        <div className="relative">
                            {service.popular && (
                                <Badge value="Popular" severity="success" className="absolute top-2 right-2" />
                            )}
                            <div className="text-center mb-4">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>

                            <div className="mb-4">
                                <Badge value={service.status} severity={getStatusSeverity(service.status)} />
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                                <ul className="space-y-1">
                                    {service.features.slice(0, 3).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Starting at:</h4>
                                <div className="text-2xl font-bold text-blue-600">
                                    ${service.pricing.basic}/month
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    label="Learn More"
                                    icon="pi pi-info-circle"
                                    className="p-button-outlined flex-1"
                                    onClick={() => handleServiceClick(service)}
                                />
                                <Button
                                    label="Demo"
                                    icon="pi pi-play"
                                    className="flex-1"
                                    onClick={() => handleServiceClick(service)}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Need Custom Solutions?</h2>
                <p className="text-white opacity-90 mb-6 max-w-2xl mx-auto">
                    Our team of experts can create custom solutions tailored to your specific business needs.
                    Let's discuss how we can help you achieve your goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        label="Schedule Consultation"
                        icon="pi pi-calendar"
                        className="p-button-lg"
                    />
                    <Button
                        label="Contact Sales"
                        icon="pi pi-phone"
                        className="p-button-outlined p-button-lg"
                    />
                </div>
            </div>

            {/* Service Details Dialog */}
            <Dialog
                header={selectedService ? selectedService.name : 'Service Details'}
                visible={showServiceDialog}
                onHide={() => setShowServiceDialog(false)}
                style={{ width: '700px' }}
                modal
            >
                {selectedService && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mb-4">{selectedService.icon}</div>
                            <p className="text-gray-600">{selectedService.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                                <ul className="space-y-2">
                                    {selectedService.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Pricing Plans</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Basic</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            ${selectedService.pricing.basic}/month
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Pro</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            ${selectedService.pricing.pro}/month
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Enterprise</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {selectedService.pricing.enterprise}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" />
                                <span className="text-sm text-blue-700">
                                    {selectedService.status === 'available' ? 'Available Now' :
                                        selectedService.status === 'coming-soon' ? 'Coming Soon' : 'Beta Version'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-gray-600">4.8/5 Rating</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                label="Cancel"
                                className="p-button-text"
                                onClick={() => setShowServiceDialog(false)}
                            />
                            <Button
                                label="Request Demo"
                                icon="pi pi-play"
                                onClick={() => handleRequestDemo(selectedService)}
                            />
                        </div>
                    </div>
                )}
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
};

export default OtherServices; 