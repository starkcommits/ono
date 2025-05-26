import React from 'react'
import { Separator } from '@/components/ui/separator'

const Widget = () => {
  return (
    <div className="bg-[#492C82] flex justify-between items-center select-none py-1.5 px-[13px] font-inter w-full max-w-md mx-auto ">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 text-white items-center">
          <span className="font-normal text-xs">Investment</span>
          <span className="font-semibold text-xs">&#8377;9.2K</span>
        </div>
        <div className="flex items-center h-full">
          <Separator orientation="vertical" className="h-5" />
        </div>
        <div className="flex gap-2 text-white items-center">
          <span className="font-normal text-xs">Returns</span>
          <span className="font-semibold text-xs text-[#337265]">
            &#8377;2.2K
          </span>
        </div>
      </div>
      <div className="text-white flex gap-2">
        <span className="font-normal text-xs">Live Gains</span>
        <span className="text-xs font-semibold">-503</span>
      </div>
    </div>
  )
}

export default Widget
