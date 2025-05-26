import LoginImage from '@/assets/LoginImage.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Login = () => {
  return (
    <div className="w-full relative max-w-md mx-auto min-h-screen">
      <div className="relative mb-10">
        <img src={LoginImage} alt="" className="w-full" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border rounded-2xl w-full flex flex-col gap-2 py-4 font-inter z-[50] max-w-md mx-auto bg-white">
        <div className="flex flex-col gap-[5px] px-4">
          <p className="font-normal text-[22px] text-[#337265]">
            Login or Sign up
          </p>
          <p className="font-poppins font-normal text-xs leading-[15px]">
            OTP has been sent to 9899009899
          </p>
        </div>
        <div className="px-4">
          <div
            className={`
        flex items-center w-full 
        border border-gray-200 rounded-md bg-white
        transition-all duration-200
            
      `}
          >
            <span className="px-3 py-2.5 text-gray-600 text-base">+91</span>
            <input
              type="tel"
              // value={phoneNumber}
              // onChange={handleInputChange}
              placeholder="Enter your phone number"
              maxLength={10}
              aria-label="Phone number"
              className="
          flex-1 px-2 py-2.5
          text-base text-gray-900
          placeholder:text-gray-400
          border-none outline-none
          bg-transparent
        "
            />
          </div>
        </div>
        <div className="w-full px-4">
          <Button
            variant="outline"
            className="w-full rounded-[5px] px-4 py-[18px]"
          >
            Get Started
          </Button>
        </div>
        <div className="px-4">
          <p className="font-normal text-[10px] leading-[15px]">
            This game maybe habit forming or finanicially risky. Play
            responsibly. Terms and Conditions apply, for 18+ only. Participation
            as per state laws.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
