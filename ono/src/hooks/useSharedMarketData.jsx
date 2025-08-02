import { useFrappeGetDocList } from 'frappe-react-sdk'

export const useSharedMarketData = () => {
  const { data: marketData, isLoading: marketDataLoading } =
    useFrappeGetDocList(
      'Market',
      {
        fields: [
          'name',
          'question',
          'category',
          'yes_price',
          'no_price',
          'closing_time',
          'status',
          'total_traders',
        ],
        filters: [['status', '=', 'OPEN']],
        orderBy: {
          field: 'total_traders',
          order: 'desc',
        },
        limit: 5,
      },
      'market_data_shared', // 🔥 Custom shared SWR key
      {
        revalidateOnMount: true, // 🔥 must be true to fetch if no cache
        revalidateOnFocus: false,
        revalidateIfStale: true,
      }
    )
  return { marketData, marketDataLoading }
}
