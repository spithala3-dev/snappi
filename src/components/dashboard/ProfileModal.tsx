import React, { useState } from 'react';
import { X, User, Home, Phone, Mail, CreditCard as Edit2, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const { userBadges, badges, pointsHistory } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [hostel, setHostel] = useState(user?.hostel || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!user) return null;

  const myBadges = userBadges
    .filter(ub => ub.userId === user.id)
    .map(ub => badges.find(b => b.id === ub.badgeId))
    .filter(Boolean);

  const myPoints = pointsHistory.filter(ph => ph.userId === user.id);

  const handleSave = () => {
    updateProfile({ fullName, hostel, phone });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{user.fullName}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hostel</label>
                <input
                  type="text"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-3">
                <Home className="w-5 h-5 mr-3 text-gray-500" />
                <span>{user.hostel}</span>
              </div>

              <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-3">
                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                <span>{user.phone}</span>
              </div>

              <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-3">
                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                <span>{user.email}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{user.totalPoints}</div>
              <div className="text-sm text-gray-600 mt-1">Points</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{user.totalDeliveries}</div>
              <div className="text-sm text-gray-600 mt-1">Deliveries</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{user.successRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-600 mt-1">Success Rate</div>
            </div>
          </div>

          {myBadges.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Badges Earned
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {myBadges.map(badge => (
                  <div
                    key={badge!.id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 border border-yellow-200"
                  >
                    <div className="text-2xl mb-1">🏆</div>
                    <p className="font-semibold text-gray-900 text-sm">{badge!.name}</p>
                    <p className="text-xs text-gray-600">{badge!.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {myPoints.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Points</h3>
              <div className="space-y-2">
                {myPoints.slice(-5).reverse().map(ph => (
                  <div
                    key={ph.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <span className="text-sm text-gray-700">{ph.reason}</span>
                    <span className={`font-semibold ${ph.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {ph.points >= 0 ? '+' : ''}{ph.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {user.isAdmin && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-300">
              <p className="text-sm font-semibold text-purple-900">🛡️ Admin Account</p>
              <p className="text-xs text-purple-700 mt-1">You have administrative privileges</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
