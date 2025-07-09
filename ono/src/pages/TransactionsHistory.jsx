const TransactionHistory = () => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen">
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
          <p className="font-[500] text-lg">
            Event {market?.name?.split('_')[2]}
          </p>
        </div>

        <div>
          <img src={ShareAndroid} alt="" />
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
