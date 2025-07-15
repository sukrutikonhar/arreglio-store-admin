// src/components/NavBar.tsx
import { Link } from "react-router-dom";

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
                        <Link to="/dashboard" className="hover:text-gray-300">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/overview" className="hover:text-gray-300">
                            Overview
                        </Link>
                    </li>
                    <li>
                        <Link to="/service" className="hover:text-gray-300">
                            Service
                        </Link>
                    </li>
                    <li>
                        <Link to="/marketplace" className="hover:text-gray-300">
                            Marketplace
                        </Link>
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
