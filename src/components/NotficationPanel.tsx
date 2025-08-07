import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Search,
  Clock,
  MessageSquare,
  Award,
  Package,
  CreditCard,
  Users,
  Settings
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'alert';
  category: 'order' | 'payment' | 'system' | 'customer' | 'inventory' | 'reward' | 'support';
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  avatar?: string;
  sender?: string;
  rewardAmount?: string;
  orderNumber?: string;
  paymentAmount?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Your Elite author Graphic Optimization reward is ready!',
    message: 'You have earned a reward for your excellent work on graphic optimization',
    type: 'success',
    category: 'reward',
    timestamp: new Date(Date.now() - 30000), // 30 seconds ago
    read: false,
    priority: 'high',
    rewardAmount: '$150.00',
    actionUrl: '/rewards'
  },
  {
    id: 2,
    title: 'Angela Bernier',
    message: 'Answered to your comment on the cash flow forecast\'s graph',
    type: 'message',
    category: 'support',
    timestamp: new Date(Date.now() - 48 * 60 * 1000), // 48 minutes ago
    read: false,
    priority: 'medium',
    sender: 'Angela Bernier',
    avatar: '/images/avatar/user1.jpg',
    actionUrl: '/messages'
  },
  {
    id: 3,
    title: 'You have received 20 new messages in the conversation',
    message: 'Multiple team members have responded to the ongoing discussion',
    type: 'alert',
    category: 'support',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    priority: 'medium',
    actionUrl: '/conversations'
  },
  {
    id: 4,
    title: 'New Order Received',
    message: 'Order #ORD-2024-001 has been placed by John Smith',
    type: 'info',
    category: 'order',
    timestamp: new Date('2024-01-20 10:30:00'),
    read: false,
    priority: 'high',
    orderNumber: 'ORD-2024-001',
    actionUrl: '/orders/ORD-2024-001'
  },
  {
    id: 5,
    title: 'Payment Successful',
    message: 'Payment of $1,372.80 received for Order #ORD-2024-001',
    type: 'success',
    category: 'payment',
    timestamp: new Date('2024-01-20 11:15:00'),
    read: false,
    priority: 'medium',
    paymentAmount: '$1,372.80',
    orderNumber: 'ORD-2024-001'
  },
  {
    id: 6,
    title: 'Low Stock Alert',
    message: 'iPhone 15 Pro is running low on stock (5 units remaining)',
    type: 'warning',
    category: 'inventory',
    timestamp: new Date('2024-01-20 09:45:00'),
    read: true,
    priority: 'high',
    actionUrl: '/inventory'
  },
  {
    id: 7,
    title: 'System Maintenance',
    message: 'Scheduled maintenance will begin in 30 minutes',
    type: 'warning',
    category: 'system',
    timestamp: new Date('2024-01-20 07:00:00'),
    read: false,
    priority: 'high'
  },
  {
    id: 8,
    title: 'New Customer Registration',
    message: 'Emily Davis has registered as a new customer',
    type: 'info',
    category: 'customer',
    timestamp: new Date('2024-01-19 12:10:00'),
    read: true,
    priority: 'low',
    sender: 'Emily Davis'
  }
];

interface NotificationPanelProps {
  activeIcon: "notifications" | "language" | "user" | "settings" | "menu" | null;
  setActiveIcon: (icon: "notifications" | "language" | "user" | "settings" | "menu" | null) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ activeIcon, setActiveIcon }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'messages' | 'alerts'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<any>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isOpen = activeIcon === "notifications";
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string, category: string) => {
    switch (type) {
      case 'success':
        return category === 'reward' ? <Award className="w-5 h-5 text-yellow-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <X className="w-5 h-5 text-red-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'info':
        switch (category) {
          case 'order': return <Package className="w-5 h-5 text-blue-500" />;
          case 'payment': return <CreditCard className="w-5 h-5 text-green-500" />;
          case 'customer': return <Users className="w-5 h-5 text-purple-500" />;
          case 'system': return <Settings className="w-5 h-5 text-gray-500" />;
          default: return <Info className="w-5 h-5 text-blue-500" />;
        }
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return 'JUST NOW';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} MIN AGO`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} HR AGO`;
    return timestamp.toLocaleDateString();
  };

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setToast({
      severity: 'success',
      summary: 'Notifications Updated',
      detail: 'All notifications have been marked as read.',
      life: 3000
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    if (notification.actionUrl) {
      // Navigate to the action URL
      window.location.href = notification.actionUrl;
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Filter by tab
    if (activeTab === 'messages') {
      filtered = filtered.filter(n => n.type === 'message');
    } else if (activeTab === 'alerts') {
      filtered = filtered.filter(n => n.type === 'alert' || n.type === 'warning' || n.type === 'error');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.sender && n.sender.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredNotifications(filtered);
  };

  useEffect(() => {
    filterNotifications();
  }, [activeTab, searchTerm, notifications]);

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


  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'all': return notifications.length;
      case 'messages': return notifications.filter(n => n.type === 'message').length;
      case 'alerts': return notifications.filter(n => n.type === 'alert' || n.type === 'warning' || n.type === 'error').length;
      default: return 0;
    }
  };

  const notificationBodyTemplate = (notification: Notification) => {
    return (
      <div ref={panelRef}
        className={`flex items-start p-4 rounded-lg cursor-pointer transition-colors ${notification.read ? 'bg-gray-50' : 'bg-blue-50'
          } hover:bg-gray-100 border-l-4 ${notification.read ? 'border-transparent' : 'border-blue-500'
          }`}
        onClick={(e) => {
          e.stopPropagation();
          handleNotificationClick(notification);
        }}
      >
        {/* Avatar or Icon */}
        <div className="flex-shrink-0 mr-3">
          {notification.avatar ? (
            <img
              src={notification.avatar}
              alt={notification.sender || 'User'}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center">
              {getTypeIcon(notification.type, notification.category)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {notification.sender && (
                <p className="font-semibold text-gray-900 mb-1">{notification.sender}</p>
              )}
              <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900'} mb-1`}>
                {notification.title}
              </p>
              {notification.message && (
                <p className="text-xs text-gray-500 mb-2">{notification.message}</p>
              )}

              {/* Additional Info */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo(notification.timestamp)}</span>
                </div>
                {notification.rewardAmount && (
                  <span className="text-green-600 font-medium">{notification.rewardAmount}</span>
                )}
                {notification.paymentAmount && (
                  <span className="text-green-600 font-medium">{notification.paymentAmount}</span>
                )}
                {notification.orderNumber && (
                  <span className="text-blue-600 font-medium">{notification.orderNumber}</span>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex-shrink-0 ml-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                checked={notification.read}
                onChange={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(notification.id);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveIcon(isOpen ? null : "notifications");
        }}
        className={`header-icon relative ${isOpen ? "active" : ""}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            value={unreadCount}
            severity="danger"
            className="absolute -top-1 -right-1"
          />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-4 w-80 bg-white rounded-lg shadow-lg border z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-[#1D2A38] text-white flex justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <span className="text-lg font-semibold">Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-white text-[#1D2A38] text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} New
              </span>
              <Button
                icon="pi pi-times"
                className="p-button-text p-button-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIcon(null);
                }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b bg-gray-50" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <InputText
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => {
                  e.stopPropagation();
                  setSearchTerm(e.target.value);
                }}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b" onClick={(e) => e.stopPropagation()}>
            {[
              { key: 'all', label: 'All' },
              { key: 'messages', label: 'Messages' },
              { key: 'alerts', label: 'Alerts' }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === tab.key
                  ? "text-[#1D2A38] border-b-2 border-[#1D2A38] bg-white"
                  : "text-gray-500 bg-gray-50 hover:bg-gray-100"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(tab.key as 'all' | 'messages' | 'alerts');
                }}
              >
                {tab.label} ({getTabCount(tab.key)})
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="p-3 border-b bg-gray-50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <Button
                label="Mark All as Read"
                icon="pi pi-check"
                className="p-button-outlined p-button-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllAsRead();
                }}
                disabled={unreadCount === 0}
              />
              <div className="text-xs text-gray-500">
                {filteredNotifications.length} notifications
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id}>
                    {notificationBodyTemplate(notification)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications found</p>
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Toast ref={toast} />
    </div>
  );
};

export default NotificationPanel;
