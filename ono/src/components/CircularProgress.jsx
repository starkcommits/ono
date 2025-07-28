import { useState, useEffect } from 'react'

export default function CircularProgress({
  percentage = 0,
  size = 50,
  strokeWidth = 4,
  label = 'chance',
  showLabel = true,
}) {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100)

  // Calculate semicircle properties
  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Create semicircle path
  const centerX = size / 2
  const centerY = size / 2
  const startX = centerX - radius
  const startY = centerY
  const endX = centerX + radius
  const endY = centerY

  const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`

  return (
    <div className="flex flex-col items-center justify-center absolute right-4 top-4">
      <div className="relative" style={{ width: 50, height: 30 }}>
        <svg width={size} height={size / 2 + 5}>
          {/* Background semicircle */}
          <path
            d={pathData}
            stroke="#00812F"
            strokeWidth={strokeWidth}
            fill="none"
            className="opacity-30"
          />

          {/* Progress semicircle */}
          <path
            d={pathData}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center content */}
        {showLabel && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ top: size / 4 }}
          >
            <span className="text-[9px] font-medium text-[#242424]">
              {percentage}%
            </span>
            <span className="text-[7px] font-normal text-[#606060]">
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
