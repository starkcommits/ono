import React, { useState } from 'react'
import Back from '@/assets/Back.svg'
import { useNavigate } from 'react-router-dom'
import KYC11 from '@/assets/KYC11.svg'
import KYC12 from '@/assets/KYC12.svg'
import HelpSupport from '@/assets/HelpSupport.svg'
import PanGuidelines1 from '@/assets/PanGuidelines1.svg'
import PanGuidelines2 from '@/assets/PanGuidelines2.svg'
import PanGuidelines3 from '@/assets/PanGuidelines3.svg'
import PANCard from '@/assets/PANCard.svg'
import PANInfo from '@/assets/PANInfo.svg'
import ThreeLines from '@/assets/ThreeLines.svg'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const steps = [
  { id: 1, label: 'PAN' },
  { id: 2, label: 'Bank' },
]

const panSchema = z.object({
  panNumber: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      'Invalid PAN format (e.g., ABCDE1234F)'
    )
    .min(10, 'PAN must be 10 characters')
    .max(10, 'PAN must be 10 characters'),

  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .regex(/^[a-zA-Z ]+$/, 'Name should contain only letters and spaces'),

  dob: z
    .object({
      day: z.string().min(1, 'Select date'),
      month: z.string().min(1, 'Select month'),
      year: z.string().min(1, 'Select year'),
    })
    .refine(
      (data) => {
        const dateStr = `${data.year}-${data.month}-${data.day}`
        const date = new Date(dateStr)
        return !isNaN(date.getTime()) && date <= new Date()
      },
      {
        message: 'Invalid or future date',
        path: ['day'], // attach error to day field
      }
    ),
})
const KYC = () => {
  const navigate = useNavigate()
  const [confirmationChecked, setConfirmationChecked] = useState(false)
  const [step, setStep] = useState('kyc-verification')
  const [panGuidelineDrawerOpen, setPanGuidelinesDrawerOpen] = useState(
    step === 'kyc-verification' ? true : false
  )

  const [activeKYCStep, setActiveKYCStep] = useState(1)

  const form = useForm({
    resolver: zodResolver(panSchema),
    defaultValues: {
      panNumber: '',
      name: '',
      day: '',
      month: '',
      year: '',
    },
  })

  const onPANSubmit = (values) => {
    console.log(values)
  }

  const handleConfirmClick = () => {
    form.handleSubmit(onPANSubmit)()
  }

  const watchedValues = form.watch()
  const isFormValid =
    watchedValues.panNumber &&
    watchedValues.name &&
    watchedValues.dob?.day &&
    watchedValues.dob?.month &&
    watchedValues.dob?.year

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col select-none">
      {step === 'kyc-verification' ? (
        <>
          <div className="h-12 sticky top-0 select-none w-full p-4 border-b flex items-center gap-4 border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
            <div className="flex items-center gap-3">
              <img
                src={Back}
                alt=""
                className="cursor-pointer h-4 w-4"
                onClick={() => {
                  navigate(-1)
                }}
              />
            </div>
            <div>
              <p className="text-[20px] text-[#2C2D32] font-medium leading-normal">
                KYC Details
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8 items-center px-4 py-4 flex-1">
            <div>
              <img src={KYC11} alt="" />
            </div>
            <div className="mx-auto w-full text-center">
              <p className="text-xl text-[#2C2D32] font-semibold tracking-[1px]">
                Complete KYC for smooth withdrawals & deposits
              </p>
            </div>
            <div>
              <img src={KYC12} alt="" />
            </div>
          </div>
          <div className="sticky bottom-0 pt-2 pb-4 flex flex-col gap-4 bg-[#F5F5F5]">
            <div className="px-4">
              <div className="flex items-start gap-3 border bg-[#ECF7F1] border-[#337265] p-[22px] rounded-[5px] px-4">
                <Checkbox
                  id="confirmation"
                  className="mt-1"
                  checked={confirmationChecked}
                  onCheckedChange={setConfirmationChecked}
                />
                <p className="font-normal text-base leading-[22px] tracking-[1px] text-[#2C2D32] flex items-start">
                  I confirm that the provided PAN and bank details belong to me.
                </p>
              </div>
            </div>
            <div className="w-full border-t border-[#CBCBCB] px-4 py-4">
              <button
                className="rounded-[5px] disabled:bg-[#CBCBCB] bg-[#E26F64] text-white w-full py-[18px] px-4 "
                disabled={!confirmationChecked}
                onClick={() => {
                  setStep('pan-verification')
                }}
              >
                START VERIFICATION
              </button>
            </div>
          </div>
        </>
      ) : null}
      {step === 'pan-verification' ? (
        <>
          <Drawer
            open={panGuidelineDrawerOpen}
            onOpenChange={setPanGuidelinesDrawerOpen}
            className=""
          >
            <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-white">
              <div className="flex flex-col gap-4 p-4">
                <h2 className="text-[24px] font-semibold tracking-[1px] text-[#007AFF]">
                  PAN Guidelines
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <div>
                      <img src={PanGuidelines1} alt="" />
                    </div>
                    <p className="font-normal text-base text-[#2C2D32] leading-normal">
                      You have 3 attempts to enter your PAN details correctly.
                    </p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div>
                      <img src={PanGuidelines2} alt="" />
                    </div>
                    <p className="font-normal text-base text-[#2C2D32] leading-normal">
                      Pan and Bank should be of the same person.
                    </p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div>
                      <img src={PanGuidelines3} alt="" />
                    </div>
                    <p className="font-normal text-base text-[#2C2D32] leading-normal">
                      Pan once linked to your account, cannot be unlinked.
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <img src={PANCard} className="w-full" alt="" />
                </div>
              </div>
              <div className="sticky bottom-0 pt-2 pb-4 flex flex-col gap-4 bg-white border-t border-[#CBCBCB]">
                <div className="w-full p-4">
                  <button
                    className="rounded-[5px] bg-[#E26F64] text-white w-full py-[18px] px-4"
                    onClick={() => {
                      setPanGuidelinesDrawerOpen(false)
                    }}
                  >
                    PROCEED
                  </button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          <div className=" sticky top-0 select-none w-full py-4 flex flex-col items-center  max-w-md mx-auto bg-white">
            <div className="w-full flex gap-2 items-center justify-between px-4 pb-4 border-b border-[#8D8D8D80]/50">
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={Back}
                    alt=""
                    className="cursor-pointer h-4 w-4"
                    onClick={() => {
                      navigate(-1)
                    }}
                  />
                </div>
                <div>
                  <p className="text-[20px] text-[#2C2D32] font-medium leading-normal">
                    PAN Verification
                  </p>
                </div>
              </div>
              <div>
                <img src={HelpSupport} alt="" />
              </div>
            </div>
            <div className="w-full bg-[#F4F7FE] flex justify-center items-center gap-4 px-4 py-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  {/* Step Circle */}
                  <div
                    onClick={() => setActiveKYCStep(step.id)}
                    className={`flex justify-center items-center w-[25px] h-[25px] rounded-full border text-base cursor-pointer
              ${
                activeKYCStep === step.id
                  ? 'bg-gradient-to-r from-[#4396FE] to-[#136CDE] border-[#145DBB] text-white'
                  : 'bg-white border-[#CBCBCB] text-[#2C2D32]'
              }
            `}
                  >
                    {step.id}
                  </div>

                  {/* Step Label */}
                  <p
                    className={`text-sm ${
                      activeKYCStep === step.id
                        ? 'text-[#136CDE] font-medium'
                        : 'text-[#2C2D32]'
                    }`}
                  >
                    {step.label}
                  </p>

                  {/* Divider (line between steps, except last one) */}
                  {index < steps.length - 1 && (
                    <div className="mx-2">
                      <img src={ThreeLines} alt="divider" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8 py-4 bg-white flex-1">
            <div className="px-4">
              <div className="bg-gradient-to-r from-[#EAF9FF] to-[#FFFFFF] border-[0.5px] border-solid border-[#79D0F5] flex gap-4 items-center justify-center w-full mx-auto rounded-[5px] py-[12px] px-[22px]">
                <div>
                  <img src={PANInfo} alt="" />
                </div>
                <p className="text-sm text-[#2C2D32] font-normal leading-normal">
                  Pan and Bank should belong to the same person.
                </p>
              </div>
            </div>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onPANSubmit)}
                  className="space-y-6 px-4 mx-auto"
                >
                  {/* PAN Number */}
                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-[#2C2D32] font-medium leading-normal">
                          PAN Card Number
                          <span className="text-[#E26F64]"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDE1234F"
                            className="placeholder:text-[#5F5F5F]"
                            value={field.value || ''}
                            onChange={(e) => {
                              // Remove any non-alphanumeric characters and convert to uppercase
                              let value = e.target.value
                                .replace(/[^a-zA-Z0-9]/g, '')
                                .toUpperCase()

                              // Apply PAN format: 5 letters + 4 numbers + 1 letter
                              let formattedValue = ''
                              for (let i = 0; i < value.length && i < 10; i++) {
                                if (i < 5) {
                                  // First 5 characters should be letters
                                  if (/[A-Z]/.test(value[i])) {
                                    formattedValue += value[i]
                                  }
                                } else if (i < 9) {
                                  // Next 4 characters should be numbers
                                  if (/[0-9]/.test(value[i])) {
                                    formattedValue += value[i]
                                  }
                                } else {
                                  // Last character should be a letter
                                  if (/[A-Z]/.test(value[i])) {
                                    formattedValue += value[i]
                                  }
                                }
                              }

                              field.onChange(formattedValue)
                            }}
                            onKeyPress={(e) => {
                              const currentValue = e.target.value
                              const key = e.key

                              // Allow backspace, delete, tab, escape, enter
                              if (
                                [
                                  'Backspace',
                                  'Delete',
                                  'Tab',
                                  'Escape',
                                  'Enter',
                                ].includes(key)
                              ) {
                                return
                              }

                              // Check position-based validation
                              const position = currentValue.length

                              if (position < 5) {
                                // First 5 positions: only uppercase letters
                                if (!/[A-Za-z]/.test(key)) {
                                  e.preventDefault()
                                }
                              } else if (position < 9) {
                                // Positions 5-8: only numbers
                                if (!/[0-9]/.test(key)) {
                                  e.preventDefault()
                                }
                              } else if (position < 10) {
                                // Position 9: only uppercase letter
                                if (!/[A-Za-z]/.test(key)) {
                                  e.preventDefault()
                                }
                              } else {
                                // Max length reached
                                e.preventDefault()
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-[#2C2D32] font-medium leading-normal">
                          Name (as in PAN Card){' '}
                          <span className="text-[#E26F64]">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full Name"
                            className="placeholder:text-[#5F5F5F] bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* DOB Day */}
                  <div className="flex flex-col gap-2.5">
                    <p className="text-sm font-medium text-[#2C2D32]">
                      Date of Birth <span className="text-[#E26F64]"> *</span>
                    </p>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="dob.day"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[...Array(31)].map((_, i) => (
                                  <SelectItem key={i + 1} value={String(i + 1)}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Month */}
                      <FormField
                        control={form.control}
                        name="dob.month"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i + 1} value={String(i + 1)}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Year */}
                      <FormField
                        control={form.control}
                        name="dob.year"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 100 }, (_, i) => {
                                  const year = new Date().getFullYear() - i
                                  return (
                                    <SelectItem key={year} value={String(year)}>
                                      {year}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className="sticky bottom-0 pt-2 pb-4 flex flex-col gap-4 bg-white border-t border-[#CBCBCB]">
            <div className="w-full p-4">
              <button
                disabled={!isFormValid}
                className="rounded-[5px] disabled:bg-[#CBCBCB] bg-[#E26F64] text-white w-full py-[18px] px-4 "
                onClick={handleConfirmClick}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default KYC
