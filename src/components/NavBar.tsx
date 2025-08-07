// src/components/NavBar.tsx
import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-[#1D2A38] text-white">
            {/* Left: Brand */}
            <div className="flex items-center space-x-4">
                {/* Replace with your logo image if desired */}
                <span className="text-xl font-bold">arreglio</span>

                {/* Main Nav Links */}
                <ul className="flex space-x-4">
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `hover:text-gray-300 transition-colors duration-200 ${isActive ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1" : ""
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/overview"
                            className={({ isActive }) =>
                                `hover:text-gray-300 transition-colors duration-200 ${isActive ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1" : ""
                                }`
                            }
                        >
                            Overview
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/service-team"
                            className={({ isActive }) =>
                                `hover:text-gray-300 transition-colors duration-200 ${isActive ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1" : ""
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
                                `hover:text-gray-300 transition-colors duration-200 ${isActive ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1" : ""
                                }`
                            }
                        >
                            Customers
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Right: Language & User Avatar */}
            <div className="flex items-center space-x-4">
                {/* Language icon (replace with a real flag/icon) */}
                <button className="hover:text-gray-300">
                    <span>🇸🇪</span>
                </button>

                {/* User avatar placeholder */}
                <div className="w-8 h-8 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center">
                    <span className="font-bold">U</span>
                </div>
            </div>
        </nav>
    );
}
