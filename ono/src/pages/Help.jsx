import React from 'react'
import { useNavigate } from 'react-router-dom'
import Back from '@/assets/Back.svg'
import Trading from '@/assets/Trading.svg'
import Payments from '@/assets/Payments.svg'
import AppControl from '@/assets/AppControl.svg'
import Trust from '@/assets/Trust.svg'
import OtherIssues from '@/assets/OtherIssues.svg'
import TaxRelated from '@/assets/TaxRelated.svg'
import Right from '@/assets/Right.svg'

const faqs = [
  { id: 'pan-card', question: 'I am unable to verify my PAN card, why?' },
  { id: 'tds', question: 'What is the TDS calculation formula?' },
  { id: 'control-centre', question: 'What is the Control Centre?' },
  { id: 'faq4', question: 'Why are my withdrawals failing continuously?' },
  { id: 'faq5', question: 'Why is my KYC temporarily blocked?' },
  { id: 'faq6', question: 'How are trading commissions charged?' },
  { id: 'faq7', question: 'Withdrawal Offer Unavailability' },
]

const Help = () => {
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
          <p className="font-normal text-sm leading-normal text-[#5F5F5F]">
            Get Help
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 mt-4 px-4">
          <h2 className="font-bold leading-[22px] text-sm text-[#2C2D32]">
            Browse help categories
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div
              className="flex flex-col items-center gap-2 bg-white p-[13px] rounded-[10px] cursor-pointer"
              onClick={() => {
                navigate('/payments')
              }}
            >
              <div>
                <img src={Payments} alt="" />
              </div>
              <p className="text-center text-[10px] font-normal leading-normal text-[#2C2D32] mx-auto w-[80%]">
                Payments &amp; Recharges
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-2 bg-white p-[13px] rounded-[10px] cursor-pointer"
              onClick={() => {
                navigate('/trading')
              }}
            >
              <div>
                <img src={Trading} alt="" />
              </div>
              <p className="text-center text-[10px] font-normal leading-normal text-[#2C2D32] w-[80%]">
                Trading &amp; Settlement
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-2 bg-white p-[13px] rounded-[10px] cursor-pointer"
              onClick={() => {
                navigate('/control-centre')
              }}
            >
              <div>
                <img src={AppControl} alt="" />
              </div>
              <p className="text-center text-[10px] font-normal leading-normal text-[#2C2D32] w-[80%]">
                App Control Centre
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-2 bg-white p-[13px] rounded-[10px] cursor-pointer"
              onClick={() => {
                navigate('/tax-related')
              }}
            >
              <div>
                <img src={TaxRelated} alt="" />
              </div>
              <p className="text-center text-[10px] font-normal leading-normal text-[#2C2D32] w-[80%]">
                Tax Related
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-2 bg-white p-[13px] rounded-[10px] cursor-pointer"
              onClick={() => {
                navigate('/other-issues')
              }}
            >
              <div>
                <img src={OtherIssues} alt="" />
              </div>
              <p className="text-center text-[10px] font-normal leading-normal text-[#2C2D32] w-[80%]">
                Other Issues
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-2 bg-white p-[13px] rounded-[10px] cursor-pointer"
              onClick={() => {
                navigate('/trust-safety')
              }}
            >
              <div>
                <img src={Trust} alt="" />
              </div>
              <p className="text-center text-[10px] font-normal leading-normal text-[#2C2D32] w-[80%]">
                Trust &amp; Safety
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4 px-4 pb-4">
          <h2 className="font-bold leading-[22px] text-sm text-[#2C2D32]">
            Frequently asked questions
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
    </div>
  )
}

export default Help
