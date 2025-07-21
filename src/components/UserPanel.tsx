import { useRef, useEffect } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface UserPanelProps {
    activeIcon: "notifications" | "language" | "user" | "settings" | "menu" | null;
    setActiveIcon: (icon: "notifications" | "language" | "user" | "settings" | "menu" | null) => void;
}

const UserPanel = ({ activeIcon, setActiveIcon }: UserPanelProps) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const isOpen = activeIcon === "user";
    const { user, isAuthenticated, logout } = useAuth();

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setActiveIcon(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setActiveIcon]);

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={panelRef}>
            {/* User Icon */}
            <button
                onClick={() => setActiveIcon(isOpen ? null : "user")}
                className={`header-icon ${isOpen ? "active" : ""}`}
            >
                <img
                    src="/images/avatar/user1.jpg"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                />
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white text-black shadow-lg rounded-lg z-50">
                    {/* User Info */}
                    <div className="p-4 border-b">
                        <p className="font-semibold">{user?.name || "User"}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    {/* Menu Options */}
                    <ul className="p-2 space-y-2">
                        <li className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <User className="w-5 h-5 mr-2 hover:text-blue-500" /> Profile
                        </li>
                        <li className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <Settings className="w-5 h-5 mr-2 hover:text-blue-500" /> Settings
                        </li>
                        <li className="flex items-center p-2 hover:bg-red-100 rounded cursor-pointer text-red-600">
                            <button
                                onClick={e => { e.stopPropagation(); logout(); }}
                                className="flex items-center w-full bg-transparent border-0 p-0 m-0 text-red-600"
                                style={{ outline: "none" }}
                            >
                                <LogOut className="w-5 h-5 mr-2 hover:text-red-700" /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserPanel;
