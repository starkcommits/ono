import React from 'react'
import Back from '@/assets/Back.svg'
import { useNavigate } from 'react-router-dom'
import Right from '@/assets/Right.svg'
import PowerOff from '@/assets/PowerOff.svg'

const ControlCentre = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col select-none">
      <div className="h-12 sticky top-0 select-none w-full p-4 border-b flex justify-between items-center gap-4 border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
        <div className="flex items-center gap-3">
          <img
            src={Back}
            alt=""
            className="cursor-pointer h-4 w-4"
            onClick={() => {
              navigate(-1)
            }}
          />
          <p className="text-[#5F5F5F] text-[17px] font-normal leading-[22px] tracking-[-0.43px]">
            Control Centre
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 bg-white">
        <div className="flex justify-between items-center py-2">
          <p className="text-sm font-normal leading-[22px] text-[#2C2D32]">
            Daily time limit
          </p>
          <div>
            <img src={Right} alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <p className="text-sm font-normal leading-[22px] text-[#2C2D32]">
            Balance usage per event limit
          </p>
          <div>
            <img src={Right} alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex flex-col gap-2 w-[80%]">
            <p className="text-[#E26F64] leading-[16px] text-sm font-normal">
              Time off
            </p>
            <p className="text-xs font-normal leading-[16px] text-[#5F5F5F]">
              Please note that on activating the feature you won’t be able to
              trade for set number od days.
            </p>
          </div>
          <div className="w-[20%] flex justify-end">
            <img src={PowerOff} alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <p className="text-sm font-normal leading-[22px] text-[#2C2D32]">
            Recharge Limit
          </p>
          <div>
            <img src={Right} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlCentre
