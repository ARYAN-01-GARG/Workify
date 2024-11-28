import { HiMiniMagnifyingGlassCircle } from "react-icons/hi2"
import JobCard from "../../components/Jobs/JobCard"
import { SearchInput } from "../../components/Jobs/SearchBar"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const HomePage = () => {
  return (
    <div className="w-full flex flex-col gap-10 scroll-smooth">
      <div className="w-full" id="My home">
        <SearchInput
          placeholder="Search for jobs, internships, or companies"
          value=""
          onChange={(e) => console.log(e.target.value)}
          Icon={HiMiniMagnifyingGlassCircle}
          size={35}
          isBg
        />
      </div>
      <div className="w-full" id="Portfolio">
        <PortfolioCard />
      </div>
      <div className="w-full" id="Applied">
        <AppliedJobCard/>
      </div>
      <div id="Jobs" className="w-full flex flex-col gap-10">
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
      </div>
      <div className="min-h-screen bg-white" id="Companies"></div>
      <div className="min-h-screen bg-white" id="Membership"></div>
    </div>
  )
}

const PortfolioCard = () => {
  return (
    <div className="bg-white rounded-lg p-3 flex gap-5 items-center justify-evenly border-2 border-[#B0B0B0]">
      <div className="w-[9vw] h-[9vw] rounded-lg">
        <img src='/public/images/portfolioFolder.svg' alt="Folder Portfolio" className="w-full h-full"/>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">Create Your Porfolio in easy Steps</div>
        <ul className="text-sm list-disc list-inside font-medium text-[#3D3D3D]">
          <li>Add Your Resume and key Skills</li>
          <li>Showcase Your Best Projects</li>
          <li>Link Your Professional Profiles</li>
        </ul>
      </div>
      <button className="bg-[#2B5A9E] hover:opacity-80 font-medium text-xl text-white py-[0.6rem] px-5 rounded-2xl">Create Portfolio</button>
    </div>
  )
}

export const AppliedJobCard = () => {
  const navigate = useNavigate();

  const [isActive , setIsActive] = useState('Applied Jobs');

  const handleChange = (label : string) => {
    setIsActive(label);
  }
  const Applieds = [
    {
      id: 1,
      title: 'Applied Jobs',
      count: 0
    },
    {
      id: 2,
      title: 'Applied Internships',
      count: 0
    }
  ]
  return (
    <div className="bg-white rounded-xl py-5 px-8 flex flex-col gap-5 justify-evenly border-2 border-[#B0B0B0]">
      <div className="flex gap-5 font-medium text-xl border-b-2 border-[#D1D1D1]">
        {Applieds.map((item) => (
          <div
            key={item.id}
            onClick={() => handleChange(item.title)}
            className={`pb-2 cursor-pointer ${isActive === item.title ? 'text-black border-b-[4px] border-black' : 'text-[#3D3D3D]'}`}>
              {item.title}{`(${item.count})`}
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center items-center gap-4 pt-8 pb-1">
        <p className="text-[#454545] text-xl font-medium">No Applied Jobs</p>
        <p className="text-[#4F4F4F] font-medium text-[1rem]">You have not applied to any jobs yet.</p>
        <button className="bg-[#2B5A9E] font-medium text-xl text-white py-[0.6rem] px-5 rounded-2xl hover:opacity-80" onClick={() => navigate('/Jobs')}>Search Jobs</button>
      </div>
    </div>
  )
}

export default HomePage