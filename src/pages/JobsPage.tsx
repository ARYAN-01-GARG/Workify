import Footer from "../components/landingPage/Footer"
import Header from "../components/landingPage/Header"
// import JobCard from "../components/Jobs/JobCard"
import SearchBar from "../components/Jobs/SearchBar"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { UserState } from "../store/features/auth/UserState"
import { useNavigate } from "react-router-dom"

const JobsPage = () => {

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state : {user : UserState}) => state.user.isAuthenticated);
  const role = useSelector((state : {user : UserState}) => state.user.userData.role);

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
              {/* <JobCard/>
              <JobCard/>
              <JobCard/>
              <JobCard/>
              <JobCard/> */}
            </div>
            <div className="w-[25vw] bg-white rounded-xl text-center">
              Side
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