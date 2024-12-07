import Footer from "../components/landingPage/Footer"
import Header from "../components/landingPage/Header"
import JobCard from "../components/Jobs/JobCard"
import SearchBar from "../components/Jobs/SearchBar"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { UserState } from "../store/features/auth/UserState"
import { useNavigate } from "react-router-dom"
import { AllJobsState, getAllJobs } from "../store/features/AllJobSlice"
import { AppDispatch } from "../store/store"

const JobsPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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

  useEffect(() => {
    if(jobs.length === 0) {
      dispatch(getAllJobs())
    }
  },[dispatch , jobs.length])

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
        <main className="flex-grow lg:px-12 px-4">
          <SearchBar/>
          <div className="">
            <div>
              <p className="text-semibold">Total Available Jobs : {jobs.length}</p>
            </div>
          </div>
          <div className="flex gap-10 py-10">
            <div className="flex-grow px-2 flex flex-col gap-10">
              {currentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="lg:block hidden w-[25vw] bg-white rounded-xl text-center">
              Showing Results of top Company
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
        <div className="text-[#20365A] font-medium text-center px-6 lg:px-32 pt-32 pb-8">
          Applicants are advised to research bonafides of advertisers independently. Workify shall not have any responsibility in this regard. We also recommend that you visit Security Guidelines and Terms and Conditions for more comprehensive information on this aspect.
        </div>
        <Footer/>
    </div>
  )
}

export default JobsPage