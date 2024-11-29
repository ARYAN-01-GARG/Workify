import { CiCalendar } from "react-icons/ci"
import { FaClipboardList } from "react-icons/fa6"
import { PiMoneyFill } from "react-icons/pi"



const JobCard3 = () => {
  return (
    <div className="w-[50vw] flex flex-col justify-between items-start bg-white px-8 pt-8 pb-4 rounded-xl border-2 border-[#6D6D6D]/50">
        <div className="flex gap-4 justify-between w-full">
            <div className="max-w-[70%]">
                <h5 className="text-xl font-semibold">UI/UX Designer Job</h5>
                <p className="text-[#6D6D6D] text-lg font-medium">Modgenics Technology Solutions | Hyderabad, India</p>
            </div>
            <div className="w-[60px] h-[60px] bg-red-400 rounded-full">
            </div>
        </div>
        <div className="w-full flex justify-between my-5">
            <div className="flex flex-col gap-3">
                <div className="font-medium text-[#5D5D5D]">
                    <div className="flex items-center gap-2 pb-1"><PiMoneyFill size={20}/><p>Job Offer</p></div>
                    <p className="text-[#3D3D3D]">$ 2300 - 3000</p>
                </div>
                <div className="font-medium text-[#5D5D5D]">
                    <div className="flex items-center gap-2 pb-1"><p>Experience</p></div>
                    <p className="text-[#3D3D3D]">0-3 years</p>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="font-medium text-[#5D5D5D]">
                    <div className="flex items-center gap-2 pb-1"><FaClipboardList size={20}/><p>Probation Duration</p></div>
                    <p className="text-[#3D3D3D]">2 months</p>
                </div>
                <div className="font-medium text-[#5D5D5D]">
                    <div className="flex items-center gap-1 pb-1"><CiCalendar size={30}/><p>Start Date</p></div>
                    <p className="text-[#3D3D3D]">Immediate</p>
                </div>
            </div>
        </div>
        <div className="flex justify-between items-center w-full pt-3">
            <p className="text-[#2B5A9E] font-medium text-lg">Apply by 14 December 2024</p>
            <span className="text-[#2B5A9E] bg-[#E6ECF8] border border-[#C8D8EF] px-4 py-1 rounded-md"> Posted 2d ago</span>
        </div>
        <div className="flex gap-5 w-full justify-center pt-3">
            <button className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80">View Details</button>
        </div>
    </div>
  )
}

export default JobCard3