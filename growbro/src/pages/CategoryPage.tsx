import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Timer, Zap } from 'lucide-react';

interface Market {
  id: string;
  category: string;
  title: string;
  traders: number;
  info: string;
  odds: { yes: number; no: number };
  trend: string;
  image?: string;
  type?: string;
}

interface CategoryState {
  category: string;
  markets: Market[];
}

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, markets } = location.state as CategoryState;

  const getCategoryEmoji = () => {
    const emojiMap: { [key: string]: string } = {
      'Cricket': '🏏',
      'Crypto': '₿',
      'Youtube': '▶️',
      'Stocks': '📈',
      'Politics': '🗳️',
      'Entertainment': '🎬',
      'Sports': '⚽',
      'Tech': '💻'
    };
    return emojiMap[category] || '📊';
  };

  const getCategoryGradient = () => {
    const gradientMap: { [key: string]: string } = {
      'Cricket': 'from-rose-400 to-rose-500',
      'Crypto': 'from-amber-400 to-amber-500',
      'Youtube': 'from-blue-400 to-blue-500',
      'Stocks': 'from-green-400 to-green-500',
      'Politics': 'from-purple-400 to-purple-500',
      'Entertainment': 'from-pink-400 to-pink-500',
      'Sports': 'from-orange-400 to-orange-500',
      'Tech': 'from-cyan-400 to-cyan-500'
    };
    return gradientMap[category] || 'from-gray-400 to-gray-500';
  };

  const handleMarketClick = (market: Market) => {
    navigate(`/event/${market.id}`, { state: { market } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 pt-safe-top pb-8">
        <div className="px-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/')}
              className="p-2 -ml-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">{category}</h1>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryGradient()} rounded-2xl shadow-sm flex items-center justify-center`}>
                <span className="text-3xl">{getCategoryEmoji()}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{category} Markets</h2>
                <p className="text-white/80">
                  {markets.length} active {markets.length === 1 ? 'event' : 'events'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-sm divide-y divide-gray-100">
          {markets.length > 0 ? (
            markets.map((market) => (
              <div 
                key={market.id}
                onClick={() => handleMarketClick(market)}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors animate-fadeIn"
              >
                {market.image && (
                  <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                    <img src={market.image} alt={market.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 right-3">
                      <span className="flex items-center text-xs font-medium bg-green-500/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white">
                        <TrendingUp className="h-3 w-3 mr-1" /> {market.trend}
                      </span>
                    </div>
                  </div>
                )}
                
                <h3 className="text-base font-medium mb-2">{market.title}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{market.traders.toLocaleString()} traders</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                    <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse mr-1"></div>
                    LIVE
                  </span>
                  <div className="flex items-center text-xs text-gray-600">
                    <Timer className="h-3.5 w-3.5 mr-1" />
                    <span>Ends in 2d</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-4">{market.info}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="py-2 px-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
                    Yes ₹{market.odds.yes}
                  </div>
                  <div className="py-2 px-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">
                    No ₹{market.odds.no}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Events</h3>
              <p className="text-sm text-gray-500">Check back later for new events in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;