import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { REGEXP_ONLY_DIGITS_AND_CHARS, REGEXP_ONLY_DIGITS } from 'input-otp'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useFrappePostCall } from 'frappe-react-sdk'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const OTPScreen = () => {
  const [timeLeft, setTimeLeft] = useState(600) // 5 minutes = 300 seconds
  const location = useLocation()
  const navigate = useNavigate()
  const { mobile_no } = location.state || {}
  const [resendEnabled, setResendEnabled] = useState(false)
  const [otp, setOtp] = useState('')
  const { call: verifyOTP } = useFrappePostCall('rewardapp.api.verify_otp')

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (timeLeft === 0) {
      setResendEnabled(true)
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  const handleResend = () => {
    // Trigger resend logic here
    setTimeLeft(600)
    setResendEnabled(false)
  }

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP({
        mobile: mobile_no,
        otp: otp,
      })
      navigate('/')
    } catch (error) {
      console.log(error)
      toast.error(error?.message?.message || 'error in validating the otp')
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Enter Verification Code
          </CardTitle>
          <CardDescription>
            We've sent a 6-digit code to your registered whatsapp number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={!resendEnabled}
              >
                Resend OTP
              </Button>
              {!resendEnabled && (
                <span className="ml-2 text-sm text-gray-500">
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <Button onClick={handleVerifyOTP} disabled={otp.length !== 6}>
              Verify OTP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OTPScreen
