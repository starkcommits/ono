import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const ReferralCode = () => {
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const referralCode = 'HDIPWM'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setShowConfetti(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

  return (
    <div className="relative overflow-hidden">
      {showConfetti && <Confetti />}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-amber-100">
        <div className="mb-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Your Referral Code
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-wider text-gray-800">
              {referralCode}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {copied ? (
              <>
                <Check size={18} className="mr-1" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} className="mr-1" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6">
          <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-4 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
            Refer & Earn ₹50 Instantly
          </button>
        </div>
      </div>
    </div>
  )
}

const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 8 + 5
        const left = Math.random() * 100
        const animationDuration = Math.random() * 3 + 2
        const delay = Math.random() * 0.5
        const colors = [
          'bg-red-500',
          'bg-blue-500',
          'bg-green-500',
          'bg-yellow-500',
          'bg-purple-500',
          'bg-pink-500',
        ]
        const color = colors[Math.floor(Math.random() * colors.length)]

        return (
          <div
            key={i}
            className={`absolute rounded-sm animate-confetti ${color}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: '-20px',
              animationDuration: `${animationDuration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export default ReferralCode
