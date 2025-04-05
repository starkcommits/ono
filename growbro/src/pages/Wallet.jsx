import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Wallet as WalletIcon,
  CreditCard,
  BanIcon as BankIcon,
  ArrowUpRight,
  Clock,
  ArrowDownLeft,
  Filter,
  ChevronRight,
  Plus,
  Accessibility,
  StethoscopeIcon,
  CircleX,
  Check,
} from 'lucide-react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  useFrappeAuth,
  useFrappeCreateDoc,
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappeUpdateDoc,
} from 'frappe-react-sdk'
import toast from 'react-hot-toast'
import EnterWalletPIN from '../components/EnterWalletPIN'
import CreateWalletPIN from '../components/CreateWalletPIN'

const formSchema = z.object({
  pin: z
    .string()
    .length(4, 'PIN must be exactly 4 digits')
    .regex(/^\d+$/, 'PIN must contain only digits'),
  confirm_pin: z
    .string()
    .length(4, 'PIN must be exactly 4 digits')
    .regex(/^\d+$/, 'PIN must contain only digits'),
})

const Wallet = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const quickAmounts = [100, 500, 1000, 5000]
  const [userWallet, setUserWallet] = useState({})
  const [userHistory, setUserHistory] = useState([])
  const [userWithdrawals, setUserWithdrawals] = useState([])
  const [userDeposits, setUserDeposits] = useState([])
  const [open, setOpen] = useState(false)
  const { currentUser } = useFrappeAuth()
  const { createDoc } = useFrappeCreateDoc()
  const { updateDoc } = useFrappeUpdateDoc()

  console.log(currentUser)

  const {
    data: userWalletData,
    isLoading: userWalletLoading,
    mutate: refetchWalletData,
  } = useFrappeGetDoc(
    'User Wallet',
    currentUser,
    currentUser ? undefined : null
  )

  const { data: transactionHistory, isLoading: transactionHistoryLoading } =
    useFrappeGetDocList(
      'Transaction Logs',
      {
        fields: [
          'name',
          'transaction_amount',
          'transaction_type',
          'question',
          'creation',
          'transaction_method',
          'transaction_status',
        ],
        filters: [['owner', '=', currentUser]],
        limit: 10,
        orderBy: {
          field: 'creation',
          order: 'desc',
        },
      },
      activeTab === 'all' && currentUser ? undefined : null
    )

  const { data: depositsHistory, isLoading: depositsHistoryLoading } =
    useFrappeGetDocList(
      'Transaction Logs',
      {
        fields: [
          'name',
          'transaction_amount',
          'transaction_type',
          'creation',
          'transaction_status',
          'transaction_method',
        ],
        filters: [
          ['owner', '=', currentUser],
          ['transaction_type', '=', 'RECHARGE'],
        ],
        limit: 10,
        orderBy: {
          field: 'creation',
          order: 'desc',
        },
      },
      activeTab === 'deposits' && currentUser ? undefined : null
    )

  const { data: withdrawalsHistory, isLoading: withdrawalsHistoryLoading } =
    useFrappeGetDocList(
      'Transaction Logs',
      {
        fields: [
          'name',
          'transaction_amount',
          'transaction_type',
          'creation',
          'transaction_status',
          'transaction_method',
        ],
        filters: [
          ['owner', '=', currentUser],
          ['transaction_type', '=', 'WITHDRAWAL'],
        ],
        limit: 10,
        orderBy: {
          field: 'creation',
          order: 'desc',
        },
      },
      activeTab === 'withdrawals' && currentUser ? undefined : null
    )

  useEffect(() => {
    setUserHistory(transactionHistory)
  }, [transactionHistory])

  useEffect(() => {
    setUserWithdrawals(withdrawalsHistory)
  }, [withdrawalsHistory])

  useEffect(() => {
    setUserDeposits(depositsHistory)
  }, [depositsHistory])

  useEffect(() => {
    setUserWallet(userWalletData)
  }, [userWalletData])

  const transactions = [
    {
      id: '1',
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      method: 'UPI',
      timestamp: '2024-03-05T14:30:00Z',
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 500,
      status: 'pending',
      method: 'Bank Transfer',
      timestamp: '2024-03-05T12:15:00Z',
    },
    {
      id: '3',
      type: 'deposit',
      amount: 2000,
      status: 'completed',
      method: 'Credit Card',
      timestamp: '2024-03-04T18:45:00Z',
    },
  ]

  async function handleAddMoney(data) {
    try {
      await updateDoc('User Wallet', currentUser, {
        balance: userWalletData.balance + parseFloat(amount),
      })
      await createDoc('Transaction Logs', {
        user: currentUser,
        transaction_amount: amount,
        transaction_type: 'RECHARGE',
        transaction_status: 'Success',
        transaction_method: 'UPI',
      })
      toast.success(`${amount} added to your wallet.`, {
        top: 0,
        right: 0,
      })

      setAmount(0)
      refetchWalletData()
      setOpen(false)
    } catch (err) {
      console.log(err)
      toast.error('Failed to add money in the wallet.')
    }
  }

  const handleQuickAmount = (value) => {
    setAmount(value.toString())
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      <div className="bg-indigo-600 pt-safe-top pb-8">
        <div className="px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Wallet</h1>
          </div>

          {/* Balance Card */}
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-medium">
                Available Balance
              </span>
              <WalletIcon className="h-5 w-5 text-white/90" />
            </div>
            <div className="text-4xl font-bold text-white mb-4">
              ₹{userWallet?.balance}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/80 mb-1">Total Deposits</div>
                <div className="text-white font-semibold"></div>
              </div>
              <div>
                <div className="text-white/80 mb-1">Total Withdrawals</div>
                <div className="text-white font-semibold">₹3,765.44</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-sm">
          {/* Add Money Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Money</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Quick Add
              </label>
              <div className="grid grid-cols-4 gap-3">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuickAmount(value)}
                    className="py-2 px-3 bg-gray-50 rounded-xl text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    ₹{value}
                  </button>
                ))}
              </div>
            </div>
            {/* 
            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3" />
                  <span className="font-medium">Credit/Debit Card</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <div className="flex items-center">
                  <BankIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">UPI/Net Banking</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div> */}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="w-full">
                <Button
                  className="bg-secondary w-full hover:bg-secondary/90"
                  disabled={!amount}
                >
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to add money in your wallet?
                  </DialogTitle>
                  <DialogDescription>
                    Press the button to confirm it.
                  </DialogDescription>

                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleAddMoney}
                      className="bg-secondary hover:bg-secondary/90"
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {/* Transactions Section */}
          <div>
            <div className="flex p-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('deposits')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'deposits'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'withdrawals'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Withdrawals
              </button>
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="text-sm font-medium text-gray-700">
                Recent Transactions
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="mb-20">
              {activeTab === 'all' &&
                userHistory?.map((transaction) => {
                  console.log('Transaction:', transaction)

                  if (
                    transaction.transaction_type === 'WITHDRAWAL' ||
                    transaction.transaction_type === 'RECHARGE'
                  ) {
                    return (
                      <div
                        key={transaction.name}
                        className="divide-y divide-gray-100"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-xl bg-emerald-50 text-emerald-600`}
                              >
                                {transaction.transaction_status ===
                                'Success' ? (
                                  <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                  <CircleX className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  Money Added
                                </div>
                                <div className="text-sm text-gray-500">
                                  {transaction.transaction_method}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium `}>
                                {transaction.transaction_type === 'RECHARGE'
                                  ? '+'
                                  : '-'}
                                ₹{transaction.transaction_amount}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <span className={'text-neutral-600'}>
                                  {transaction.transaction_status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(transaction.creation)}
                          </div>
                        </div>
                      </div>
                    )
                  } else
                    return (
                      <div
                        key={transaction.name}
                        className="divide-y divide-gray-100"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-xl bg-emerald-50 text-emerald-600`}
                              >
                                <ArrowDownLeft className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {transaction.question}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {transaction.transaction_method}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium`}>
                                {transaction.transaction_type === 'CREDIT'
                                  ? '+'
                                  : '-'}
                                ₹{transaction.transaction_amount}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <span className={'text-neutral-600'}>
                                  {transaction.transaction_status
                                    .charAt(0)
                                    .toUpperCase() +
                                    transaction.transaction_status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(transaction.creation)}
                          </div>
                        </div>
                      </div>
                    )
                })}

              {activeTab === 'deposits' &&
                userDeposits?.map((transaction) => {
                  console.log('Transaction:', transaction)
                  return (
                    <div
                      key={transaction.name}
                      className="divide-y divide-gray-100"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-xl bg-emerald-50 text-emerald-600`}
                            >
                              <ArrowDownLeft className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Money Added
                              </div>
                              <div className="text-sm text-gray-500">
                                {transaction.transaction_method}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium`}>
                              {'+'}₹{transaction.transaction_amount}
                            </div>
                            <div className="flex items-center text-xs text-neutral-600">
                              <span className={''}>
                                {transaction.transaction_status
                                  .charAt(0)
                                  .toUpperCase() +
                                  transaction.transaction_status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(transaction.creation)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              {activeTab === 'withdrawals' &&
                userWithdrawals?.map((transaction) => {
                  console.log('Transaction:', transaction)
                  return (
                    <div
                      key={transaction.name}
                      className="divide-y divide-gray-100"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-xl bg-emerald-50 text-emerald-600`}
                            >
                              <ArrowUpRight className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Money Added
                              </div>
                              <div className="text-sm text-gray-500">
                                {transaction.transaction_method}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium`}>
                              {'-'}₹{transaction.transaction_amount}
                            </div>
                            <div className="flex items-center text-xs text-neutral-600">
                              <span className={''}>
                                {transaction.transaction_status
                                  .charAt(0)
                                  .toUpperCase() +
                                  transaction.transaction_status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(transaction.creation)}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet
