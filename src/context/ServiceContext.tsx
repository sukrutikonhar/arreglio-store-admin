import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Service {
    id: number;
    category: string;
    serviceName: string;
    serviceDescription: string;
    price: number;
    vatRate: number;
    deliveryPrice: number;
}

interface ServiceContextType {
    services: Service[];
    addService: (service: Omit<Service, 'id'>) => void;
    updateService: (id: number, service: Partial<Service>) => void;
    deleteService: (id: number) => void;
    getServices: () => Service[];
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error('useServiceContext must be used within a ServiceProvider');
    }
    return context;
};

interface ServiceProviderProps {
    children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
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

    const addService = (service: Omit<Service, 'id'>) => {
        const newService = {
            ...service,
            id: Math.max(...services.map(s => s.id), 0) + 1
        };
        setServices(prev => [...prev, newService]);
    };

    const updateService = (id: number, service: Partial<Service>) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, ...service } : s));
    };

    const deleteService = (id: number) => {
        setServices(prev => prev.filter(s => s.id !== id));
    };

    const getServices = () => services;

    const value: ServiceContextType = {
        services,
        addService,
        updateService,
        deleteService,
        getServices
    };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};
