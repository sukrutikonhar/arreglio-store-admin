import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, Search, Home, BarChart2, Wrench, ShoppingBag, X, User, LogOut, Settings } from "lucide-react";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Button } from "primereact/button";

import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import NotificationPanel from "./NotficationPanel";
import LanguagePanel from "./LanguagePanel";

type ActiveIconType = "notifications" | "language" | "user" | "settings" | "menu" | null;

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    lastLogin: Date;
}

const mockUser: User = {
    id: "1",
    name: "John Smith",
    email: "john.smith@arreglio.com",
    avatar: "/images/avatar/user1.jpg",
    role: "Administrator",
    lastLogin: new Date()
};

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [activeIcon, setActiveIcon] = useState<ActiveIconType>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showUserPanel, setShowUserPanel] = useState(false);
    const [showUserSettings, setShowUserSettings] = useState(false);
    const [user, setUser] = useState<User>(mockUser);
    const [toast, setToast] = useState<any>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const userPanelRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isOverviewActive = location.pathname === '/overview' || location.pathname.startsWith('/order/');

    const handleMenuClick = () => {
        setIsNavOpen(prev => !prev);
    };

    const handleSearchToggle = () => {
        setIsSearchOpen((prev) => !prev);
    };



    const handleUserClick = () => {
        setShowUserPanel(!showUserPanel);
        setActiveIcon(null);
    };

    const handleLogout = () => {
        setToast({
            severity: 'success',
            summary: 'Logged Out',
            detail: 'You have been successfully logged out.',
            life: 3000
        });

        // Simulate logout process
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const handleProfileClick = () => {
        setShowUserPanel(false);
        navigate('/profile');
    };

    const handleSettingsClick = () => {
        setShowUserPanel(false);
        setShowUserSettings(true);
    };

    // Close user panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userPanelRef.current && !userPanelRef.current.contains(event.target as Node)) {
                setShowUserPanel(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <header className="w-full sticky top-0 z-50">
            <div className="header-top flex items-center justify-between px-0 md:px-4 py-2">
                {/* Left section: menu icon always visible; search icon/input on larger screens */}
                <div className="flex items-center space-x-4">
                    <button onClick={handleMenuClick} className="header-icon">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="hidden md:block">
                        {isSearchOpen ? (
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none"
                                    onBlur={() => setIsSearchOpen(false)}
                                />
                            </div>
                        ) : (
                            <button onClick={handleSearchToggle} className="header-icon focus:outline-none">
                                <Search className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Center section: Logo visible only on larger screens */}
                <div className="hidden md:block flex-shrink-0">
                    <img src="/images/logos/logo.svg" alt="Arreglio Logo" className="h-8" />
                </div>

                {/* Right section: Always display language, notifications, settings, and user icons */}
                <div className="flex items-center space-x-2">
                    <LanguagePanel activeIcon={activeIcon} setActiveIcon={setActiveIcon} />

                    {/* Notification Panel */}
                    <NotificationPanel activeIcon={activeIcon} setActiveIcon={setActiveIcon} />

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            "header-icon" + (isActive ? " active" : "")
                        }
                    >
                        <Cog8ToothIcon className="w-6 h-6" />
                    </NavLink>

                    {/* User Panel */}
                    <div className="relative" ref={userPanelRef}>
                        <button
                            onClick={handleUserClick}
                            className="header-icon"
                        >
                            <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full"
                            />
                        </button>

                        {/* User Dropdown Panel */}
                        {showUserPanel && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                                {/* User Info */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={user.avatar}
                                            alt="User Avatar"
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            <p className="text-xs text-gray-400">{user.role}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Options */}
                                <div className="p-2">
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <User className="w-5 h-5 mr-3 text-gray-500" />
                                        <span className="text-gray-700">Profile</span>
                                    </button>

                                    <button
                                        onClick={handleSettingsClick}
                                        className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <Settings className="w-5 h-5 mr-3 text-gray-500" />
                                        <span className="text-gray-700">Settings</span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center p-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-3 text-red-500" />
                                        <span className="text-red-600">Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop navigation links visible only on larger screens */}
            <div className="hidden md:block">
                {isNavOpen && (
                    <nav className="bg-white shadow px-6 py-2">
                        <ul className="flex space-x-4">
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `text-gray-700 hover:underline transition-colors duration-200 ${isActive ? "text-green-600 hover:text-green-600 hover:underline pb-1" : ""
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/overview"
                                    className={`text-gray-700 hover:underline transition-colors duration-200 ${isOverviewActive ? "text-green-600 hover:text-green-600 hover:underline pb-1" : ""}`}
                                >
                                    Overview
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/service-team"
                                    className={({ isActive }) =>
                                        `text-gray-700 hover:underline transition-colors duration-200 ${isActive ? "text-green-600 hover:text-green-600 hover:underline pb-1" : ""
                                        }`
                                    }
                                >
                                    Service
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/customers"
                                    className={({ isActive }) =>
                                        `text-gray-700 hover:underline transition-colors duration-200 ${isActive ? "text-green-600 hover:text-green-600 hover:underline pb-1" : ""
                                        }`
                                    }
                                >
                                    Customers
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>

            {/* Mobile sidebar navigation */}
            {isNavOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsNavOpen(false)}></div>
                    {/* Sidebar */}
                    <div className="relative bg-gray-700 w-64 h-full shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <img src="/images/logos/logo.svg" alt="Arreglio Logo" className="h-8" />
                            <button onClick={() => setIsNavOpen(false)} className="header-icon">
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>
                        <nav className="p-4">
                            <ul className="space-y-4">
                                <li>
                                    <NavLink
                                        to="/dashboard"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 text-gray-700 hover:bg-gray-700 transition-colors ${isActive ? "text-green-400 bg-gray-700 border-r-2 border-green-400" : "text-white"
                                            }`
                                        }
                                    >
                                        <Home size={20} />
                                        <span>Dashboard</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/overview"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 hover:bg-gray-700 transition-colors ${isActive ? "text-green-400 bg-gray-700 border-r-2 border-green-400" : "text-white"
                                            }`
                                        }
                                    >
                                        <BarChart2 size={20} />
                                        <span>Overview</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/service-team"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 hover:bg-gray-700 transition-colors ${isActive ? "text-green-400 bg-gray-700 border-r-2 border-green-400" : "text-white"
                                            }`
                                        }
                                    >
                                        <Wrench size={20} />
                                        <span>Service</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/customers"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 hover:bg-gray-700 transition-colors ${isActive ? "text-green-400 bg-gray-700 border-r-2 border-green-400" : "text-white"
                                            }`
                                        }
                                    >
                                        <ShoppingBag size={20} />
                                        <span>Customers</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}

            {/* User Settings Dialog */}
            <Dialog
                header="User Settings"
                visible={showUserSettings}
                onHide={() => setShowUserSettings(false)}
                style={{ width: '600px' }}
                modal
            >
                <div className="space-y-6">
                    {/* Profile Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <InputText
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <InputText
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Email Notifications</span>
                                <Button
                                    icon="pi pi-check"
                                    className="p-button-sm"
                                    severity="success"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Push Notifications</span>
                                <Button
                                    icon="pi pi-check"
                                    className="p-button-sm"
                                    severity="success"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Dark Mode</span>
                                <Button
                                    icon="pi pi-times"
                                    className="p-button-sm"
                                    severity="secondary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setShowUserSettings(false)}
                        />
                        <Button
                            label="Save Changes"
                            onClick={() => {
                                setShowUserSettings(false);
                                setToast({
                                    severity: 'success',
                                    summary: 'Settings Saved',
                                    detail: 'Your settings have been updated successfully.',
                                    life: 3000
                                });
                            }}
                        />
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </header>
    );
}