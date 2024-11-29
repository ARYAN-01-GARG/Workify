import { FaChevronRight } from "react-icons/fa6"

const CompanyCard = () => {
  return (
    <div className="bg-white border border-[#B0B0B0] pt-10 pl-10 pr-8 rounded-2xl hover:scale-[1.02]">
        <div className="flex items-center gap-6 w-full">
            <div className="h-[50px] w-[50px] rounded-md bg-[#E6ECF8] flex items-center justify-center">
                <img src='/images/appleiconwithoutbg.png' alt="image" className=" "/>
            </div>
            <div className="">
                <h5 className="text-xl text-[#16233B] font-semibold">Apple</h5>
                <p className="text-[#3D3D3D] font-medium text-[0.75rem]">50-100 domains</p>
            </div>
            <FaChevronRight size={22} className="text-[#5D5D5D] ml-6 cursor-pointer"/>
        </div>
        <div className="flex gap-4 text-[.75rem] font-medium py-5">
            <span className="bg-[#98B8E1] text-[#16233B] py-[5px] px-2 rounded-md">Expert</span>
            <span className="bg-[#90E59B] text-[#1A4D22] py-[5px] px-2 rounded-md">Full-Time</span>
            <span className="bg-[#FFC1C1] text-[#500000] py-[5px] px-2 rounded-md">Entry Level</span>
        </div>
        <p className="pb-2 border-b border-[#D1D1D1] text-[.75rem] text-[#5D5D5D] max-w-[17vw]">Apple Inc. is known for fostering a culture of innovation, collaboration, and excellence among its employees.</p>
        <div>
            <img src="/images/savefollow.svg" alt="save" className="py-5 cursor-pointer"/>
        </div>
    </div>
  )
}

export default CompanyCard