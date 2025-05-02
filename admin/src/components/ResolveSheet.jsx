import React from 'react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { CircleCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useState } from 'react'

const formSchema = z.object({
  outcome: z.enum(['YES', 'NO'], {
    errorMap: () => ({ message: 'Select a valid outcome' }),
  }),
})

const ResolveSheet = ({ market_id, onResolveAction }) => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outcome: '',
    },
  })

  async function onSubmit(data) {
    console.log('Selected outcome:', data.outcome)
    await onResolveAction(data, market_id)
    setSheetOpen(false)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleCheck
                  className="w-6 h-6 cursor-pointer"
                  strokeWidth={1.5}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Resolve the market</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </button>
      </SheetTrigger>
      <SheetContent className="h-screen flex flex-col justify-center">
        <SheetHeader>
          <SheetTitle>Resolve Market</SheetTitle>
          <SheetDescription>
            Please select the outcome to resolve this market. This action is
            final and will affect all participant results.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="outcome"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2 w-full">
                    <div>
                      <FormLabel>End Result</FormLabel>
                    </div>
                    <div className="">
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                        value={field.value}
                        className="w-[180px]"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the outcome" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="YES">YES</SelectItem>
                          <SelectItem value="NO">NO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button
                variant="outline"
                onClick={() => {
                  form.reset()
                  setSheetOpen(false)
                }}
              >
                Cancel
              </Button>

              <Button type="submit">Resolve</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default ResolveSheet
