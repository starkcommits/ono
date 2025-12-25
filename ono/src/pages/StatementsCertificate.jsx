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
import WalletHistory from '@/assets/WalletHistory.svg'
import TDSCertificate from '@/assets/TDSCertificate.svg'
import BalanceStatement from '@/assets/BalanceStatement.svg'
import Right from '@/assets/Right.svg'

import QuickAction from '@/assets/QuickAction.svg'

import { NumberTicker } from '../components/ui/number-ticker'
import TradingBalance from '@/assets/TradingBalance.svg'
import RechargedBalance from '@/assets/RechargedBalance.svg'
import TransactionHistory from '@/assets/TransactionHistory.svg'

import { useFrappeAuth, useFrappeGetDoc } from 'frappe-react-sdk'

const StatementsCertificate = () => {
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
      <div className="flex flex-col gap-4 pt-4 bg-white">
        <div className="flex justify-between items-center border-b p-4 pt-0">
          <div className="flex gap-4 items-center ">
            <div>
              <img src={BalanceStatement} alt="" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-normal text-[#2C2D32]">
                Balance Statement
              </p>
              <p className="text-xs font-normal text-[#5F5F5F]">
                Up to last financial year
              </p>
            </div>
          </div>
          <div>
            <img src={Right} alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center border-b p-4 pt-0">
          <div className="flex gap-4 items-center">
            <div>
              <img src={TDSCertificate} alt="" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-normal text-[#2C2D32]">
                TDS Certificate
              </p>
              <p className="text-xs font-normal text-[#5F5F5F]">
                Download in PDF format
              </p>
            </div>
          </div>
          <div>
            <img src={Right} alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center p-4 pt-0">
          <div className="flex gap-4 items-center">
            <div>
              <img src={WalletHistory} alt="" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-normal text-[#2C2D32]">
                Wallet History
              </p>
              <p className="text-xs font-normal text-[#5F5F5F]">
                Download the file
              </p>
            </div>
          </div>
          <div>
            <img src={Right} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatementsCertificate
