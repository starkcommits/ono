import { useInView, useMotionValue, animate } from 'motion/react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}) {
  const ref = useRef(null)
  const motionValue = useMotionValue(direction === 'down' ? value : startValue)
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        animate(motionValue, direction === 'down' ? startValue : value, {
          duration: 0.3, // exactly 0.4 seconds
          ease: 'easeOut',
          onUpdate: (latest) => {
            if (ref.current) {
              ref.current.textContent = Intl.NumberFormat('en-US', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              }).format(Number(latest.toFixed(decimalPlaces)))
            }
          },
        })
      }, delay * 500)

      return () => clearTimeout(timer)
    }
  }, [
    motionValue,
    isInView,
    delay,
    value,
    direction,
    startValue,
    decimalPlaces,
  ])

  return (
    <span
      ref={ref}
      className={cn(
        'inline-block tabular-nums tracking-wider text-black dark:text-white',
        className
      )}
      {...props}
    >
      {startValue}
    </span>
  )
}
