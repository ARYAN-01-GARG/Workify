import Footer from "../components/landingPage/Footer"
import Header from "../components/landingPage/Header"
import JobCard from "../components/Jobs/JobCard"
import SearchBar from "../components/Jobs/SearchBar"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { UserState } from "../store/features/auth/UserState"
import { useNavigate } from "react-router-dom"
import { AllJobsState } from "../store/features/AllJobSlice"

const JobsPage = () => {

  const navigate = useNavigate();
  const jobs = useSelector((state : {allJobs : AllJobsState }) => state.allJobs.jobs);
  const isAuthenticated = useSelector((state : {user : UserState}) => state.user.isAuthenticated);
  const role = useSelector((state : {user : UserState}) => state.user.userData.role);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0)
    if(role !== 'candidate' || !isAuthenticated) {
      navigate('/')
    }
  } , [navigate , isAuthenticated , role])

  return (
    <div className="bg-[#E6ECF8] min-h-screen flex flex-col w-full">
        <Header/>
        <main className="flex-grow px-12">
          <SearchBar/>
          <div className="">
            <div>
              <p>20500 results</p>
              <div>
                Recommended
              </div>
            </div>
            <p>Hiding jobs that do not accept applications from your location: India. Update location</p>
          </div>
          <div className="flex gap-10 py-10">
            <div className="flex-grow px-2 flex flex-col gap-10">
              {currentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="w-[25vw] bg-white rounded-xl text-center">
              Side
            </div>
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="flex justify-center gap-4">
              <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-[#2B5A9E] text-white font-medium text-lg py-2 px-5 rounded-2xl hover:opacity-80 text-center">
                Previous
              </button>
              <span className="flex items-center gap-2">Page {currentPage} of {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-[#2B5A9E] text-white font-medium text-lg py-2 px-5 rounded-2xl hover:opacity-80 text-center">
                Next
              </button>
            </div>
          </div>
        </main>
        <div className="text-[#20365A] font-medium text-center px-32 pt-32 pb-8">
          Applicants are advised to research bonafides of advertisers independently. Workify shall not have any responsibility in this regard. We also recommend that you visit Security Guidelines and Terms and Conditions for more comprehensive information on this aspect.
        </div>
        <Footer/>
    </div>
  )
}

export default JobsPage