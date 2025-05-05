import React from 'react'
import { Wallet } from 'lucide-react'

const EarningsTracker = () => {
  // Current earnings amount (would come from API/state in a real app)
  const currentEarnings = 0
  // Progress percentage (for the progress bar)
  const progress = 0 // 0% because earnings are 0

  return (
    <div className="bg-amber-50 rounded-xl p-5 shadow-sm border border-amber-100">
      <div className="flex items-center space-x-3">
        <div className="bg-amber-100 p-2 rounded-lg">
          <Wallet size={20} className="text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Invite Rewards</h3>
          <p className="text-2xl font-bold text-gray-800">₹{currentEarnings}</p>
        </div>
      </div>

      {/* <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div
            className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2.5 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹0</span>
          <span>₹1,000</span>
        </div>
      </div> */}

      {/* <div className="mt-3 bg-white p-3 rounded-lg border border-amber-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">
              Available for withdrawal
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-800">₹0</span>
        </div>
      </div> */}
    </div>
  )
}

export default EarningsTracker
