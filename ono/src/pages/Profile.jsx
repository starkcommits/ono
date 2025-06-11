import React from 'react'
import Back from '@/assets/Back.svg'
import ProfileIcon from '@/assets/Profile.png'
import Share from '@/assets/Share.svg'
import Instagram from '@/assets/Instagram.svg'
import Twitter from '@/assets/Twitter.svg'

import Right from '@/assets/Right.svg'
import { useNavigate } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'

const Profile = () => {
  const navigate = useNavigate()

  const { currentUser } = useFrappeAuth()
  console.log(currentUser)
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col select-none">
      <div className="h-16 sticky top-0 select-none w-full p-4 border-b flex justify-between items-center gap-4 border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
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
      </div>
      <div className="flex-1 overflow-y-auto bg-[white]">
        <div className="flex flex-col gap-2 items-center py-4 px-4">
          <div className="rounded-full">
            <img className="" src={ProfileIcon} width={90} height={90} alt="" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-[22px] text-[#2C2D32]">
              Harshit Adhikari
            </h3>
          </div>
          <div className="flex justify-center gap-4 ">
            <div className="font-normal text-sm leading-[22px] py-[5px] px-[30px] border border-[#CBCBCB] rounded-[5px]">
              Followers{' '}
              <span className="font-inter font-semibold text-[#2C2D32]">
                40k
              </span>
            </div>
            <div className="font-normal text-sm leading-[22px] py-[5px] px-[30px] border border-[#CBCBCB] rounded-[5px]">
              Following{' '}
              <span className="font-inter font-semibold text-[#2C2D32]">
                707
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 px-4">
          <div className="flex flex-col gap-4 rounded-[10px] p-[14px] shadow-[0px_2px_2px_0px_#0000001A] bg-[linear-gradient(0deg,_#FFFFFF_41.2%,_#FFF1F0_115.28%)]">
            <div className="bg-[#D3E0DD] w-[23px] h-[23px]"></div>
            <div className="flex flex-col">
              <span className="font-inter font-medium text-sm leading-[22px]">
                &#8377;237.69
              </span>
              <span className="font-normal text-xs leading-[22px] text-[#5F5F5F]">
                Balance
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-[10px] p-[13px] shadow-[0px_2px_2px_0px_#0000001A] bg-[linear-gradient(0deg,_#FFFFFF_41.2%,_#DFF3FF_115.28%)]">
            <div className="bg-[#D3E0DD] w-[23px] h-[23px] "></div>
            <div className="flex flex-col">
              <span className="font-inter font-medium text-sm leading-[22px]">
                &#8377;237.69
              </span>
              <span className="font-normal text-xs leading-[22px] text-[#5F5F5F]">
                Leaderboard
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-[10px] p-[13px] shadow-[0px_2px_2px_0px_#0000001A] bg-[linear-gradient(0deg,_#FFFFFF_41.2%,_#FFFCEC_115.28%)]">
            <div className="bg-[#D3E0DD] w-[23px] h-[23px]"></div>
            <div className="flex flex-col">
              <span className="font-inter font-medium text-sm leading-[22px]">
                &#8377;237.69
              </span>
              <span className="font-normal text-xs leading-[22px] text-[#5F5F5F]">
                My Level
              </span>
            </div>
          </div>
        </div>
        <div className="py-4 px-4 flex flex-col gap-4 leading-[22px]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-[50px] bg-[#D9D9D9] w-[30px] h-[30px]"></div>
              <p className="font-normal text-xs text-[#2C2D32]">Help</p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Right} className="w-3 h-3" alt="" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-[50px] bg-[#D9D9D9] w-[30px] h-[30px]"></div>
              <p className="font-normal text-xs text-[#2C2D32]">App Language</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-normal text-xs text-[#5F5F5F]">English</p>
              <img src={Right} className="w-3 h-3" alt="" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-[50px] bg-[#D9D9D9] w-[30px] h-[30px]"></div>
              <p className="font-normal text-xs text-[#2C2D32]">ONO Academy</p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Right} className="w-3 h-3" alt="" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-[50px] bg-[#D9D9D9] w-[30px] h-[30px]"></div>
              <p className="font-normal text-xs text-[#2C2D32]">
                Invite and Earn
              </p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Right} className="w-3 h-3" alt="" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-[50px] bg-[#D9D9D9] w-[30px] h-[30px]"></div>
              <p className="font-normal text-xs text-[#2C2D32]">Rate ONO</p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Right} className="w-3 h-3" alt="" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-[50px] bg-[#D9D9D9] w-[30px] h-[30px]"></div>
              <p className="font-normal text-xs text-[#2C2D32]">
                ONO Trust &amp; Safety
              </p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Right} className="w-3 h-3" alt="" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-[50px] bg-[#D9D9D9] w-[30px] h-[30px]"></div>
              <p className="font-normal text-xs text-[#2C2D32]">
                Terms &amp; Conditions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Right} className="w-3 h-3" alt="" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-[50px] bg-[#D9D9D9] w-[30px] h-[30px]"></div>
              <p className="font-normal text-xs text-[#2C2D32]">Logout</p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Right} className="w-3 h-3" alt="" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pb-4 px-4 leading-[22px]">
          <div className="font-semibold text-[10px]">FOLLOW US</div>
          <div className="flex items-center gap-3 ">
            <div>
              <img src={Share} alt="" />
            </div>
            <div>
              <img src={Twitter} alt="" />
            </div>
            <div>
              <img src={Instagram} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F4F3EF] sticky bottom-0 z-[50] pb-4 border-t border-[#DBC5F7]">
        <div className="flex justify-between px-4 py-2.5 gap-2">
          <div className="rounded-full bg-[#2C2D32]">
            <span className="leading-[22px] text-xs font-normal text-white px-2.5 py-[5px]">
              ONO
            </span>
          </div>

          <span className="leading-[22px] text-[10px] font-[500]">
            VERSION 1.0.0
          </span>
        </div>
      </div>
    </div>
  )
}

export default Profile
