import React, { useEffect, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk'
import NoTransactionsIcon from '@/assets/NoTransactionsIcon.svg'

const AccountTransactions = () => {
  const [currentAccountTab, setCurrentAccountTab] = useState('all')

  const { currentUser } = useFrappeAuth()

  const { data: accountTransactionsAll } = useFrappeGetDocList(
    'Transaction Logs',
    {
      fields: ['*'],
      filters: [['user', '=', currentUser]],
    },
    currentAccountTab === 'all' && currentUser ? undefined : null
  )

  const { data: accountTransactionsCredit } = useFrappeGetDocList(
    'Transaction Logs',
    {
      fields: ['*'],
      filters: [
        ['user', '=', currentUser],
        ['transaction_type', '=', 'Credit'],
      ],
    },
    currentAccountTab === 'credit' && currentUser ? undefined : null
  )
  const { data: accountTransactionsDebit } = useFrappeGetDocList(
    'Transaction Logs',
    {
      fields: ['*'],
      filters: [
        ['user', '=', currentUser],
        ['transaction_type', '=', 'Debit'],
      ],
    },
    currentAccountTab === 'debit' && currentUser ? undefined : null
  )

  const tabKeys = ['all', 'debit', 'credit']
  const tabRefs = tabKeys.reduce((acc, key) => {
    acc[key] = useRef(null)
    return acc
  }, {})

  useEffect(() => {
    if (tabRefs[currentAccountTab]?.current) {
      tabRefs[currentAccountTab].current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [currentAccountTab])

  const handleTabChange = (value) => {
    setCurrentAccountTab(value)
  }

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
    <div className="space-y-2 w-full h-full">
      <div className="w-full overflow-x-auto scrollbar-hide sticky top-0">
        <Tabs
          value={currentAccountTab}
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
      <div className="flex flex-col gap-4 px-4 w-full h-full">
        {currentAccountTab === 'all' &&
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
        {currentAccountTab === 'all' &&
          accountTransactionsAll?.length > 0 &&
          accountTransactionsAll?.map((transaction, index) => (
            <div
              className={`py-4 pt-2 flex items-center justify-between border-b border-dashed border-[#CBCBCB] ${
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
        {currentAccountTab === 'credit' &&
          accountTransactionsCredit?.length === 0 && (
            <div className="w-full min-h-[400px] flex flex-col gap-6 items-center justify-center">
              <div>
                <img src={NoTransactionsIcon} alt="" />
              </div>
              <p className="font-normal text-[18px] text-[#2C2D32]">
                No Transaction yet!
              </p>
            </div>
          )}
        {currentAccountTab === 'credit' &&
          accountTransactionsCredit?.map((transaction, index) => (
            <div
              className={`py-4 pt-2 flex items-center justify-between border-b border-dashed border-[#CBCBCB] ${
                index === accountTransactionsCredit?.length - 1
                  ? 'border-b-0'
                  : ''
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
        {currentAccountTab === 'debit' &&
          accountTransactionsDebit?.length === 0 && (
            <div className="w-full min-h-[400px] flex flex-col gap-6 items-center justify-center">
              <div>
                <img src={NoTransactionsIcon} alt="" />
              </div>
              <p className="font-normal text-[18px] text-[#2C2D32]">
                No Transaction yet!
              </p>
            </div>
          )}
        {currentAccountTab === 'debit' &&
          accountTransactionsDebit?.map((transaction, index) => (
            <div
              className={`py-4 pt-2 flex items-center justify-between border-b border-dashed border-[#CBCBCB] ${
                index === accountTransactionsDebit?.length - 1
                  ? 'border-b-0'
                  : ''
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

                <p className="bg-[linear-gradient(270deg,_#FFD8D4_0%,_#FFFFFF_100%)] text-[10px] font-normal py-[2px] px-[8px]">
                  Promotional
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default AccountTransactions
