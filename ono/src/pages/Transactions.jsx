import Back from '@/assets/Back.svg'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk'
import { useEffect, useRef, useState } from 'react'
import NoTransactionsIcon from '@/assets/NoTransactionsIcon.svg'
import { useNavigate } from 'react-router-dom'

const Transactions = () => {
  const navigate = useNavigate()

  const { currentUser } = useFrappeAuth()

  const [currentTransactionTab, setCurrentTransactionTab] = useState('all')
  const handleTabChange = (value) => {
    setCurrentTransactionTab(value)
  }
  const { data: accountTransactionsAll } = useFrappeGetDocList(
    'Transaction Logs',
    {
      fields: ['*'],
      filters: [['user', '=', currentUser]],
    },
    currentTransactionTab === 'all' && currentUser ? undefined : null
  )
  const tabKeys = ['all', 'debit', 'credit']
  const tabRefs = tabKeys.reduce((acc, key) => {
    acc[key] = useRef(null)
    return acc
  }, {})

  useEffect(() => {
    if (tabRefs[currentTransactionTab]?.current) {
      tabRefs[currentTransactionTab].current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [currentTransactionTab])

  const formatFrappeDateTime = (timestamp) => {
    const date = new Date(timestamp)

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }

    return date.toLocaleString('en-US', options)
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
        <div className="w-full overflow-x-auto scrollbar-hide bg-white">
          <Tabs
            value={currentTransactionTab}
            onValueChange={handleTabChange}
            className="w-full py-4 font-[500] text-xs"
          >
            <div className="">
              <TabsList className="flex flex-nowrap w-max rounded-full space-x-2 bg-transparent text-[#2C2D32] p-0 h-6 px-4">
                {['all', 'credit', 'debit'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    ref={tabRefs[tab]}
                    className={`flex items-center flex-shrink-0 px-5 py-1.5 space-x-2 rounded-full data-[state=active]:bg-[#E26F64] border-[0.5px] data-[state=active]:text-white border-[#CBCBCB] bg-white data-[state=active]:border-[0.7px] data-[state=active]:border-none font-normal h-auto`}
                  >
                    <span className="whitespace-nowrap capitalize text-sm font-normal">
                      {tab}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
      {currentTransactionTab === 'all' &&
        accountTransactionsAll?.length === 0 && (
          <div className="w-full min-h-[400px] flex flex-col gap-6 items-center justify-center">
            <div>
              <img src={NoTransactionsIcon} alt="" />
            </div>
            <p className="font-normal text-[18px] text-[#2C2D32]">
              No Transaction yet!
            </p>
          </div>
        )}
      {currentTransactionTab === 'all' &&
        accountTransactionsAll?.length > 0 &&
        accountTransactionsAll?.map((transaction, index) => (
          <div
            className={`px-4 py-4    pt-4 first:pt-2 flex items-center justify-between border-b border-dashed border-[#CBCBCB] ${
              index === accountTransactionsAll?.length - 1 ? 'border-b-0' : ''
            }`}
            key={transaction.name}
            style={{
              strokeDasharray: '2, 2',
            }}
          >
            <div className="flex flex-col items-start gap-2.5 w-[50%]">
              <p className="font-normal text-sm text-[#2C2D32]">
                {transaction.question}
              </p>
              <p className="text-[#5F5F5F] text-xs font-normal">
                {formatFrappeDateTime(transaction.creation)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2.5 w-[50%]">
              {transaction.transaction_type === 'Debit' ? (
                <p className="font-semibold text-[13px] text-[#DB342C] font-inter">
                  -&#8377;{transaction.transaction_amount}
                </p>
              ) : null}
              {transaction.transaction_type === 'Credit' ? (
                <p className="font-semibold text-[13px] text-[#1C895E] font-inter">
                  +&#8377;{transaction.transaction_amount}
                </p>
              ) : null}

              <p className="bg-[linear-gradient(270deg,_#FFD8D4_0%,_#FFFFFF_100%)] text-[10px] font-normal py-[2px] px-[8px]">
                Promotional
              </p>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Transactions
