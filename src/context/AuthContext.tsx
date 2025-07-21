import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (user: User & { password: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('authUser');
        if (stored) {
            setUser(JSON.parse(stored));
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email: string, password: string) => {
        // For demo: check localStorage for user
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find((u: any) => u.email === email && u.password === password);
        if (found) {
            setUser({ email: found.email, name: found.name });
            setIsAuthenticated(true);
            localStorage.setItem('authUser', JSON.stringify({ email: found.email, name: found.name }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authUser');
        window.location.href = '/auth/login';
    };

    const register = async (newUser: User & { password: string }) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find((u: any) => u.email === newUser.email)) {
            return false; // already exists
        }
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setUser({ email: newUser.email, name: newUser.name });
        setIsAuthenticated(true);
        localStorage.setItem('authUser', JSON.stringify({ email: newUser.email, name: newUser.name }));
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}; 