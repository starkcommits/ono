import { useState } from 'react'
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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import SelectedTick from '@/assets/SelectedTick.svg'
import AppLanguageIcon from '@/assets/AppLanguage.svg'
import HindiIcon from '@/assets/HindiIcon.svg'
import EnglishIcon from '@/assets/EnglishIcon.svg'
import Right from '@/assets/Right.svg'
import { useNavigate } from 'react-router-dom'

const AppLanguage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'English'
  )

  const [tempLanguage, setTempLanguage] = useState(selectedLanguage)

  console.log('Selected , temp', selectedLanguage, tempLanguage)

  const handleSelectLanguage = () => {
    setSelectedLanguage(tempLanguage)
    localStorage.setItem('selectedLanguage', tempLanguage)
    setIsDrawerOpen(false)
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} className="">
      <DrawerTrigger>
        <div className="flex items-center justify-between gap-2 border-b border-[#CBCBCB] px-4 pb-4 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="rounded-[50px] w-[20px]">
              <img src={AppLanguageIcon} alt="" />
            </div>
            <p className="font-normal text-xs text-[#2C2D32]">App Language</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-normal text-xs text-[#5F5F5F]">
              {selectedLanguage === 'English' ? 'English' : null}
              {selectedLanguage === 'Hindi' ? 'Hindi' : null}
            </p>
            <img src={Right} className="w-3 h-3" alt="" />
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
        <div className="px-4 space-y-2">
          <p className="text-xl leading-[22px] font-semibold text-[#2C2D32]">
            Choose your language
          </p>
          <p className="text-[#5F5F5F] text-xs font-normal leading-[22px]">
            Your can always change this from profile menu
          </p>
        </div>

        <RadioGroup
          value={tempLanguage}
          onValueChange={setTempLanguage}
          className="flex flex-col gap-0 py-2 last:border-b-0 text-[#2C2D32] text-sm leading-[22px] font-normal"
        >
          {/* English */}
          <Label
            htmlFor="english"
            className="flex items-center justify-between gap-4 p-4 cursor-pointer border-b"
          >
            <div className="flex items-center gap-3">
              <div className="border-[0.5px] p-[5px] bg-white rounded-[5px]">
                <img src={EnglishIcon} alt="English" />
              </div>
              <p>English</p>
            </div>
            {tempLanguage === 'English' && (
              <img src={SelectedTick} alt="selected" />
            )}
            <RadioGroupItem id="english" value="English" className="hidden" />
          </Label>

          {/* Hindi */}
          <Label
            htmlFor="hindi"
            className="flex items-center justify-between gap-4 p-4 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-[5px]">
                <img src={HindiIcon} alt="Hindi" />
              </div>
              <p>Hindi</p>
            </div>
            {tempLanguage === 'Hindi' && (
              <img src={SelectedTick} alt="selected" />
            )}
            <RadioGroupItem id="hindi" value="Hindi" className="hidden" />
          </Label>
        </RadioGroup>

        <div className="w-full flex items-center justify-center px-4 pb-4">
          <button
            className="bg-[#2C2D32] text-white text-sm font-medium tracking-[1px] w-full py-[18px] px-4 rounded-[5px]"
            onClick={handleSelectLanguage}
          >
            CONFIRM
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default AppLanguage
