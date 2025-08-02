import Back from '@/assets/Back.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import AccountTransactions from '../components/AccountTransactions'
import RechargeTransactions from '../components/RechargeTransactions'
import WithdrawTransactions from '../components/WithdrawTransactions'
import { useNavigate } from 'react-router-dom'

const TransactionHistory = () => {
  const navigate = useNavigate()

  const [currentTransactionTab, setCurrentTransactionTab] = useState(
    localStorage.getItem('currentTransactionTab' || 'withdraw')
  )
  const handleTabChange = (value) => {
    localStorage.setItem('currentTransactionTab', value)
    setCurrentTransactionTab(value)
  }
  return (
    <div className="bg-white min-h-screen pb-2 h-full select-none">
      <div className="sticky top-0 z-[51]">
        <div className="h-12 select-none w-full p-4 border-[0.33px] border-b border-x-0 border-t-0 flex justify-between items-center gap-4 border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
          <div className="flex items-center gap-3">
            <img
              src={Back}
              alt=""
              className="cursor-pointer h-4 w-4"
              onClick={() => {
                navigate(-1)
              }}
            />
            <p className="font-medium text-lg text-[#2C2D32]">
              Transactions History
            </p>
          </div>
        </div>
        <Tabs
          value={currentTransactionTab}
          onValueChange={handleTabChange}
          className="w-full font-[500] text-xs"
        >
          <div className="w-full bg-white py-2">
            <TabsList className="w-full space-x-2 p-0 bg-white">
              <TabsTrigger
                value="account"
                className="text-sm text-[#2C2D32] font-medium py-2.5 w-full space-x-2 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                value="recharge"
                className="text-sm text-[#2C2D32] font-medium py-2.5 w-full space-x-2 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                Recharge
              </TabsTrigger>
              <TabsTrigger
                value="withdraw"
                className="text-sm text-[#2C2D32] font-medium py-2.5 w-full space-x-2 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                Withdraw
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
      {currentTransactionTab === 'account' && <AccountTransactions />}
      {currentTransactionTab === 'recharge' && <RechargeTransactions />}
      {currentTransactionTab === 'withdraw' && <WithdrawTransactions />}
    </div>
  )
}

export default TransactionHistory
