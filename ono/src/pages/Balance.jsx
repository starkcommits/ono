import React from 'react'
import Back from '@/assets/Back.svg'
import { useNavigate } from 'react-router-dom'
import Wallet from '@/assets/Wallet.svg'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Winnings from '@/assets/Winnings.svg'
import Promotional from '@/assets/Promotional.svg'
import QuickAction from '@/assets/QuickAction.svg'
import { ArrowRight } from 'lucide-react'
import { NumberTicker } from '../components/ui/number-ticker'
import TradingBalance from '@/assets/TradingBalance.svg'
import RechargedBalance from '@/assets/RechargedBalance.svg'
import TransactionHistory from '@/assets/TransactionHistory.svg'
import Vault from '@/assets/Vault.svg'
import KYC from '@/assets/KYC.svg'
import ControlCentre from '@/assets/ControlCentre.svg'
import Statements from '@/assets/Statements.svg'

import { useFrappeAuth, useFrappeGetDoc } from 'frappe-react-sdk'

const Balance = () => {
  const navigate = useNavigate()

  const { currentUser } = useFrappeAuth()

  const { data: userWalletData } = useFrappeGetDoc(
    'User Wallet',
    currentUser,
    currentUser ? undefined : null
  )

  //   console.log('UserWallet: ', userWalletData)

  return (
    <div className="leading-[100%] bg-[#F5F5F5] select-none">
      <div className="sticky z-[50] top-0 left-0 right-0 flex flex-col max-w-md mx-auto pt-4 bg-white mb-auto">
        <div className="border-[0.33px] border-x-0 border-t-0 border-b border-[#DBC5F7] w-full flex items-center gap-2 pb-4 px-4">
          <span>
            <img
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                navigate(-1)
              }}
              src={Back}
              alt=""
            />
          </span>
          <h1 className="text-[17px] font-nrmal text-[#5F5F5F] tracking-[-0.43px]">
            Balance
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start px-4 pt-4">
        <p className="font-normal text-sm text-[#5F5F5F]">Total Balance</p>
        <p className="font-inter text-[28px] text-[#2C2D32]">
          &#8377;{` `}
          <NumberTicker
            value={userWalletData?.balance}
            className="text-[#2C2D32] text-[28px] font-semibold font-inter tracking-tighter"
          />
        </p>
      </div>
      <div className="bg-[#F5F5F5] px-4 py-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 bg-white px-[13px] py-[15px] rounded-[5px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between w-full ">
              <div className="flex gap-2">
                <div className="rounded-[5px] p-2 bg-[#E8F1FF]">
                  <img src={Wallet} alt="" />
                </div>
                <div className="flex flex-col">
                  <p className="font-normal text-[10px] text-[#5F5F5F]">
                    Deposit
                  </p>
                  <p className="text-[#2C2D32] text-sm font-semibold font-inter">
                    &#8377; 0
                  </p>
                </div>
              </div>

              <button className="bg-[#E26F64] rounded-[5px] px-[14.5px] py-2">
                <span className="text-white font-medium text-xs tracking-[1px]">
                  ADD MONEY
                </span>
              </button>
            </div>
          </div>
          <div>
            <Separator className="h-[0.7px]" />
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="hover:no-underline border-b-0 pb-0"
              >
                <AccordionTrigger className="hover:no-underline p-0 font-normal text-xs text-[#5F5F5F]">
                  View Breakdown
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="flex flex-col gap-1 pt-2">
                    <div className="flex gap-2 items-center">
                      <div>
                        <img src={RechargedBalance} alt="" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-normal text-[10px] text-[#5F5F5F]">
                          Recharged Balance
                        </p>
                        <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                          &#8377; 0
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-between">
                      <div className="flex gap-2 items-center">
                        <div>
                          <img src={TradingBalance} alt="" />
                        </div>
                        <div className="flex flex-col">
                          <p className="font-normal text-[10px] text-[#5F5F5F]">
                            Trading Balance
                          </p>
                          <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                            &#8377; 0
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#2C2D32]">
                          Cash out
                        </span>
                        <div>
                          <img src={QuickAction} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-white px-[13px] py-[15px] rounded-[5px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between w-full ">
              <div className="flex gap-2">
                <div className="rounded-[5px] p-2 bg-[#F6F6F6]">
                  <img src={Winnings} alt="" />
                </div>
                <div className="flex flex-col">
                  <p className="font-normal text-[10px] text-[#5F5F5F]">
                    Withdraw
                  </p>
                  <p className="text-[#2C2D32] text-sm font-semibold font-inter">
                    &#8377; 0
                  </p>
                </div>
              </div>

              <button className="bg-[#CBCBCB] rounded-[5px] px-[14.5px] py-2">
                <span className="text-white font-medium text-xs tracking-[1px]">
                  WITHDRAW
                </span>
              </button>
            </div>
          </div>
          <div>
            <Separator className="h-[0.7px]" />
          </div>
          <div className="flex justify-between items-center cursor-pointer">
            <div>
              <p className="font-normal text-xs text-[#5F5F5F]">
                Complete KYC to withdraw funds
              </p>
            </div>
            <div>
              <img src={QuickAction} className="w-3 h-3" alt="" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-white px-[13px] py-[15px] rounded-[5px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between w-full ">
              <div className="flex gap-2">
                <div className="rounded-[5px] p-2 bg-[#F3E5F6]">
                  <img src={Promotional} alt="" />
                </div>
                <div className="flex flex-col">
                  <p className="font-normal text-[10px] text-[#5F5F5F]">
                    Promotional
                  </p>
                  <p className="text-[#2C2D32] text-sm font-semibold font-inter">
                    &#8377; 0
                  </p>
                </div>
              </div>

              <button className="bg-white border rounded-full p-2 border-[#CBCBCB]">
                <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <h2 className="font-semibold text-sm text-[#2C2D32] px-4">
          Quick Actions
        </h2>
        <div className="flex flex-col bg-white mt-4">
          <div
            className="flex justify-between items-center p-4"
            onClick={() => {
              navigate('/transactions')
            }}
          >
            <div className="flex gap-2 items-center">
              <div className="rounded-full">
                <img src={TransactionHistory} alt="" />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-[#2C2D32]">
                  Transaction History
                </p>
                <p className="font-normal text-xs text-[#5F5F5F]">
                  For all balance debits & credits
                </p>
              </div>
            </div>
            <div>
              <img src={QuickAction} alt="" />
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border-t-[1px] border-[#CBCBCB]">
            <div className="flex gap-2 items-center">
              <div className="rounded-full">
                <img src={Vault} alt="" />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-[#2C2D32]">
                  ONO Vault
                </p>
                <p className="font-normal text-xs text-[#5F5F5F]">
                  For financial discipline
                </p>
              </div>
            </div>
            <div>
              <img src={QuickAction} alt="" />
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border-t-[1px] border-[#CBCBCB]">
            <div className="flex gap-2 items-center">
              <div className="rounded-full">
                <img src={KYC} alt="" />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-[#2C2D32]">
                  KYC Verification
                </p>
                <p className="font-normal text-xs text-[#5F5F5F]">
                  Tap to verify
                </p>
              </div>
            </div>
            <div>
              <img src={QuickAction} alt="" />
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border-t-[1px] border-[#CBCBCB]">
            <div className="flex gap-2 items-center">
              <div className="rounded-full">
                <img src={ControlCentre} alt="" />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-[#2C2D32]">
                  Control Centre
                </p>
                <p className="font-normal text-xs text-[#5F5F5F]">
                  Limits for responsible trading
                </p>
              </div>
            </div>
            <div>
              <img src={QuickAction} alt="" />
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border-t-[1px] border-[#CBCBCB]">
            <div className="flex gap-2 items-center">
              <div className="rounded-full">
                <img src={Statements} alt="" />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-[#2C2D32]">
                  Statements & Certificate
                </p>
                <p className="font-normal text-xs text-[#5F5F5F]">
                  For ledger and TDS certificates
                </p>
              </div>
            </div>
            <div>
              <img src={QuickAction} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance
