import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <div className="flex items-center gap-2">
      <Wallet className="h-4 w-4 text-indigo-600" />
      <span className="text-sm">₹{balance.toLocaleString()}</span>
    </div>
  );
};

export default WalletBalance;