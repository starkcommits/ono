import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Copy, Gift, Trophy, Clock, ChevronRight,
  Share2, Users, Zap, ExternalLink
} from 'lucide-react';

const Rewards = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');
  const referralCode = 'UBB7IT';
  const currentEarnings = 0;

  const topInviters = [
    { rank: 1, username: '@iamkrishna8u68', earnings: 329340, avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=100&h=100&fit=crop' },
    { rank: 2, username: '@cryptowithankit', earnings: 172928, avatar: 'https://images.unsplash.com/photo-1640951613773-54706e06851d?w=100&h=100&fit=crop' },
    { rank: 3, username: '@yo007', earnings: 159255, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  ];

  const rewardHistory = [
    { id: 1, type: 'referral', amount: 50, status: 'completed', timestamp: '2024-03-06T10:30:00Z', description: 'Referral bonus for @john_doe' },
    { id: 2, type: 'bonus', amount: 100, status: 'completed', timestamp: '2024-03-05T15:45:00Z', description: 'Welcome bonus' },
    { id: 3, type: 'referral', amount: 50, status: 'pending', timestamp: '2024-03-05T09:20:00Z', description: 'Referral bonus for @jane_smith' },
  ];

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    // You could add a toast notification here
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-amber-500 to-amber-600 pt-safe-top pb-8">
        <div className="px-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/')}
              className="p-2 -ml-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Rewards</h1>
          </div>

          {/* Instant Bonus Card */}
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-yellow-300" />
              <h2 className="text-xl font-bold text-white">INSTANT BONUS</h2>
              <Zap className="h-6 w-6 text-yellow-300" />
            </div>
            <div className="text-center text-white text-3xl font-bold mb-6">
              2 Invite = ₹100
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white/80 mb-2">Current earnings</div>
              <div className="text-2xl font-bold text-white mb-4">
                {formatCurrency(currentEarnings)}
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-white rounded-2xl p-4 mb-6">
            <div className="text-sm text-gray-600 mb-2">REFERRAL CODE</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{referralCode}</div>
              <button 
                onClick={handleCopyReferral}
                className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Share Button */}
          <button className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2">
            <Share2 className="h-5 w-5" />
            Refer & Earn ₹50 Instantly
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-sm">
          {/* Tabs */}
          <div className="flex p-2">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'rewards'
                  ? 'bg-amber-50 text-amber-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Top Inviters
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-amber-50 text-amber-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Reward History
            </button>
          </div>

          {activeTab === 'rewards' ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold">Top Inviters</h3>
                </div>
                <span className="text-sm text-gray-500">This Month</span>
              </div>

              <div className="space-y-4">
                {topInviters.map((inviter) => (
                  <div key={inviter.rank} className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={inviter.avatar} 
                        alt={inviter.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        inviter.rank === 1 
                          ? 'bg-amber-400 text-amber-900'
                          : inviter.rank === 2
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-amber-700 text-amber-200'
                      }`}>
                        {inviter.rank}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{inviter.username}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(inviter.earnings)} earned
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rewardHistory.map((reward) => (
                <div key={reward.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      reward.type === 'referral' 
                        ? 'bg-green-50 text-green-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {reward.type === 'referral' ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        <Gift className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium">
                          {reward.type === 'referral' ? 'Referral Bonus' : 'Welcome Bonus'}
                        </div>
                        <div className={`font-medium ${
                          reward.status === 'completed' ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {formatCurrency(reward.amount)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">{reward.description}</div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {new Date(reward.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;