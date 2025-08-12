import { useState } from 'react'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import Rate from '@/assets/Rate.svg'
import Rating1 from '@/assets/Rating1.svg'
import Rating2 from '@/assets/Rating2.svg'
import Rating3 from '@/assets/Rating3.svg'
import Rating4 from '@/assets/Rating4.svg'
import Rating5 from '@/assets/Rating5.svg'
import Back from '@/assets/Back.svg'
import { useNavigate } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { toast } from 'sonner'

const ratingBadges = {
  1: {
    emoji: Rating1,
    title: 'Hate it',
    badges: [
      'Customer Support',
      'Trading Experience',
      'KYC Issue',
      'Withdrawal/Recharge Issues',
      'Disliked app',
    ],
  },
  2: {
    emoji: Rating2,
    title: "Did'nt like it",
    badges: [
      'Customer Support',
      'Trading Experience',
      'KYC Issue',
      'Withdrawal/Recharge Issues',
      'Disliked app',
    ],
  },
  3: {
    emoji: Rating3,
    title: 'Okay',
    badges: [
      'Settlement Issues',
      'Trading Experience',
      'Customer Support',
      'Commission',
      'Confusing App',
    ],
  },
  4: {
    emoji: Rating4,
    title: 'Like it',
    badges: [
      'Excellent Support',
      'Variety of events',
      'Trading Features',
      'Fast Withdrawal',
      'Easy earning',
    ],
  },
  5: {
    emoji: Rating5,
    title: 'Love it!',
    badges: [
      'Excellent Support',
      'Variety of events',
      'Trading Features',
      'Fast Withdrawal',
      'Easy earning',
    ],
  },
}

export default function RateUs() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [selectedBadges, setSelectedBadges] = useState([])
  const [feedback, setFeedback] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  console.log(selectedBadges)

  const handleStarClick = (value) => {
    setRating(value)
    setSelectedBadges([]) // reset badges when rating changes
  }

  const toggleBadge = (badge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    )
  }

  const handleSubmit = () => {
    const payload = { rating, issues: selectedBadges, feedback }
    console.log('Data: ', payload)
    if (selectedBadges.length === 0) {
      toast.error(
        'Oops! You missed a required section. Please complete it to proceed—your feedback matters!'
      )
      return
    }

    setIsDrawerOpen(true)
    console.log(isDrawerOpen)
    setTimeout(() => {
      setIsDrawerOpen(false)
      navigate('/profile')
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center space-y-4 select-none">
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10">
            <div>
              <img src={Rating4} alt="" />
            </div>
            <p className="text-[#2C2D32] text-base font-semibold">
              Thank you for your feedback!
            </p>
            <span className="text-xs font-medium text-[#5F5F5F] leading-normal">
              Your response has been successfully recorded!
            </span>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="h-12 sticky top-0 select-none w-full p-4 border-b flex justify-between items-center gap-4 border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
        <div className="flex items-center gap-3">
          <img
            src={Back}
            alt=""
            className="cursor-pointer h-4 w-4"
            onClick={() => {
              navigate('/')
            }}
          />
        </div>
      </div>
      {/* Star rating */}
      {/* Content when rating = 0 */}
      {rating === 0 && (
        <div className="text-center mt-10 flex flex-col items-center gap-4">
          <div>
            <img src={Rate} alt="" />
          </div>
          <p className="text-base font-semibold text-black leading-normal">
            Rate your experience with ONO
          </p>
          <p className="text-xs font-normal text-black leading-normal">
            We would love to know
          </p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= rating
                      ? 'fill-yellow-400 stroke-yellow-400'
                      : 'fill-none stroke-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Show badges + textarea only when rating > 0 */}
      {rating > 0 && (
        <>
          {rating > 0 && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl">
                <img src={ratingBadges[rating]?.emoji} alt="" />
              </div>
              <h2 className="font-bold text-xl">
                {ratingBadges[rating]?.title}
              </h2>
              <p className="text-sm">We would love to know</p>
            </div>
          )}
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= rating
                      ? 'fill-yellow-400 stroke-yellow-400'
                      : 'fill-none stroke-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="w-full px-4 mt-10">
            <Label className="font-medium">
              What went wrong?<span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {ratingBadges[rating]?.badges?.map((badge) => (
                <Badge
                  key={badge}
                  onClick={() => toggleBadge(badge)}
                  variant={
                    selectedBadges.includes(badge) ? 'default' : 'outline'
                  }
                  className="cursor-pointer rounded-[16px] border-[0.5px] border-[#A4A4A4] text-sm font-normal font-inter px-3.5 py-0.5"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          <div className="px-4 w-full space-y-1">
            <Label className="font-medium text-base text-black">
              Any other feedback
            </Label>
            <Textarea
              rows={7}
              value={feedback}
              placeholder="Give your feedback..."
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full  border border-gray-300 rounded-lg p-2 mt-4"
            />
          </div>

          <div className="sticky bottom-0 w-full px-4">
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 text-white rounded-[5px] w-full text-sm font-medium leading-normal tracking-[1px] ${
                selectedBadges.length === 0 ? 'bg-[#CBCBCB]' : 'bg-[#E26F64]'
              }`}
            >
              SUBMIT
            </button>
          </div>
        </>
      )}
    </div>
  )
}
