import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    status: 'active' | 'inactive' | 'on_leave';
    avatar: string;
    joinDate: string;
    lastActive: string;
    assignedOrders: string[]; // Array of order IDs
}

export interface Order {
    id: string;
    customerName: string;
    status: string;
    assignedTo?: string; // Team member ID
    createdAt: string;
    total: number;
}

interface TeamContextType {
    teamMembers: TeamMember[];
    orders: Order[];
    addTeamMember: (member: Omit<TeamMember, 'id' | 'assignedOrders'>) => void;
    updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
    deleteTeamMember: (id: string) => void;
    assignOrderToMember: (orderId: string, memberId: string) => void;
    unassignOrderFromMember: (orderId: string) => void;
    getMemberById: (id: string) => TeamMember | undefined;
    getOrdersByMember: (memberId: string) => Order[];
    addOrder: (order: Omit<Order, 'id'>) => void;
    updateOrder: (id: string, updates: Partial<Order>) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeamContext = () => {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('useTeamContext must be used within a TeamProvider');
    }
    return context;
};

interface TeamProviderProps {
    children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            role: 'admin',
            department: 'it',
            status: 'active',
            avatar: '/images/avatar/user1.jpg',
            joinDate: '2024-01-15',
            lastActive: '2024-03-15 09:30',
            assignedOrders: ['17', '18']
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1 (555) 234-5678',
            role: 'manager',
            department: 'customer_service',
            status: 'active',
            avatar: '/images/avatar/user1.jpg',
            joinDate: '2024-02-01',
            lastActive: '2024-03-15 10:15',
            assignedOrders: ['19']
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            phone: '+1 (555) 345-6789',
            role: 'technician',
            department: 'it',
            status: 'active',
            avatar: '',
            joinDate: '2024-01-20',
            lastActive: '2024-03-15 08:45',
            assignedOrders: []
        },
        {
            id: '4',
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            phone: '+1 (555) 456-7890',
            role: 'support',
            department: 'customer_service',
            status: 'on_leave',
            avatar: '',
            joinDate: '2024-03-10',
            lastActive: '2024-03-10 16:20',
            assignedOrders: []
        },
        {
            id: '5',
            name: 'David Brown',
            email: 'david.brown@example.com',
            phone: '+1 (555) 567-8901',
            role: 'technician',
            department: 'operations',
            status: 'inactive',
            avatar: '',
            joinDate: '2024-01-05',
            lastActive: '2024-03-01 14:30',
            assignedOrders: []
        },
        {
            id: '6',
            name: 'Emma Davis',
            email: 'emma.davis@example.com',
            phone: '+1 (555) 678-9012',
            role: 'manager',
            department: 'marketing',
            status: 'active',
            avatar: '',
            joinDate: '2024-02-15',
            lastActive: '2024-03-15 11:00',
            assignedOrders: []
        }
    ]);

    const [orders, setOrders] = useState<Order[]>([
        {
            id: '17',
            customerName: 'John Smith',
            status: 'Work in Progress',
            assignedTo: '1',
            createdAt: '2024-03-13',
            total: 1700
        },
        {
            id: '18',
            customerName: 'Alice Johnson',
            status: 'Completed',
            assignedTo: '1',
            createdAt: '2024-03-12',
            total: 1200
        },
        {
            id: '19',
            customerName: 'Bob Wilson',
            status: 'On Hold',
            assignedTo: '2',
            createdAt: '2024-03-11',
            total: 800
        },
        {
            id: '20',
            customerName: 'Emma Davis',
            status: 'New',
            assignedTo: undefined,
            createdAt: '2024-03-15',
            total: 950
        }
    ]);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedTeamMembers = localStorage.getItem('teamMembers');
        const savedOrders = localStorage.getItem('orders');

        if (savedTeamMembers) {
            try {
                setTeamMembers(JSON.parse(savedTeamMembers));
            } catch (error) {
                console.error('Failed to parse team members from localStorage:', error);
            }
        }

        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (error) {
                console.error('Failed to parse orders from localStorage:', error);
            }
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    }, [teamMembers]);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const addTeamMember = (member: Omit<TeamMember, 'id' | 'assignedOrders'>) => {
        const newMember: TeamMember = {
            ...member,
            id: (teamMembers.length + 1).toString(),
            assignedOrders: []
        };
        setTeamMembers(prev => [...prev, newMember]);
    };

    const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
        setTeamMembers(prev => prev.map(member =>
            member.id === id ? { ...member, ...updates } : member
        ));
    };

    const deleteTeamMember = (id: string) => {
        // Unassign all orders from this member before deleting
        const member = teamMembers.find(m => m.id === id);
        if (member) {
            member.assignedOrders.forEach(orderId => {
                unassignOrderFromMember(orderId);
            });
        }
        setTeamMembers(prev => prev.filter(member => member.id !== id));
    };

    const assignOrderToMember = (orderId: string, memberId: string) => {
        // Unassign from current member if any
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, assignedTo: memberId } : order
        ));

        // Update team member's assigned orders
        setTeamMembers(prev => prev.map(member => {
            if (member.id === memberId) {
                return {
                    ...member,
                    assignedOrders: [...member.assignedOrders, orderId]
                };
            } else {
                return {
                    ...member,
                    assignedOrders: member.assignedOrders.filter(id => id !== orderId)
                };
            }
        }));
    };

    const unassignOrderFromMember = (orderId: string) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, assignedTo: undefined } : order
        ));

        setTeamMembers(prev => prev.map(member => ({
            ...member,
            assignedOrders: member.assignedOrders.filter(id => id !== orderId)
        })));
    };

    const getMemberById = (id: string) => {
        return teamMembers.find(member => member.id === id);
    };

    const getOrdersByMember = (memberId: string) => {
        return orders.filter(order => order.assignedTo === memberId);
    };

    const addOrder = (order: Omit<Order, 'id'>) => {
        const newOrder: Order = {
            ...order,
            id: (orders.length + 1).toString()
        };
        setOrders(prev => [...prev, newOrder]);
    };

    const updateOrder = (id: string, updates: Partial<Order>) => {
        setOrders(prev => prev.map(order =>
            order.id === id ? { ...order, ...updates } : order
        ));
    };

    const value: TeamContextType = {
        teamMembers,
        orders,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        assignOrderToMember,
        unassignOrderFromMember,
        getMemberById,
        getOrdersByMember,
        addOrder,
        updateOrder
    };

    return (
        <TeamContext.Provider value={value}>
            {children}
        </TeamContext.Provider>
    );
};
