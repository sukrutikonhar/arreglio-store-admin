import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, Home, BarChart2, Wrench, ShoppingBag, X } from "lucide-react";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import NotificationPanel from "./NotficationPanel";
import UserPanel from "./UserPanel";
import LanguagePanel from "./LanguagePanel";

type ActiveIconType = "notifications" | "language" | "user" | "settings" | "menu" | null;

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [activeIcon, setActiveIcon] = useState<ActiveIconType>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleMenuClick = () => {
        setIsNavOpen(prev => !prev);
    };

    const handleSearchToggle = () => {
        setIsSearchOpen((prev) => !prev);
    };

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <header className="w-full sticky top-0 z-50">
            <div className="header-top flex items-center justify-between px-4 py-2">
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
                    <NotificationPanel activeIcon={activeIcon} setActiveIcon={setActiveIcon} />
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            "header-icon" + (isActive ? " active" : "")
                        }
                    >
                        <Cog8ToothIcon className="w-6 h-6" />
                    </NavLink>
                    <UserPanel activeIcon={activeIcon} setActiveIcon={setActiveIcon} />
                </div>
            </div>

            {/* Desktop navigation links visible only on larger screens */}
            <div className="hidden md:block">
                {isNavOpen && (
                    <nav className="bg-white shadow px-6 py-2">
                        <ul className="flex space-x-4">
                            <li>
                                <Link to="/dashboard" className="text-gray-700 hover:underline">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/overview" className="text-gray-700 hover:underline">
                                    Overview
                                </Link>
                            </li>
                            <li>
                                <Link to="/service" className="text-gray-700 hover:underline">
                                    Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/marketplace" className="text-gray-700 hover:underline">
                                    Marketplace
                                </Link>
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
                    <div className="relative bg-white w-64 h-full shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <img src="/images/logos/logo.svg" alt="Arreglio Logo" className="h-8" />
                            <button onClick={() => setIsNavOpen(false)} className="header-icon">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="p-4">
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        onClick={() => setIsNavOpen(false)}
                                        to="/dashboard"
                                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                                    >
                                        <Home className="w-5 h-5" />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        onClick={() => setIsNavOpen(false)}
                                        to="/overview"
                                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                                    >
                                        <BarChart2 className="w-5 h-5" />
                                        <span>Overview</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        onClick={() => setIsNavOpen(false)}
                                        to="/service"
                                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                                    >
                                        <Wrench className="w-5 h-5" />
                                        <span>Service</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        onClick={() => setIsNavOpen(false)}
                                        to="/marketplace"
                                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Marketplace</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
