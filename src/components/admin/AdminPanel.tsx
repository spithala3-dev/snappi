import React, { useState } from 'react';
import { X, Users, Package, MessageSquare, TrendingUp, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { User } from '../../types';

interface AdminPanelProps {
  onClose: () => void;
}

type TabType = 'users' | 'requests' | 'announcements' | 'analytics';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  const { user } = useAuth();
  const { requests, createAnnouncement, announcements } = useData();

  if (!user?.isAdmin) {
    return null;
  }

  const users: User[] = JSON.parse(localStorage.getItem('snappi_users') || '[]');
  const activeUsers = users.filter(u => !u.isSuspended);

  const handleToggleSuspend = (userId: string) => {
    const usersList = JSON.parse(localStorage.getItem('snappi_users') || '[]');
    const userIndex = usersList.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
      usersList[userIndex].isSuspended = !usersList[userIndex].isSuspended;
      localStorage.setItem('snappi_users', JSON.stringify(usersList));
      window.location.reload();
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncement({
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      createdBy: user.id,
    });
    setNewAnnouncement({ title: '', message: '' });
  };

  const tabs = [
    { id: 'analytics' as TabType, label: 'Analytics', icon: TrendingUp },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'requests' as TabType, label: 'Requests', icon: Package },
    { id: 'announcements' as TabType, label: 'Announcements', icon: Bell },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                  isActive
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900">{activeUsers.length}</div>
                  <div className="text-sm text-blue-700">Active Users</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-900">{requests.length}</div>
                  <div className="text-sm text-green-700">Total Requests</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-900">
                    {requests.filter(r => r.status === 'open').length}
                  </div>
                  <div className="text-sm text-yellow-700">Open Requests</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-900">
                    {requests.filter(r => r.status === 'completed').length}
                  </div>
                  <div className="text-sm text-purple-700">Completed</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Types Breakdown</h3>
                <div className="space-y-3">
                  {['food_delivery', 'parcel_pickup', 'mart_pickup'].map(type => {
                    const count = requests.filter(r => r.requestType === type).length;
                    const percentage = requests.length > 0 ? (count / requests.length) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 capitalize">{type.replace('_', ' ')}</span>
                          <span className="text-gray-900 font-semibold">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Helpers</h3>
                <div className="space-y-2">
                  {users
                    .sort((a, b) => b.totalDeliveries - a.totalDeliveries)
                    .slice(0, 5)
                    .map((u, i) => (
                      <div key={u.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500 font-semibold">#{i + 1}</span>
                          <div>
                            <p className="font-medium text-gray-900">{u.fullName}</p>
                            <p className="text-xs text-gray-600">{u.hostel}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-orange-600">{u.totalDeliveries} deliveries</p>
                          <p className="text-xs text-gray-600">{u.totalPoints} points</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="text-sm text-gray-600">Total: {users.length} users</div>
              </div>
              {users.map(u => (
                <div key={u.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{u.fullName}</h4>
                      {u.isAdmin && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          Admin
                        </span>
                      )}
                      {u.isSuspended && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Suspended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{u.email} • {u.hostel}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{u.totalDeliveries} deliveries</span>
                      <span>{u.totalPoints} points</span>
                      <span>{u.successRate}% success</span>
                    </div>
                  </div>
                  {u.id !== user.id && (
                    <button
                      onClick={() => handleToggleSuspend(u.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        u.isSuspended
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">All Requests</h3>
                <div className="text-sm text-gray-600">Total: {requests.length} requests</div>
              </div>
              {requests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No requests yet</p>
                </div>
              ) : (
                requests.map(req => {
                  const requesterUser = users.find(u => u.id === req.requesterId);
                  const helperUser = req.helperId ? users.find(u => u.id === req.helperId) : null;

                  return (
                    <div key={req.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{req.title}</h4>
                          <p className="text-sm text-gray-600 capitalize">{req.requestType.replace('_', ' ')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          req.status === 'open' ? 'bg-green-100 text-green-800' :
                          req.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Requester: {requesterUser?.fullName || 'Unknown'}</p>
                        {helperUser && <p>Helper: {helperUser.fullName}</p>}
                        <p>Created: {new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Announcement</h3>
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={newAnnouncement.message}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Create Announcement
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Announcements</h3>
                <div className="space-y-3">
                  {announcements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No announcements yet</p>
                    </div>
                  ) : (
                    announcements.map(announcement => (
                      <div key={announcement.id} className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h4 className="font-semibold text-blue-900">{announcement.title}</h4>
                        <p className="text-sm text-blue-800 mt-1">{announcement.message}</p>
                        <p className="text-xs text-blue-600 mt-2">
                          {new Date(announcement.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
