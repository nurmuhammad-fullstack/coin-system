import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Card, BackButton } from "../components/ui";
import { FaBell, FaCheck, FaTrash, FaFire, FaTrophy, FaStar, FaClock, FaGift } from "react-icons/fa";

const NOTIFICATION_ICONS = {
  streak: <FaFire className="text-orange-500" />,
  leaderboard: <FaTrophy className="text-yellow-500" />,
  achievement: <FaStar className="text-amber-400" />,
  bonus: <FaGift className="text-purple-500" />,
  quiz: <FaClock className="text-blue-500" />,
  shop: <FaGift className="text-green-500" />,
  system: <FaBell className="text-slate-500" />,
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications 
  } = useApp();

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now - notifDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notifDate.toLocaleDateString();
  };

  const getIcon = (type) => NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.system;

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification._id);
    }
  };

  return (
    <div className="space-y-4 mx-auto px-4 sm:px-6 lg:px-8 py-5 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <BackButton onClick={() => navigate(-1)} label="Back" />
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-800 px-3 py-1.5 rounded-xl font-bold text-brand-600 dark:text-brand-400 text-xs transition-colors"
            >
              <FaCheck /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button 
              onClick={clearAllNotifications}
              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800 px-3 py-1.5 rounded-xl font-bold text-red-500 text-xs transition-colors"
            >
              <FaTrash /> Clear all
            </button>
          )}
        </div>
      </div>

      <h1 className="flex items-center gap-2 font-poppins font-black text-slate-800 dark:text-white text-2xl">
        <FaBell className="text-brand-500" /> Notifications
        {unreadCount > 0 && (
          <span className="bg-red-500 px-2 py-0.5 rounded-full text-white text-xs">{unreadCount}</span>
        )}
      </h1>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mb-3 text-5xl">🔔</div>
          <p className="font-bold text-slate-500 dark:text-slate-400">No notifications yet</p>
          <p className="mt-1 text-slate-400 dark:text-slate-500 text-sm">We'll notify you when something happens!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 ${!notification.read ? 'bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500' : ''}`}
            >
              <div className="flex gap-3">
                <div className="flex flex-shrink-0 justify-center items-center bg-white dark:bg-slate-700 shadow-sm rounded-full w-10 h-10 text-xl">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{notification.title}</p>
                    {!notification.read && (
                      <span className="flex-shrink-0 bg-brand-500 mt-1.5 rounded-full w-2 h-2" />
                    )}
                  </div>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 text-sm line-clamp-2">{notification.message}</p>
                  <p className="mt-2 text-slate-400 dark:text-slate-500 text-xs">{formatTime(notification.createdAt)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

