import Back from '@/assets/Back.svg'
import Right from '@/assets/Right.svg'
import { useNavigate } from 'react-router-dom'

const faqs = [
  {
    id: 'withdrawals-failing',
    question: 'Why are my withdrawals failing continuously?',
  },
  {
    id: 'recharge-pending',
    question: 'What is my recharge pending?',
  },
  {
    id: 'recharge-fail',
    question: 'Why did my recharge fail?',
  },
  {
    id: 'deposit-money',
    question: 'I’m unable to deposit money, why?',
  },
  {
    id: 'withdrawal-pending',
    question: 'Why is my withdrawal pending?',
  },
  {
    id: 'withdrawal-success-but-not-received',
    question:
      'My withdrawal is successful, but I haven’t received the amount, why?',
  },
  {
    id: 'withdrawal-charges',
    question: 'What are the charge for withdrawals',
  },
  {
    id: 'unable-to-withdraw',
    question: 'I am unable to withdraw my winnings, why?',
  },
]

const ControlCentre = () => {
  const navigate = useNavigate()
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
      <div className="flex flex-col gap-4 mt-4 px-4 pb-4">
        <h2 className="font-bold leading-[22px] text-sm text-[#2C2D32]">
          Control Centre
        </h2>
        <div className="py-4 flex flex-col gap-4 leading-[22px] bg-white px-4 rounded-[10px]">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="flex items-center justify-between last:border-b-0 gap-2 border-[0.7px] border-b border-x-0 border-t-0 border-dashed border-[#CBCBCB] pb-4 last:pb-0 cursor-pointer"
              onClick={() => navigate(`/faq/${faq.id}`)}
            >
              <div className="flex items-center gap-2 w-[75%]">
                <p className="font-normal text-sm text-[#2C2D32] leading-normal">
                  {faq.question}
                </p>
              </div>
              <div className="flex items-center gap-2 w-[25%] justify-end">
                <img src={Right} className="w-3 h-3" alt="arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ControlCentre
