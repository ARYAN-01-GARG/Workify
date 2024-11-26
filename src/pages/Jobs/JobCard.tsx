import { useState } from "react"
import { CiCalendar } from "react-icons/ci"
import { FaClipboardList } from "react-icons/fa6"
import { PiMoneyFill } from "react-icons/pi"
import { Link } from "react-router-dom"


// interface JobCardProps {
//     Jobtitle,
//     skills,

// }


const JobCard = () => {
    const [skills , setSkills] = useState(['Figma', 'Adobe XD', 'Sketch', 'InVision']);

    const handleChange = () => {
        if(!skills){
            setSkills(['Figma', 'Adobe XD', 'Sketch', 'InVision'])
        }
    }
  return (
    <div className="relative flex flex-col justify-between items-start bg-white px-8 py-12 rounded-xl border-2 border-[#6D6D6D]/50">
        <div className="absolute -top-5 right-6 px-3 py-[0.4rem] font-medium text-[#2B5A9E] bg-[#E6ECF8] border-[2px] border-[#C8D8EF] rounded-lg">In-Office</div>
        <div className="flex gap-4 p">
            <div className="w-[60px] h-[60px] bg-red-400 rounded-full">
            </div>
            <div>
                <h5 className="text-xl font-semibold">UI/UX Designer Job</h5>
                <p className="text-[#6D6D6D] text-lg font-medium">Modgenics Technology Solutions | Hyderabad, India</p>
            </div>
        </div>
        <div className="flex gap-3 py-5 mt-5">
            {skills.map((skill, index) => (
                <span
                    key={index}
                    className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
                        {skill}
                </span>
            ))}
        </div>
        <div className="w-full flex justify-between items-start mt-10 mb-5 pr-20">
            <div className="font-medium text-[#5D5D5D]">
                <div className="flex items-center gap-2 pb-3"><PiMoneyFill size={20}/><p>Job Offer</p></div>
                <p className="text-[#3D3D3D]">$ 2300 - 3000</p>
            </div>
            <div className="font-medium text-[#5D5D5D]">
                <div className="flex items-center gap-2 pb-3"><FaClipboardList size={20}/><p>Probation Duration</p></div>
                <p className="text-[#3D3D3D]">2 months</p>
            </div>
            <div className="font-medium text-[#5D5D5D]">
                <div className="flex items-center gap-2 pb-3"><p>Experience</p></div>
                <p className="text-[#3D3D3D]">0-3 years</p>
            </div>
            <div className="font-medium text-[#5D5D5D]">
                <div className="flex items-center gap-1 pb-3"><CiCalendar size={30}/><p>Start Date</p></div>
                <p className="text-[#3D3D3D]">Immediate</p>
            </div>
        </div>
        <div className="flex justify-between items-center w-full pt-3">
            <p className="text-[#2B5A9E] font-medium">Apply by 14 December 2024 .  Posted 2d ago</p>
            <div className="flex gap-5" onClick={handleChange}>
                <Link to={'gshgshj'} className="bg-[#E6ECF8] text-xl font-medium py-2 px-5 border border-[#D1D1D1] rounded-2xl hover:bg-[#d4dae5] ">View Details</Link>
                <button className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80">Apply Now</button>
            </div>
        </div>
    </div>
  )
}

export default JobCard