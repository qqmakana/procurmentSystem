import React, { useState } from 'react';
import { User } from '../types';

interface Notification {
  id: string;
  type: 'approval_required' | 'approval_completed' | 'rejection' | 'submission' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  requisitionId?: string;
  fromUser?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSystemProps {
  currentUser: User | null;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onViewRequisition: (requisitionId: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewRequisition
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'approval' | 'system'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval_required':
        return '🔔';
      case 'approval_completed':
        return '✅';
      case 'rejection':
        return '❌';
      case 'submission':
        return '📤';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };


  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter === 'approval') {
      filtered = filtered.filter(n => n.type.includes('approval'));
    } else if (filter === 'system') {
      filtered = filtered.filter(n => n.type === 'system');
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-white/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-sm text-blue-300 hover:text-blue-200"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex space-x-2">
              {['all', 'unread', 'approval', 'system'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-white/70">
                <div className="text-4xl mb-2">📭</div>
                <p>No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${
                    !notification.isRead ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium truncate">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-white/70 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/50">
                          {notification.timestamp.toLocaleString()}
                        </div>
                        <div className="flex space-x-2">
                          {notification.requisitionId && (
                            <button
                              onClick={() => {
                                onViewRequisition(notification.requisitionId!);
                                setIsOpen(false);
                              }}
                              className="text-xs text-blue-300 hover:text-blue-200"
                            >
                              View
                            </button>
                          )}
                          {!notification.isRead && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-xs text-white/50 hover:text-white/70"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-white/20">
            <div className="text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-white/70 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
