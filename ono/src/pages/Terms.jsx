import React from 'react'
import Back from '@/assets/Back.svg'
import { useNavigate } from 'react-router-dom'

const Terms = () => {
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
          <p className="font-medium text-xl leading-normal text-[#2C2D32]">
            Terms &amp; Conditions
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4 px-4">
        <h2 className="text-[#337265] font-medium text-[36px] text-center w-[60%] mx-auto leading-normal">
          Terms & Conditions
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-black">Usage of ONO</p>
          <ul className="text-xs font-normal leading-normal text-[#303030] list-decimal px-4">
            <li>
              The ONO Platform and ONO Team 11 (including any mobile based
              applications, website and web applications) is provided by ONO
              Media Technologies Pvt. Ltd. (“ONO”). Through the ONO Platform and
              ONO Team 11 any person (“User”) with a verified account can access
              and participate in the services provided via the ONO Platform and
              ONO Team 11 .
            </li>
            <li>
              A User accessing the ONO Platform or ONO Team 11 shall be bound by
              these Terms and Conditions, and all other rules, regulations and
              terms of use referred to herein or provided by ONO in relation to
              any services provided via the ONO Platform and ONO Team 11 (“ONO
              Services”).
            </li>
            <li>
              ONO shall be entitled to modify these Terms and Conditions, rules,
              regulations and terms of use referred to herein or provided by ONO
              in relation to any ONO Services, at any time, by posting the same
              on ONO. Use of ONO constitutes the User’s acceptance of such Terms
              and Conditions, rules, regulations and terms of use referred to
              herein or provided by ONO in relation to any ONO Services, as may
              be amended from time to time. ONO may, at its sole discretion,
              also notify the User of any change or modification in these Terms
              and Conditions, rules, regulations and terms of use referred to
              herein or provided by ONO, by way of sending an email to the
              User’s registered email address or posting notifications in the
              User accounts. The User may then exercise the options provided in
              such an email or notification to indicate non-acceptance of the
              modified Terms and Conditions, rules, regulations and terms of use
              referred to herein or provided by ONO. If such options are not
              exercised by the User within the time frame prescribed in the
              email or notification, the User will be deemed to have accepted
              the modified Terms and Conditions, rules, regulations and terms of
              use referred to
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Terms
