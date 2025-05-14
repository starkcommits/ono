import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' // Ensure you have this
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// Schema
const formSchema = z.object({
  gotReferralCode: z
    .string()
    .min(2, { message: 'Referral code must be at least 2 characters.' }),
})

const GotReferralCode = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      gotReferralCode: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      console.log('Referral code submitted:', data.gotReferralCode)
      // Handle logic or navigation here
      navigate('/') // Change route as needed
    } catch (error) {
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 justify-between">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-md mx-auto"
        >
          <div className="text-left">
            <h2 className="text-2xl font-semibold">Got a referral code</h2>
            <p className="text-sm font-normal mt-1">
              Get Instant bonus in your balance!
            </p>
          </div>

          <FormField
            control={form.control}
            name="gotReferralCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your referral code"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center mt-4">
            <Button
              type="button"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className={` 
                cursor-not-allowed" 
            `}
            >
              {isLoading ? 'Submitting...' : 'Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default GotReferralCode
