import * as React from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * SwipeButton Component
 *
 * A customizable swipe-to-confirm button that requires users to swipe
 * to 100% and release to trigger the confirmation action.
 *
 * Features:
 * - Smooth animations using Framer Motion
 * - Color transition feedback during swipe
 * - Customizable text, size, appearance, and colors
 * - Confirmation state with visual feedback
 * - Responsive full-width support
 * - External control of swiped state
 */

export function SwipeButton({
  onConfirm,
  handleConfirmBuy,
  text = 'SWIPE TO CONFIRM',
  confirmText = 'Order Placed',
  processingText = 'Processing...',
  width = 300,
  height = 56,
  className,
  disabled = false,
  fullWidth = false,
  startColor = 'rgb(124, 58, 237)', // Default purple (violet-600)
  endColor = 'rgb(52, 211, 153)', // Default green (emerald-400)
  textColor = 'white',
  knobColor = 'white',
  iconColor = 'rgb(124, 58, 237)', // Default matches startColor
  iconConfirmColor = 'rgb(52, 211, 153)', // Default matches endColor
  // New props for external state control
  swiped: externalSwiped = null,
  onSwipedChange = null,
  // New props for error handling
  isProcessing = false,
  hasError = false,
  onErrorReset = null,
  ...props
}) {
  // Use external swiped state if provided, otherwise use internal state
  const [internalSwiped, setInternalSwiped] = React.useState(false)
  const swiped = externalSwiped !== null ? externalSwiped : internalSwiped
  const setSwiped = onSwipedChange || setInternalSwiped

  // Track whether the swipe is in the confirming state (near the end)
  const [isConfirming, setIsConfirming] = React.useState(false)
  // Reference to the container element for measuring width
  const containerRef = React.useRef(null)

  // Calculate dimensions for the button and knob
  const buttonHeight = height
  const knobSize = buttonHeight - 8 // Knob is slightly smaller than button height

  // Set up motion values for animation
  const x = useMotionValue(0) // Track horizontal position of the knob

  // State to store the container width and drag constraints
  const [containerWidth, setContainerWidth] = React.useState(
    fullWidth ? 0 : width
  )
  const [dragConstraintRight, setDragConstraintRight] = React.useState(0)

  /**
   * This effect sets up a ResizeObserver to monitor the container's width
   * and updates the drag constraints accordingly.
   */
  React.useEffect(() => {
    // Function to update width and constraints based on container size
    const updateDimensions = () => {
      if (!containerRef.current) return

      // Get the actual width of the container
      const newWidth = fullWidth ? containerRef.current.clientWidth : width

      // Update state with the new width
      setContainerWidth(newWidth)

      // Calculate the right constraint for the drag (subtract knob size and padding)
      const newConstraint = newWidth - knobSize - 8
      setDragConstraintRight(newConstraint)

      // If the knob is currently dragged beyond the new constraint, animate it back
      if (x.get() > newConstraint && !swiped) {
        animate(x, newConstraint)
      }
    }

    // Call immediately to set initial dimensions
    updateDimensions()

    // Set up ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Clean up observer on unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, [fullWidth, width, knobSize, x, swiped])

  /**
   * Create a dynamic background color based on drag position
   */
  const background = useTransform(
    x,
    [0, Math.max(0, dragConstraintRight)],
    [startColor, endColor]
  )

  /**
   * Handle the end of the drag gesture
   * If dragged past threshold, confirm the action
   * Otherwise, animate back to start
   */
  const handleDragEnd = () => {
    if (swiped || disabled || isProcessing) return // Don't handle drag end if already swiped, disabled, or processing

    const currentX = x.get()
    // Set threshold at 90% of the total draggable distance
    const threshold = dragConstraintRight * 0.9

    if (currentX >= threshold) {
      // User has dragged past the threshold
      setIsConfirming(true)
      // Animate to the end position
      animate(x, dragConstraintRight, {
        type: 'spring',
        duration: 0.2,
        onComplete: () => {
          // Call the confirmation callback immediately without setting swiped state
          // The parent component will control the swiped state based on success/failure
          if (onConfirm) {
            onConfirm()
          }
          if (handleConfirmBuy) {
            handleConfirmBuy()
          }
        },
      })
    } else {
      // Not dragged far enough, animate back to start only if not swiped
      if (!swiped) {
        animate(x, 0, { type: 'spring', duration: 0.5 })
        setIsConfirming(false)
      }
    }
  }

  // Reset the button only when explicitly told to reset via external swiped state
  React.useEffect(() => {
    if (externalSwiped === false) {
      animate(x, 0, { type: 'spring', duration: 0.5 })
      setInternalSwiped(false)
      setIsConfirming(false)
    }
  }, [externalSwiped, x])

  // Handle error state - animate back to start
  React.useEffect(() => {
    if (hasError) {
      animate(x, 0, { type: 'spring', duration: 0.5 })
      setIsConfirming(false)
      // Reset swiped state
      if (externalSwiped !== null && onSwipedChange) {
        onSwipedChange(false)
      } else {
        setInternalSwiped(false)
      }
      // Call error reset callback if provided
      if (onErrorReset) {
        onErrorReset()
      }
    }
  }, [hasError, x, externalSwiped, onSwipedChange, onErrorReset])

  // Keep knob at the end position when swiped and not in error state
  React.useEffect(() => {
    if (swiped && dragConstraintRight > 0 && !hasError) {
      animate(x, dragConstraintRight, { type: 'spring', duration: 0.2 })
    }
  }, [swiped, dragConstraintRight, x, hasError])

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-full shadow-lg',
        fullWidth ? 'w-full' : '',
        className
      )}
      style={{
        width: fullWidth ? '100%' : width,
        height: buttonHeight,
        background, // Dynamic background color based on swipe position
      }}
      {...props}
    >
      {/* Text shown before confirmation */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center font-medium tracking-wider transition-opacity',
          swiped ? 'opacity-0' : isProcessing ? 'opacity-0' : 'opacity-100'
        )}
        style={{ color: textColor }}
      >
        {text}
      </div>

      {/* Text shown during processing */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center font-medium tracking-wider transition-opacity',
          isProcessing && !swiped ? 'opacity-100' : 'opacity-0'
        )}
        style={{ color: textColor }}
      >
        {processingText}
      </div>

      {/* Text shown after confirmation */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center font-medium tracking-wider transition-opacity',
          swiped ? 'opacity-100' : 'opacity-0'
        )}
        style={{ color: textColor }}
      >
        <span className="flex items-center gap-2">
          {confirmText} <Check className="w-5 h-5" />
        </span>
      </div>

      {/* Draggable knob element */}
      <motion.div
        className={cn(
          'absolute top-[4px] left-[4px] rounded-full shadow-md flex items-center justify-center',
          disabled && !swiped
            ? 'cursor-not-allowed'
            : swiped && !hasError
            ? 'cursor-default'
            : isProcessing
            ? 'cursor-wait'
            : 'cursor-grab active:cursor-grabbing'
        )}
        drag={disabled || (swiped && !hasError) || isProcessing ? false : 'x'} // Disable drag when disabled, successfully swiped, or processing
        dragConstraints={{
          left: 0,
          right: dragConstraintRight > 0 ? dragConstraintRight : 0,
        }} // Limit drag range
        dragElastic={0} // Disable elasticity for precise control
        dragMomentum={false} // Disable momentum for better control
        onDragEnd={handleDragEnd}
        style={{
          x, // Bind to motion value for position
          width: knobSize,
          height: knobSize,
          backgroundColor: knobColor,
        }}
        whileTap={
          disabled || (swiped && !hasError) || isProcessing
            ? {}
            : { scale: 1.05 }
        } // Subtle scale effect when dragging
        animate={
          swiped && !hasError
            ? { scale: 1.1 }
            : isProcessing
            ? { scale: 1.05 }
            : { scale: 1 }
        } // Scale up when confirmed or processing
        transition={{ duration: 0.2 }}
      >
        {/* Icon changes based on state */}
        {swiped && !hasError ? (
          <>
            <Check className="w-5 h-5" style={{ color: iconConfirmColor }} />
          </>
        ) : isProcessing ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <div className="flex">
            <ChevronRight
              className="w-4 h-4 transition-colors p-0 m-0"
              style={{ color: isConfirming ? iconConfirmColor : iconColor }}
            />
            <ChevronRight
              className="w-4 h-4 transition-colors p-0 -ml-2"
              style={{ color: isConfirming ? iconConfirmColor : iconColor }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
