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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'

const ResolveSheet = ({ market_id, onResolveAction }) => {
  const [selectedValue, setSelectedValue] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function onSubmit(data) {
    console.log('Selected outcome:', data.outcome)
    await onResolveAction(selectedValue, market_id)
  }

  return (
    // <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
    //   <SheetTrigger asChild>
    //     <button>
    //       <TooltipProvider>
    //         <Tooltip>
    //           <TooltipTrigger>
    //             <CircleCheck
    //               className="w-6 h-6 cursor-pointer"
    //               strokeWidth={1.5}
    //             />
    //           </TooltipTrigger>
    //           <TooltipContent>
    //             <p>Resolve the market</p>
    //           </TooltipContent>
    //         </Tooltip>
    //       </TooltipProvider>
    //     </button>
    //   </SheetTrigger>
    //   <SheetContent className="h-screen flex flex-col justify-center">
    //     <SheetHeader>
    //       <SheetTitle>Resolve Market</SheetTitle>
    //       <SheetDescription>
    //         Please select the outcome to resolve this market. This action is
    //         final and will affect all participant results.
    //       </SheetDescription>
    //     </SheetHeader>

    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //         <FormField
    //           control={form.control}
    //           name="outcome"
    //           render={({ field }) => (
    //             <FormItem>
    //               <div className="flex flex-col gap-2 w-full">
    //                 <div>
    //                   <FormLabel>End Result</FormLabel>
    //                 </div>
    //                 <div className="">
    //                   <Select
    //                     onValueChange={(value) => {
    //                       field.onChange(value)
    //                     }}
    //                     value={field.value}
    //                     className="w-[180px]"
    //                   >
    //                     <FormControl>
    //                       <SelectTrigger>
    //                         <SelectValue placeholder="Select the outcome" />
    //                       </SelectTrigger>
    //                     </FormControl>

    //                     <SelectContent>
    //                       <SelectItem value="YES">YES</SelectItem>
    //                       <SelectItem value="NO">NO</SelectItem>
    //                     </SelectContent>
    //                   </Select>
    //                 </div>
    //               </div>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <SheetFooter>
    //           <Button
    //             variant="outline"
    //             onClick={() => {
    //               form.reset()
    //               setSheetOpen(false)
    //             }}
    //           >
    //             Cancel
    //           </Button>

    //           <Button type="submit">Resolve</Button>
    //         </SheetFooter>
    //       </form>
    //     </Form>
    //   </SheetContent>
    // </Sheet>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <RadioGroup
          className="flex gap-2"
          value={selectedValue}
          onValueChange={setSelectedValue}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="YES" id="Yes" />
            <Label htmlFor="Yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="NO" id="No" />
            <Label htmlFor="No">No</Label>
          </div>
        </RadioGroup>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Resolve Market</DialogTitle>
          <DialogDescription>
            Are you sure you want to resolve this market with {selectedValue} as
            the end result? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsDialogOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ResolveSheet
