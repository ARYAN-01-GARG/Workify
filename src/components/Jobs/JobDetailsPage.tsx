import { useState } from "react";
import Header from "../landingPage/Header"
import JobCard2 from "./JobCard2"
import JobCard3 from "./JobCard3";

const JobDetailsPage = () => {

  const [skills , setSkills] = useState(['Figma']);
  const handlechange =()=>{
    setSkills([])
  }

  return (
    <div className="w-full bg-[#E6ECF8] min-h-screen">
      <Header />
      <div className="w-full px-10 py-10">
        <JobCard2 />
        <div className="flex gap-12 w-full py-10">
          <div className="flex flex-col flex-grow gap-8">
            <div className="bg-white px-10 py-12 flex flex-col gap-6 rounded-lg">
              <div className="flex flex-col gap-2 text-xl ">
                <h2 className="font-semibold">About Job</h2>
                <h3 className="text-lg font-medium text-[#3D3D3D]">Senior Full-stack Developer role, with end-to-end ownership of the Company's Android apps.</h3>
              </div>
              <div className="text-lg font-medium max-w-[90%]">
                <h4 className="text-[#2a2a2a] pb-5">
                  Key Responisbility :
                </h4>
                <div className="text-[#5D5D5D] pl-1">
                  <p>1. Collaborate with cross-functional teams to design, develop, and implement new features for our Android applications</p>
                  <p>2. Optimize App performance and ensure seamless user experience.</p>
                  <p>3. Contribute to the overall Tech strategy & roadmap of the company to drive innovation & growth.</p>
                </div>
              </div>
            </div>
            <div className="bg-white px-10 py-12 flex flex-col gap-6 rounded-lg">
              <div className="flex flex-col text-xl ">
                <h2 className="font-semibold">About The Company</h2>
                <h3 className="text-lg font-medium text-[#3D3D3D]">Sarthi Limited LLP</h3>
                <div className="text-lg font-medium text-[#2B5A9E]">
                  <span className="border-b border-[#2B5A9E]"> Website</span> •
                  <span className="border-b border-[#2B5A9E]"> Linkedin</span> •
                  <span className="border-b border-[#2B5A9E]"> Profile</span>
                </div>
              </div>
              <h4 className="text-lg font-medium">Financial Technology • 1-10 employees </h4>
              <div className="text-lg font-medium max-w-[90%]">
                <h4 className="text-[#3D3D3D] pb-5 ">
                  Sarthi Limited LLP is a FinTech start-up headquartered in Hyderabad, India.
                </h4>
                <div className="text-[#3D3D3D] pl-1">
                  <p>We provide formal credit access to the underserved Micro & Small sized Indian retailers, through innovative Finance product offerings and underwriting powered by modern Data Science techniques, cutting-edge Technology, and our segment IP.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 justify-start">
            <div className="bg-white px-10 pt-10 w-[20vw] rounded-lg">
              <h2 className="text-xl font-semibold ">Skills-Mandatory</h2>
              <div className="flex gap-3 py-5 flex-wrap">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
                            {skill}
                    </span>
                ))}
              </div>
              <h2 className="text-xl font-semibold">Skills-Optional</h2>
              <div className="flex gap-3 py-5 pb-10 flex-wrap">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
                            {skill}
                    </span>
                ))}
              </div>
            </div>
            <div className="bg-white px-10 pt-10 w-[20vw] rounded-lg ">
              <h2 className="text-xl font-semibold">Extra Benefits</h2>
              <div className="flex gap-3 py-5 pb-10 flex-wrap">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
                            {skill}
                    </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div onClick={handlechange} className="hidden"></div>
        <h2 className="text-[#2B5A9E] font-medium text-xl py-10">Similar Jobs</h2>
        <div className="w-full flex gap-10 relative ">
          <JobCard3 />
          <JobCard3 />
        </div>
      </div>
    </div>
  )
}

export default JobDetailsPage