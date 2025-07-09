const ResolvedMarketHoldings = ({ marketPrices }) => {
  return (
    <div className="leading-[100%] bg-[#F5F5F5] w-full">
      {/* <div className="sticky z-[50] top-0 left-0 right-0 flex flex-col font-inter max-w-md mx-auto pt-4 bg-white mb-auto w-full select-none">
        <div className="border-[0.33px] border-x-0 border-t-0 border-b border-[#DBC5F7] w-full flex justify-start items-center pb-4 px-4">
          <h1 className="text-xl font-[500] text-[#2C2D32] ">
            <img
              src={Back}
              alt=""
              onClick={() => {
                navigate(-1)
              }}
              className="cursor-pointer w-4 h-4"
            />
          </h1>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-4 items-center pb-8 pt-6">
          <div>
            <img src={CricketImage} alt="" />
          </div>
          <div>
            <p className="font-normal text-sm text-[#2C2D32]">
              Hyderabad to win the match vs Mumbai?
            </p>
          </div>
          <div>
            <p className="text-xs font-normal text-[#5F5F5F]">
              THE MARKET PREDICTS
            </p>
          </div>
          <div>
            <p className="font-normal text-[22px] text-[#492C82]">
              {marketPrices.market_yes_price * 10}% probability of YES
            </p>
          </div>
        </div>
        <div className="p-4 pt-0">
          <div className="flex flex-col gap-4 items-center p-4 rounded-[5px] bg-white">
            <div className="flex flex-col gap-1 items-center">
              <p className="font-normal text-xs">Live Returns</p>
              {openMarketHoldings?.reduce((acc, holding) => {
                if (holding.opinion_type === 'YES') {
                  acc =
                    acc +
                    marketPrices.market_yes_price *
                      (holding.quantity - holding.filled_quantity) -
                    holding.price * (holding.quantity - holding.filled_quantity)
                } else {
                  acc =
                    acc +
                    marketPrices.market_no_price *
                      (holding.quantity - holding.filled_quantity) -
                    holding.price * (holding.quantity - holding.filled_quantity)
                }
                return acc
              }, 0) === 0 && (
                <p className="flex items-center gap-1">
                  <span className="font-inter font-semibold text-sm">
                    &#8377;
                    {openMarketHoldings
                      ?.reduce((acc, holding) => {
                        if (holding.opinion_type === 'YES') {
                          acc =
                            acc +
                            marketPrices.market_yes_price *
                              (holding.quantity - holding.filled_quantity) -
                            holding.price *
                              (holding.quantity - holding.filled_quantity)
                        } else {
                          acc =
                            acc +
                            marketPrices.market_no_price *
                              (holding.quantity - holding.filled_quantity) -
                            holding.price *
                              (holding.quantity - holding.filled_quantity)
                        }
                        return acc
                      }, 0)
                      .toFixed(1)}
                  </span>
                </p>
              )}
              {openMarketHoldings?.reduce((acc, holding) => {
                if (holding.opinion_type === 'YES') {
                  acc =
                    acc +
                    marketPrices.market_yes_price *
                      (holding.quantity - holding.filled_quantity) -
                    holding.price * (holding.quantity - holding.filled_quantity)
                } else {
                  acc =
                    acc +
                    marketPrices.market_no_price *
                      (holding.quantity - holding.filled_quantity) -
                    holding.price * (holding.quantity - holding.filled_quantity)
                }
                return acc
              }, 0) > 0 && (
                <p className="flex items-center gap-1">
                  <span>
                    <img className="" src={UpArrowIcon} alt="" />
                  </span>
                  <span className="font-inter font-semibold text-sm text-[#337265]">
                    &#8377;
                    {openMarketHoldings
                      ?.reduce((acc, holding) => {
                        if (holding.opinion_type === 'YES') {
                          acc =
                            acc +
                            marketPrices.market_yes_price *
                              (holding.quantity - holding.filled_quantity) -
                            holding.price *
                              (holding.quantity - holding.filled_quantity)
                        } else {
                          acc =
                            acc +
                            marketPrices.market_no_price *
                              (holding.quantity - holding.filled_quantity) -
                            holding.price *
                              (holding.quantity - holding.filled_quantity)
                        }
                        return acc
                      }, 0)
                      .toFixed(1)}
                  </span>
                </p>
              )}
              {openMarketHoldings?.reduce((acc, holding) => {
                if (holding.opinion_type === 'YES') {
                  acc =
                    acc +
                    marketPrices.market_yes_price *
                      (holding.quantity - holding.filled_quantity) -
                    holding.price * (holding.quantity - holding.filled_quantity)
                } else {
                  acc =
                    acc +
                    marketPrices.market_no_price *
                      (holding.quantity - holding.filled_quantity) -
                    holding.price * (holding.quantity - holding.filled_quantity)
                }
                return acc
              }, 0) < 0 && (
                <p className="flex items-center gap-1">
                  <span>
                    <img src={DownArrowIcon} alt="" />
                  </span>
                  <span className="font-inter font-semibold text-sm text-[#E26F64]">
                    &#8377;
                    {openMarketHoldings
                      ?.reduce((acc, holding) => {
                        if (holding.opinion_type === 'YES') {
                          acc =
                            acc +
                            marketPrices.market_yes_price *
                              (holding.quantity - holding.filled_quantity) -
                            holding.price *
                              (holding.quantity - holding.filled_quantity)
                        } else {
                          acc =
                            acc +
                            marketPrices.market_no_price *
                              (holding.quantity - holding.filled_quantity) -
                            holding.price *
                              (holding.quantity - holding.filled_quantity)
                        }
                        return acc
                      }, 0)
                      .toFixed(1)}
                  </span>
                </p>
              )}
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex flex-col items-start">
                <p className="font-normal text-xs text-[#5F5F5F]">Investment</p>
                <p className="font-inter font-semibold text-xl">
                  &#8377;
                  {openMarketHoldings
                    ?.reduce(
                      (acc, holding) =>
                        acc +
                        holding.price *
                          (holding.quantity - holding.filled_quantity),
                      0
                    )
                    .toFixed(1)}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-normal text-xs text-[#5F5F5F]">
                  Current Value
                </p>
                <p className="font-inter font-semibold text-xl">
                  &#8377;
                  {openMarketHoldings
                    ?.reduce((acc, holding) => {
                      if (holding.opinion_type === 'YES') {
                        acc =
                          acc +
                          marketPrices.market_yes_price *
                            (holding.quantity - holding.filled_quantity)
                      } else {
                        acc =
                          acc +
                          marketPrices.market_no_price *
                            (holding.quantity - holding.filled_quantity)
                      }
                      return acc
                    }, 0)
                    .toFixed(1)}
                </p>
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-4 text-xs font-medium">
              <OpenMarketHoldingsBuyDrawer
                marketId={market_id}
                marketPrices={marketPrices}
              />
              <OpenMarketHoldingsExitSellOrders market={state.market} />
            </div>
            <div className="w-full flex justify-between items-center pt-4 border-dashed border-t-[0.7px] text-[#2C2D32]">
              <span className="font-normal text-xs">Exited Returns</span>
              <span className="font-inter text-xs font-medium">
                &#8377;{' '}
                {openMarketHoldings?.reduce((acc, holding) => {
                  return (acc += holding.returns)
                }, 0)}
              </span>
            </div>

            {(() => {
              const unmatchedHoldings = openMarketHoldings
                ?.filter((holding) => holding.status === 'UNMATCHED')
                ?.reduce(
                  (acc, holding) =>
                    acc + holding.quantity - holding.filled_quantity,
                  0
                )

              if (unmatchedHoldings === 0) return null

              return (
                <div className="w-full flex gap-4 items-center border-dashed border-t-[0.7px] pt-4">
                  <OpenMarketHoldingsCancelBuyOrders
                    market={state.market}
                    unmatchedHoldings={unmatchedHoldings}
                  />
                </div>
              )
            })()}
            {(() => {
              const exitingHoldings = openMarketHoldings
                ?.filter((holding) => holding.status === 'EXITING')
                ?.reduce(
                  (acc, holding) =>
                    acc + holding.quantity - holding.filled_quantity,
                  0
                )
              if (exitingHoldings === 0) return null
              return (
                <div className="w-full flex gap-4 items-center border-dashed border-t-[0.7px] pt-4">
                  <OpenMarketHoldingsCancelSellOrders
                    market={state.market}
                    exitingHoldings={exitingHoldings}
                  />
                </div>
              )
            })()}
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default ResolvedMarketHoldings
