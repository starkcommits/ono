import React, { useState, useEffect } from 'react'

const SkillScoreMeter = ({
  value,
  minValue = 100,
  maxValue = 900,
  label = 'Skill',
  size = 210,
  strokeWidth = 10,
  className = '',
  colors = {
    background: '#e5e7eb',
    fill: '#3b82f6',
    text: '#374151',
  },
}) => {
  // State for animated value
  const [animatedValue, setAnimatedValue] = useState(minValue)

  // Animate to target value on mount or when value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 100) // Small delay to ensure smooth animation

    return () => clearTimeout(timer)
  }, [value])

  // Ensure value is within bounds
  const clampedValue = Math.max(minValue, Math.min(maxValue, animatedValue))

  // Calculate the percentage
  const percentage = ((clampedValue - minValue) / (maxValue - minValue)) * 100

  // SVG dimensions
  const radius = (size - strokeWidth) / 2
  const centerX = size / 2
  const centerY = size / 2

  // Semi-circle path (180 degrees)
  const startAngle = Math.PI // Start at left (180 degrees)
  const endAngle = 0 // End at right (0 degrees)

  // Calculate arc path
  const createArcPath = (startAngle, endAngle, radius) => {
    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)
    const x2 = centerX + radius * Math.cos(endAngle)
    const y2 = centerY + radius * Math.sin(endAngle)

    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
  }

  // Background arc (full semi-circle)
  const backgroundPath = createArcPath(startAngle, endAngle, radius)

  // Calculate the circumference of the semi-circle
  const circumference = Math.PI * radius

  // Calculate the stroke-dashoffset based on percentage
  const strokeDashoffset = circumference * (1 - percentage / 100)

  return (
    <div
      className={`relative inline-flex flex-col items-center ${className} px-4`}
    >
      <svg
        width={size}
        height={size / 2 + 40}
        viewBox={`0 0 ${size} ${size / 2 + 40}`}
        className="w-full h-auto"
      >
        {/* Background arc */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={colors.background}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress fill */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={colors.fill}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>

      {/* Centered circle with value */}
      <div
        className="absolute z-[10] rounded-full flex items-center justify-center"
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.25)',
          width: '10.5rem',
          height: '10.5rem',
          top: '69%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <p className="text-[36px] font-semibold text-[#2C2D32]">
          {Math.round(animatedValue)}
        </p>
      </div>
      <div className="absolute bottom-8 left-2">
        <p className="font-normal text-[#272727] text-[10px]">{minValue}</p>
      </div>
      <div className="absolute bottom-8 right-2">
        <p className="font-normal text-[#272727] text-[10px]">{maxValue}</p>
      </div>
    </div>
  )
}

export default SkillScoreMeter
