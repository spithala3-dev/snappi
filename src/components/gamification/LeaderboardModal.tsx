import React, { useState } from 'react';
import { X, Trophy, Medal, Award, Star } from 'lucide-react';
import { User } from '../../types';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  const users: User[] = JSON.parse(localStorage.getItem('snappi_users') || '[]');

  const sortedUsers = [...users]
    .filter(u => !u.isSuspended)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 20);

  const getPeriodLabel = () => {
    if (period === 'week') return 'This Week';
    if (period === 'month') return 'This Month';
    return 'All Time';
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-gray-500 font-semibold">#{rank}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
              <p className="text-white text-sm opacity-90">{getPeriodLabel()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-2 mb-6">
            {['week', 'month', 'all'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p as any)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  period === p
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p === 'week' && 'Weekly'}
                {p === 'month' && 'Monthly'}
                {p === 'all' && 'All Time'}
              </button>
            ))}
          </div>

          {sortedUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No users yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;

                return (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                      isTop3
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-12 flex items-center justify-center">
                      {getMedalIcon(rank)}
                    </div>

                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{user.fullName}</h3>
                      <p className="text-sm text-gray-600">{user.hostel}</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-orange-600 font-bold text-lg">
                        <Star className="w-5 h-5 fill-orange-400" />
                        <span>{user.totalPoints}</span>
                      </div>
                      <p className="text-xs text-gray-600">{user.totalDeliveries} deliveries</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 How to Earn Points</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Complete a delivery: <span className="font-semibold">+10 points</span></li>
              <li>• Get a 5-star rating: <span className="font-semibold">+5 bonus points</span></li>
              <li>• Fast delivery (&lt;15 min): <span className="font-semibold">+3 points</span></li>
              <li>• Earn badges for more points and recognition!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
