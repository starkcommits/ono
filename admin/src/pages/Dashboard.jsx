import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  useFrappeGetDocCount,
  useFrappeGetDocList,
  useFrappeUpdateDoc,
} from 'frappe-react-sdk'
import { Ellipsis, MoreHorizontal, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { data: marketCount, isLoading: marketCountLoading } =
    useFrappeGetDocCount('Market')
  const { data: orderCount, isLoading: orderCountLoading } =
    useFrappeGetDocCount('Orders')
  const { data: tradesCount, isLoading: tradesCountLoading } =
    useFrappeGetDocCount('Trades')
  const { data: holdingCount, isLoading: holdingCountLoading } =
    useFrappeGetDocCount('Holding')

  const { data: usersData, isLoading: usersDataLoading } = useFrappeGetDocList(
    'User',
    {
      fields: ['*'],
    }
  )

  const { updateDoc } = useFrappeUpdateDoc()

  const {
    data: marketData,
    isLoading: marketDataLoading,
    mutate: refetchMarketData,
  } = useFrappeGetDocList('Market', {
    fields: ['name', 'question', 'yes_price', 'no_price', 'total_traders'],
    filters: [['status', '=', 'OPEN']],
  })

  const handlePauseMarket = () => {}

  const handleCloseMarket = async (market_id) => {
    try {
      const response = await updateDoc('Market', market_id, {
        status: 'CLOSED',
      })
      console.log('Response', response)
      toast.success('Market closed successfully')
      refetchMarketData()
    } catch (err) {
      console.log(err)
      toast.error('Error closing market. Please try again after some time.')
    }
  }

  console.log('USers', usersData)

  return (
    <div className="py-2 flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <Card className="py-4">
          <CardHeader>
            <div className="flex flex-col gap-3 items-center">
              <CardTitle className="font-semibold text-4xl">
                {!marketCountLoading && marketCount}
              </CardTitle>
              <CardDescription className="font-medium tracking-wide text-md">
                Total Markets
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="py-4">
          <CardHeader>
            <div className="flex flex-col gap-3 items-center">
              <CardTitle className="font-semibold text-4xl">
                {!orderCountLoading && orderCount}
              </CardTitle>
              <CardDescription className="font-medium tracking-wide text-md">
                Total Orders
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="py-4">
          <CardHeader>
            <div className="flex flex-col gap-3 items-center">
              <CardTitle className="font-semibold text-4xl">
                {!tradesCountLoading && tradesCount}
              </CardTitle>
              <CardDescription className="font-medium tracking-wide text-md">
                Total Trades
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="py-4">
          <CardHeader>
            <div className="flex flex-col gap-3 items-center">
              <CardTitle className="font-semibold text-4xl">
                {!holdingCountLoading && holdingCount}
              </CardTitle>
              <CardDescription className="font-medium tracking-wide text-md">
                Total Holding
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="py-4">
          <CardHeader>
            <div className="flex flex-col gap-3 items-center">
              <CardTitle className="font-semibold text-4xl">
                {!usersDataLoading &&
                  usersData?.length > 0 &&
                  usersData?.reduce((acc, user) => {
                    if (user.role_profile_name === 'Trader') {
                      acc = acc + 1
                    }
                    return acc
                  }, 0)}
              </CardTitle>
              <CardDescription className="font-medium tracking-wide text-md">
                Total Markets
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Trending Markets</CardTitle>
            <CardDescription>
              The most active markets based on recent trades and user
              engagement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {marketData?.length > 0 &&
              marketData?.map((market) => {
                return (
                  <div
                    key={market.name}
                    className="market-card cursor-pointer border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                  >
                    <div className="">
                      <div className="p-4">
                        <h3 className="text-base font-medium mb-2 flex gap-2 justify-between">
                          <span>{market?.question}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">
                                  <Ellipsis className="h-4 w-4" />
                                </span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={handlePauseMarket}>
                                Pause Market
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleCloseMarket(market.name)
                                }}
                              >
                                Close Market
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center text-xs text-gray-600">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            {/* <span>{market.traders.toLocaleString()} traders</span> */}
                            <span>{market?.total_traders} traders</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse mr-1"></div>
                            LIVE
                          </span>
                        </div>
                        {/* <p className="text-xs text-gray-600 mb-4">{market.info}</p> */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="py-2 px-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
                            Yes ₹{market?.yes_price}
                          </div>
                          <div className="py-2 px-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">
                            No ₹{market?.no_price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A live feed of the latest trades, orders, and user actions across
              all markets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="">
              <Table>
                <TableHeader>   
                  <TableRow>
                    <TableHead>Trade ID</TableHead>
                    <TableHead>Yes Price</TableHead>
                    <TableHead>No Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                {!recentTradesLoading && recentTradesData?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 font-medium"
                    >
                      No trades done yet.
                    </TableCell>
                  </TableRow>
                )}
                <TableBody>
                  {!recentTradesLoading &&
                    recentTradesData?.length > 0 &&
                    recentTradesData?.slice(0, 10)?.map((trade) => (
                      <TableRow key={trade.name}>
                        <TableCell>{`#${
                          trade?.name?.split('_')[2]
                        }`}</TableCell>
                        <TableCell className="text-blue-500">
                          {trade?.first_user_price}
                        </TableCell>
                        <TableCell className="text-red-500">
                          {trade?.second_user_price}
                        </TableCell>
                        <TableCell>{trade?.quantity}</TableCell>
                        <TableCell>
                          {trade?.creation
                            ?.split(' ')[0]
                            ?.split('-')
                            ?.reverse()
                            ?.join('-')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default Dashboard
