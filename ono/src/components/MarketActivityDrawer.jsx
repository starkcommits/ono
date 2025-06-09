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
import { Button } from '@/components/ui/button'

const MarketActivityDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <button className="rounded-[5px] border border-[#CBCBCB] font-bold text-xs tracking-[1px] text-[#337265] py-3 px-10">
          SHOW MORE
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default MarketActivityDrawer
