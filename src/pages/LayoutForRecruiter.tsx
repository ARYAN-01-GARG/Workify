import { useNavigate } from "react-router-dom";
import Header from "../components/landingPage/Header"

const LayoutForRecruiter = () => {

    const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#E6ECF8]">
        <Header/>
        <main className="flex-grow px-16 flex items-start pt-2">
            <div className="flex-grow flex flex-col justify-center items-start min-h-[80vh]">
                <h1 className="text-[3.2rem] font-medium leading-[4.7rem]">Find your next perfect hire with Workify.</h1>
                <h2 className="text-[2.45rem] font-medium text-[#3D3D3D]">Simple, fast, reliable.</h2>
                <button
                    className="bg-[#2B5A9E] font-medium text-xl text-white mt-10 py-[0.6rem] px-32 rounded-xl hover:opacity-80"
                    onClick={() => navigate('/post-a-job')}
                >
                    Post a Job
                </button>
            </div>
            <img src="/images/Recruiterhome.svg" alt="Recruiter Image" />
        </main>
    </div>
  )
}

export default LayoutForRecruiter