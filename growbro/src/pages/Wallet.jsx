import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
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
  ChevronUp,
  ChevronDown,
  Trophy,
  Gift,
  ArrowRight,
} from 'lucide-react'
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
  useFrappeGetCall,
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappeUpdateDoc,
} from 'frappe-react-sdk'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'motion/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// const formSchema = z.object({
//   pin: z
//     .string()
//     .length(4, 'PIN must be exactly 4 digits')
//     .regex(/^\d+$/, 'PIN must contain only digits'),
//   confirm_pin: z
//     .string()
//     .length(4, 'PIN must be exactly 4 digits')
//     .regex(/^\d+$/, 'PIN must contain only digits'),
// })

const DashboardCardContent = memo(({ className = '', children }) => {
  return <div className={`p-0 ${className}`}>{children}</div>
})

// Wallet Dashboard Component (memoized to prevent unnecessary re-renders)
const WalletDashboard = memo(() => {
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Memoize event handlers
  const handleRechargeClick = useCallback(() => {
    console.log('Recharge clicked')
  }, [])

  const handleWithdrawClick = useCallback(() => {
    console.log('Withdraw clicked')
  }, [])

  const handleKycClick = useCallback(() => {
    console.log('KYC verification clicked')
  }, [])

  const handlePromotionalClick = useCallback(() => {
    console.log('Promotional balance clicked')
  }, [])

  const toggleBreakdown = useCallback(() => {
    setShowBreakdown((prev) => !prev)
  }, [])

  // Memoize the formatting function
  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      notation: 'standard',
    })
      .format(amount)
      .replace('INR', '')
      .trim()
  }, [])

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="space-y-4 py-6">
        <h2 className="text-2xl font-bold text-center mb-6">Wallet Summary</h2>

        {/* Deposit Card */}
        <DashboardCard>
          <DashboardCardContent>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-xl p-3 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                    <Wallet className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Deposit
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {/* <span className="font-normal text-xl">₹</span> */}
                      {formatAmount(8.5)}
                    </h3>
                  </div>
                </div>
                <div>
                  <DashboardButton
                    variant="default"
                    size="lg"
                    onClick={handleRechargeClick}
                  >
                    Recharge
                  </DashboardButton>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={toggleBreakdown}
                className="flex items-center justify-center w-full py-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <span>View breakdown</span>
                {showBreakdown ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>

              {showBreakdown && (
                <div className="px-4 py-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Main Balance
                    </span>
                    <span className="font-medium">₹5.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Bonus
                    </span>
                    <span className="font-medium">₹3.5</span>
                  </div>
                </div>
              )}
            </div>
          </DashboardCardContent>
        </DashboardCard>

        {/* Winnings Card */}
        <DashboardCard>
          <DashboardCardContent>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-xl p-3 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
                    <Trophy className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Winnings
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {/* <span className="font-normal text-xl">₹</span> */}
                      {formatAmount(21.7)}
                    </h3>
                  </div>
                </div>
                <div>
                  <DashboardButton
                    variant="outline"
                    size="lg"
                    disabled={true}
                    onClick={handleWithdrawClick}
                  >
                    Withdraw
                  </DashboardButton>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleKycClick}
                className="w-full flex items-center justify-between py-4 px-5 text-left bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
              >
                <span className="text-sm font-medium text-amber-700 dark:text-amber-500">
                  Complete KYC to withdraw funds
                </span>
                <ChevronRight className="h-5 w-5 text-amber-500" />
              </button>
            </div>
          </DashboardCardContent>
        </DashboardCard>

        {/* Promotional Card */}
        <DashboardCard className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 hover:shadow-xl transition-shadow">
          <DashboardCardContent>
            <button
              onClick={handlePromotionalClick}
              className="w-full p-5 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-xl p-3 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                    <Gift className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Promotional
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {/* <span className="font-normal text-xl">₹</span> */}
                      {formatAmount(2.19)}
                    </h3>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                  <ArrowRight className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </button>
          </DashboardCardContent>
        </DashboardCard>
      </div>
    </div>
  )
})

// Main Wallet component
const WalletComponent = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [amount, setAmount] = useState('')
  const quickAmounts = [100, 500, 1000, 5000]
  const [open, setOpen] = useState(false)
  const { currentUser } = useFrappeAuth()
  const tab = searchParams.get('tab' || 'all')
  const [showBreakdown, setShowBreakdown] = useState(false)

  const handleTabChange = (newTab) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('tab', newTab) // update tab
    setSearchParams(newParams) // apply while preserving others
  }

  // console.log(currentUser)

  const {
    data: userWalletData,
    isLoading: userWalletLoading,
    mutate: refetchWalletData,
  } = useFrappeGetDoc(
    'User Wallet',
    currentUser,
    currentUser ? undefined : null
  )

  const {
    data: total,
    isLoading: totalLoading,
    mutate: refetchTotal,
  } = useFrappeGetCall(
    'rewardapp.wallet.get_deposit_and_withdrawal',
    currentUser ? undefined : null
  )

  // console.log('total: ', total)

  const {
    data: transactionHistory,
    isLoading: transactionHistoryLoading,
    mutate: refetchTransactionHistory,
  } = useFrappeGetDocList(
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
    tab === 'all' && currentUser ? undefined : null
  )

  const {
    data: depositsHistory,
    isLoading: depositsHistoryLoading,
    mutate: refetchDepositsHistory,
  } = useFrappeGetDocList(
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
        ['transaction_type', '=', 'Recharge'],
      ],
      limit: 10,
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
    },
    tab === 'deposits' && currentUser ? undefined : null
  )

  const {
    data: withdrawalsHistory,
    isLoading: withdrawalsHistoryLoading,
    mutate: refetchWithdrawalsHistory,
  } = useFrappeGetDocList(
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
        ['transaction_type', '=', 'Withdrawal'],
      ],
      limit: 10,
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
    },
    tab === 'withdrawals' && currentUser ? undefined : null
  )

  // useEffect(() => {
  //   setUserHistory(transactionHistory)
  // }, [transactionHistory])

  // useEffect(() => {
  //   setUserWithdrawals(withdrawalsHistory)
  // }, [withdrawalsHistory])

  // useEffect(() => {
  //   setUserDeposits(depositsHistory)
  // }, [depositsHistory])

  // useEffect(() => {
  //   setUserWallet(userWalletData)
  // }, [userWalletData])

  // async function handleAddMoney(data) {
  //   try {
  //     await updateDoc('User Wallet', currentUser, {
  //       balance: userWalletData.balance + parseFloat(amount),
  //     })
  //     await createDoc('Transaction Logs', {
  //       user: currentUser,
  //       transaction_amount: amount,
  //       transaction_type: 'Recharge',
  //       transaction_status: 'Success',
  //       transaction_method: 'UPI',
  //     })
  //     toast.success(`${amount} added to your wallet.`, {
  //       top: 0,
  //       right: 0,
  //     })

  //     setAmount(0)
  //     refetchTotal()
  //     refetchWalletData()
  //     activeTab === 'all'
  //       ? refetchTransactionHistory()
  //       : activeTab === 'deposits'
  //       ? refetchDepositsHistory()
  //       : refetchWithdrawalsHistory()
  //     setOpen(false)
  //   } catch (err) {
  //     console.log(err)
  //     toast.error('Failed to add money in the wallet.')
  //   }
  // }

  const handleQuickAmount = (value) => {
    setAmount(value.toString())
  }, [])

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      notation: 'standard',
    })
      .format(amount)
      .replace('INR', '')
      .trim()
  }, [])

  if (userWalletLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="spinner w-14 h-14 rounded-full border-4 border-gray-200 border-r-blue-500 animate-spin"></div>
      </div>
    )
  }

  // Define formatAmount here to avoid undefined reference in the transactions section
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      notation: 'standard',
    })
      .format(amount)
      .replace('INR', '')
      .trim()
  }

  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      {/* <div className="bg-indigo-600 pt-safe-top pb-8">
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

          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-medium">
                Available Balance
              </span>
              <WalletIcon className="h-5 w-5 text-white/90" />
            </div>
            <div className="text-4xl font-bold text-white mb-4">
              ₹{userWalletData?.balance}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/80 mb-1">Total Deposits</div>
                <div className="text-white font-semibold">
                  {total?.message?.reduce((acc, value) => {
                    if (value.transaction_type === 'Recharge') {
                      return acc + value.total_amount
                    }
                    return acc
                  }, 0)}
                </div>
              </div>
              <div>
                <div className="text-white/80 mb-1">Total Withdrawals</div>
                <div className="text-white font-semibold">
                  {total?.message?.reduce((acc, value) => {
                    if (value.transaction_type === 'Withdrawal') {
                      return acc + value.total_amount
                    }
                    return acc
                  }, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="w-full">
        <div className="space-y-4 py-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">Wallet</h2>
          </div>

          <Card className="overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-xl p-3 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                      <WalletIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Wallet Balance
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        <span className="font-normal text-xl"></span>
                        {formatAmount(userWalletData?.balance)}
                      </h3>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="default"
                      size="lg"
                      disabled
                      onClick={() => console.log('Recharge clicked')}
                      className="rounded-xl transition-all duration-300 font-medium bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                    >
                      Recharge
                    </Button>
                  </div>
                </div>
              </div>

              {/* <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex items-center justify-center w-full py-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  <span>View breakdown</span>
                  {showBreakdown ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </button>

                {showBreakdown && (
                  <div className="overflow-hidden">
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Main Balance
                        </span>
                        <span className="font-medium">₹5.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Bonus
                        </span>
                        <span className="font-medium">₹3.5</span>
                      </div>
                    </div>
                  </div>
                )}
              </div> */}
            </CardContent>
          </Card>

          {/* <Card className="overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-xl p-3 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
                      <Trophy className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Winnings
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        <span className="font-normal text-xl"></span>
                        {formatAmount(21.7)}
                      </h3>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={true}
                      onClick={() => console.log('Withdraw clicked')}
                      className="rounded-xl transition-all duration-300 font-medium border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => console.log('KYC verification clicked')}
                  className="w-full flex items-center justify-between py-4 px-5 text-left bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
                >
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-500">
                    Complete KYC to withdraw funds
                  </span>
                  <ChevronRight className="h-5 w-5 text-amber-500" />
                </button>
              </div>
            </CardContent>
          </Card> */}

          {/* <div>
            <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <button
                  onClick={() => console.log('Promotional balance clicked')}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-xl p-3 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                        <Gift className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Promotional
                        </p>
                        <h3 className="text-2xl font-bold mt-1">
                          <span className="font-normal text-xl"></span>
                          {formatAmount(2.19)}
                        </h3>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                      <ArrowRight className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>

      {/* Wallet Dashboard Component */}
      <WalletDashboard />

      {/* Content Section */}
      <div className="">
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
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    if (e.target.value >= 0) setAmount(e.target.value)
                  }}
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

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="w-full">
                <Button
                  className="bg-secondary w-full hover:bg-secondary/90"
                  disabled={amount <= 0}
                >
                  Add Money
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Transactions Section */}
          <div className="flex flex-col gap-2 p-2">
            <div className="flex p-2">
              <button
                onClick={() => {
                  handleTabChange('all')
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  tab === 'all'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  handleTabChange('deposits')
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  tab === 'deposits'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => {
                  handleTabChange('withdrawals')
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  tab === 'withdrawals'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Withdrawals
              </button>
            </div>

            {/* <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
            </div> */}

            <div className="">
              {tab === 'all' ? (
                transactionHistory?.length > 0 ? (
                  <div className="p-2 text-sm font-medium text-gray-700">
                    Recent Transactions
                  </div>
                ) : (
                  <div className="p-2 flex justify-center text-sm font-medium text-gray-700">
                    No transactions history.
                  </div>
                )
              ) : null}
              {tab === 'deposits' ? (
                depositsHistory?.length > 0 ? (
                  <div className="p-2 text-sm font-medium text-gray-700">
                    Recent Transactions
                  </div>
                ) : (
                  <div className="p-2 flex justify-center text-sm font-medium text-gray-700">
                    No deposits history.
                  </div>
                )
              ) : null}
              {tab === 'withdrawals' ? (
                withdrawalsHistory?.length > 0 ? (
                  <div className="p-2 text-sm font-medium text-gray-700">
                    Recent Transactions
                  </div>
                ) : (
                  <div className="p-2 flex justify-center text-sm font-medium text-gray-700">
                    No withdrawals history.
                  </div>
                )
              ) : null}
              {tab === 'all' &&
                transactionHistory?.map((transaction) => {
                  console.log('Transaction:', transaction)

                  if (
                    transaction.transaction_type === 'Withdrawal' ||
                    transaction.transaction_type === 'Recharge'
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
                                {transaction.transaction_type === 'Recharge'
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

              {tab === 'deposits' &&
                depositsHistory?.map((transaction) => {
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
                    </div>
                  )
                })}
              {tab === 'withdrawals' &&
                withdrawalsHistory?.map((transaction) => {
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
                  </div>
                ))}

              {tab === 'withdrawals' &&
                withdrawalsHistory?.map((transaction) => (
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
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletComponent
