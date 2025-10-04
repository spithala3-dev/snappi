import React, { useState } from 'react';
import { Package, ShoppingBag, Utensils, Plus, Trophy, User, LogOut, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { RequestList } from './RequestList';
import { CreateRequestModal } from './CreateRequestModal';
import { LeaderboardModal } from '../Gamification/LeaderboardModal';
import { ProfileModal } from './ProfileModal';
import { AdminPanel } from '../Admin/AdminPanel';

type TabType = 'food' | 'parcel' | 'mart';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('food');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { user, logout } = useAuth();
  const { requests, announcements } = useData();

  const activeAnnouncements = announcements.filter(a =>
    !a.expiresAt || new Date(a.expiresAt) > new Date()
  );

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'food') return req.requestType === 'food_delivery';
    if (activeTab === 'parcel') return req.requestType === 'parcel_pickup';
    if (activeTab === 'mart') return req.requestType === 'mart_pickup';
    return false;
  });

  const tabs = [
    { id: 'food' as TabType, label: 'Food Delivery', icon: Utensils, color: 'orange' },
    { id: 'parcel' as TabType, label: 'Parcel Pickup', icon: Package, color: 'blue' },
    { id: 'mart' as TabType, label: 'Mart Pickup', icon: ShoppingBag, color: 'green' },
  ];

  // Mapping for Tailwind colors
  const tabColors: Record<TabType, string> = {
    food: 'bg-orange-100 text-orange-700',
    parcel: 'bg-blue-100 text-blue-700',
    mart: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Snappi</h1>
                <p className="text-xs text-gray-600">Campus Deliveries</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {activeAnnouncements.length > 0 && (
                <button className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}

              <button
                onClick={() => setShowLeaderboard(true)}
                className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Trophy className="w-6 h-6" />
              </button>

              <button
                onClick={() => setShowProfile(true)}
                className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <User className="w-6 h-6" />
              </button>

              {user?.isAdmin && (
                <button
                  onClick={() => setShowAdmin(true)}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Shield className="w-6 h-6" />
                </button>
              )}

              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex space-x-1 pb-4 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive ? tabColors[tab.id] : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.fullName}!</h2>
                <p className="text-gray-600 mt-1">{user.hostel} • {user.totalPoints} points</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">{user.totalDeliveries}</div>
                <div className="text-sm text-gray-600">Deliveries</div>
              </div>
            </div>
          </div>
        )}

        {activeAnnouncements.length > 0 && (
          <div className="mb-6 space-y-3">
            {activeAnnouncements.map(announcement => (
              <div key={announcement.id} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-900">{announcement.title}</h3>
                <p className="text-blue-800 text-sm mt-1">{announcement.message}</p>
              </div>
            ))}
          </div>
        )}

        <RequestList requests={filteredRequests} requestType={activeTab} />
      </main>

      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center z-30"
      >
        <Plus className="w-8 h-8" />
      </button>

      {showCreateModal && <CreateRequestModal onClose={() => setShowCreateModal(false)} />}
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
};
