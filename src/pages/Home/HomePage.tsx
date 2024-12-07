import { HiMiniMagnifyingGlassCircle } from "react-icons/hi2"
import JobCard from "../../components/Jobs/JobCard"
import { SearchInput } from "../../components/Jobs/SearchBar"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { AllRecommendedJobsState, getAllRecommendedJobs } from '../../store/features/AllRecommendedJobSlice';
import { AppDispatch } from "../../store/store"

const HomePage = () => {
  const [placeholder, setPlaceholder] = useState("Search for jobs, internships, or companies");
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector((state: {getAllRecommendedJobs : AllRecommendedJobsState }) => state.getAllRecommendedJobs.jobs);

  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(getAllRecommendedJobs());
    }
  }, [dispatch, jobs.length]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPlaceholder("Search");
      } else {
        setPlaceholder("Search for jobs, internships, or companies");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isValidImage = (fileName: string) => {
    const validExtensions = ['png', 'jpg', 'jpeg'];
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    return validExtensions.includes(fileExtension || '');
  };

  const scores = [
    { title: "Posted Job Offers", score: '12,357', icon: '/images/home/bag.svg' },
    { title: "Employers", score: '3,513', icon: '/images/home/employee.svg' },
    { title: "Applications sent", score: '52,651', icon: '/images/home/clip.svg' },
    { title: "Job offers viewed", score: '2,481,455', icon: '/images/home/folder.svg' },
  ]

  return (
    <div className="w-full flex flex-col gap-7 lg:gap-10 scroll-smooth">
      <div className="w-full" id="My home">
        <SearchInput
          placeholder={placeholder}
          value=""
          onChange={(e) => console.log(e.target.value)}
          Icon={HiMiniMagnifyingGlassCircle}
          size={35}
          isBg
        />
      </div>
      <div className="w-full" id="Portfolio">
        <PortfolioCard bg={'white'} />
      </div>
      <div className={`flex lg:hidden bg-white pl-6 py-[1.95rem] flex-col gap-10 items-start overflow-hidden rounded-xl`}>
        <h1 className="pl-0 md:pl-10 lg:pl-0 text-xl font-medium text-center">Job offers Statistics</h1>
        {scores.map((score, index) => (
          <div key={index} className="pl-0 md:pl-10 lg:pl-0 flex items-center gap-5">
            <div className="w-[60px] h-[60px]">
              {isValidImage(score.icon) ? (
                <img src={score.icon} alt='Score Image' className="w-full h-full" />
              ) : (
                <p>Invalid image format</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h5 className="font-semibold text-lg">{score.score}</h5>
              <p className="font-medium text-[1rem]">{score.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full hidden lg:block" id="Applied">
        <AppliedJobCard/>
      </div>
      <div id="Jobs" className="w-full flex flex-col gap-10">
        {jobs.slice(0,5).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

export const PortfolioCard = ({
  bg
}:{ bg : string}) => {
  return (
    <div className={`${bg==='white' ? 'bg-white' : 'bg-[#E6ECF8]'} rounded-lg p-3 flex flex-col md:flex-row gap-5 items-center justify-evenly border-2 border-[#B0B0B0]`}>
      <div className="w-[9vw] h-[9vw] rounded-lg hidden md:block ">
        <img src='/images/portfolioFolder.svg' alt="Folder Portfolio" className="w-full h-full"/>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg md:text-xl pt-4 md:pt-0 font-medium">Create Your Porfolio in easy Steps</div>
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
        <Link
          to="/jobs"
          className="bg-[#2B5A9E] font-medium text-xl text-white py-[0.6rem] px-5 rounded-2xl hover:opacity-80"
        >
          Search Jobs
        </Link>
      </div>
    </div>
  )
}

export default HomePage