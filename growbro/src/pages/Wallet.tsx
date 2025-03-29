import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet as WalletIcon, CreditCard, BanIcon as BankIcon, ArrowUpRight, Clock, ArrowDownLeft, Filter, ChevronRight, Plus } from 'lucide-react';

const Wallet = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals'>('all');
  const quickAmounts = [100, 500, 1000, 5000];

  const transactions = [
    {
      id: '1',
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      method: 'UPI',
      timestamp: '2024-03-05T14:30:00Z'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 500,
      status: 'pending',
      method: 'Bank Transfer',
      timestamp: '2024-03-05T12:15:00Z'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 2000,
      status: 'completed',
      method: 'Credit Card',
      timestamp: '2024-03-04T18:45:00Z'
    }
  ];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleAddMoney = () => {
    // TODO: Implement payment gateway integration
    console.log('Adding money:', amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-indigo-600 pt-safe-top pb-8">
        <div className="px-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/')}
              className="p-2 -ml-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Wallet</h1>
          </div>

          {/* Balance Card */}
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-medium">Available Balance</span>
              <WalletIcon className="h-5 w-5 text-white/90" />
            </div>
            <div className="text-4xl font-bold text-white mb-4">₹1,234.56</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/80 mb-1">Total Deposits</div>
                <div className="text-white font-semibold">₹5,000.00</div>
              </div>
              <div>
                <div className="text-white/80 mb-1">Total Withdrawals</div>
                <div className="text-white font-semibold">₹3,765.44</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-sm">
          {/* Add Money Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Money</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Quick Add
              </label>
              <div className="grid grid-cols-4 gap-3">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuickAmount(value)}
                    className="py-2 px-3 bg-gray-50 rounded-xl text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    ₹{value}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3" />
                  <span className="font-medium">Credit/Debit Card</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <div className="flex items-center">
                  <BankIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">UPI/Net Banking</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={handleAddMoney}
              disabled={!amount}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white font-medium rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Money
            </button>
          </div>

          {/* Transactions Section */}
          <div>
            <div className="flex p-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('deposits')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'deposits'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'withdrawals'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Withdrawals
              </button>
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="text-sm font-medium text-gray-700">
                Recent Transactions
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {transactions
                .filter(t => activeTab === 'all' || 
                  (activeTab === 'deposits' && t.type === 'deposit') ||
                  (activeTab === 'withdrawals' && t.type === 'withdrawal'))
                .map((transaction) => (
                  <div key={transaction.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          transaction.type === 'deposit' 
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {transaction.type === 'deposit' 
                            ? <ArrowDownLeft className="h-5 w-5" />
                            : <ArrowUpRight className="h-5 w-5" />
                          }
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.type === 'deposit' ? 'Money Added' : 'Withdrawal'}
                          </div>
                          <div className="text-sm text-gray-500">{transaction.method}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          transaction.type === 'deposit' 
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          {transaction.status === 'pending' && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          <span className={transaction.status === 'pending' ? 'text-amber-600' : ''}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;