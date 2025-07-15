import { useState, useRef, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { BellIcon } from "@heroicons/react/24/solid";

interface NotificationPanelProps {
  activeIcon: "notifications" | "language" | "user" | "settings" | "menu" | null;
  setActiveIcon: (icon: "notifications" | "language" | "user" | "settings" | "menu" | null) => void;
}

const notifications = [
  {
    id: 1,
    type: "all",
    icon: <CheckCircle className="text-blue-500" size={20} />, // Custom icon
    message: "Your Elite author Graphic Optimization reward is ready!",
    time: "JUST 30 SEC AGO",
    isRead: false,
  },
  {
    id: 2,
    type: "messages",
    avatar: "/images/users/user1.jpg",
    name: "Angela Bernier",
    message: "Answered to your comment on the cash flow forecast's graph ",
    time: "48 MIN AGO",
    isRead: false,
  },
  {
    id: 3,
    type: "alerts",
    icon: <AlertCircle className="text-red-500" size={20} />, // Alert icon
    message: "You have received 20 new messages in the conversation",
    time: "2 HRS AGO",
    isRead: true,
  },
];

export default function NotificationPanel({ activeIcon, setActiveIcon }: NotificationPanelProps) {
  // const [isOpen, setIsOpen] = useState(false);
  const isOpen = activeIcon === "notifications";
  const [activeTab, setActiveTab] = useState("all");
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setActiveIcon(null); // Close panel by resetting activeIcon
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActiveIcon]);



  const filteredNotifications = notifications.filter(
    (notification) => activeTab === "all" || notification.type === activeTab
  );

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={() => setActiveIcon(isOpen ? null : "notifications")} className={`header-icon ${isOpen ? "active" : ""}`}>

        <BellIcon className="w-5 h-5" />
        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-[5px] py-[1px] rounded-full">
          5
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-white rounded-lg shadow-lg border z-50">
          {/* Header */}
          <div className="p-4 bg-blue-900 text-white flex justify-between items-center rounded-t-lg">
            <h3 className="font-semibold">Notifications</h3>
            <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-full">4 New</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {["All", "Messages", "Alerts"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 text-center font-semibold ${activeTab.toLowerCase() === tab.toLowerCase()
                  ? "text-blue-900 border-b-2 border-blue-900"
                  : "text-gray-500"
                  }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab} ({notifications.filter(n => n.type === tab.toLowerCase() || tab === "All").length})
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="p-4 max-h-60 overflow-y-auto">
            {filteredNotifications.map((notif) => (
              <div key={notif.id} className={`flex items-start p-3 rounded-lg ${notif.isRead ? "bg-gray-100" : "bg-blue-50"}`}>
                {/* Avatar or Icon */}
                {notif.avatar ? (
                  <img src={notif.avatar} alt="User" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center">{notif.icon}</div>
                )}

                {/* Notification Content */}
                <div className="ml-3 flex-1">
                  {notif.name && <p className="font-semibold">{notif.name}</p>}
                  <p className="text-gray-700 text-sm">{notif.message}</p>
                  <p className="text-gray-500 text-xs flex items-center mt-1">🕒 {notif.time}</p>
                </div>

                {/* Mark as Read */}
                <input type="checkbox" className="ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
