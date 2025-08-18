import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Back from '@/assets/Back.svg'

const FAQDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const validIds = ['pan-card', 'control-centre']

  if (!id || !validIds.includes(id)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen select-none">
      <div className="h-12 sticky top-0 select-none w-full p-4 border-b flex flex-col justify-center border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
        <div className="flex items-center gap-3 w-full">
          <img
            src={Back}
            alt=""
            className="cursor-pointer h-4 w-4"
            onClick={() => {
              navigate(-1)
            }}
          />
        </div>
      </div>
      {id === 'pan-card' ? (
        <div className="flex flex-col gap-4 text-[#2C2D32] px-4 mt-4">
          <p className="text-sm font-medium leading-[15px] ">
            Why are my withdrawals failing continuously?
          </p>
          <p className="text-xs font-normal leading-[18px]">
            Apologies for the inconvenience! We are currently experiencing
            fluctuations in UPI transactions and have reported the issue to our
            payment gateway. It will be resolved shortly. Please try again after
            some time.
          </p>
        </div>
      ) : null}
      {id === 'control-centre' ? (
        <div className="flex flex-col gap-4 text-[#2C2D32] px-4 mt-4">
          <p className="text-sm font-medium leading-[15px] ">
            What is the Control Centre?
          </p>
          <p className="text-xs font-normal leading-[18px]">
            The Control Centre includes all the controls required to promote
            healthy trading, where you can set your limits on time, recharges
            etc., as and when required by the user!
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default FAQDetails
