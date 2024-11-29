import { FaPlus, FaRegUser } from "react-icons/fa6"
import Footer from "../components/landingPage/Footer"
import Header from "../components/landingPage/Header"
import { useSelector } from "react-redux"
import { UserState } from "../store/features/auth/UserState"
import { CiLocationOn } from "react-icons/ci"
import { FiPhone } from "react-icons/fi"
import { RxBackpack } from "react-icons/rx"
import { MdOutlineMail } from "react-icons/md"
import { Link } from "react-router-dom"
import { Candidate } from "../store/features/roleSelection/CandidateSlice"
import { RiPencilFill } from "react-icons/ri"
import { PortfolioCard } from "./Home/HomePage"

const Profile = () => {


  const userData = useSelector((state: { user: UserState }) => state.user.userData);
  const candidate = useSelector((state: { candidate: {candidate : Candidate} }) => state.candidate.candidate);

  return (
    <div className="min-h-screen flex flex-col bg-[#E6ECF8]">
      <Header />
      <main className="flex-grow px-[3.125rem] py-[2.6rem] ">
        <div className="flex gap-6 w-full items-start">
          <div className="flex gap-8 border-[2px] border-[#B0B0B0] py-[3.2rem] px-[2.6rem] bg-white rounded-lg w-full max-w-[60vw] items-start">
            <div className="relative w-full max-w-40 h-40 rounded-full bg-slate-300 flex justify-center items-center">
              {candidate.profileImageKey ? <img src={candidate.profileImageKey} alt="User" className="w-full h-full rounded-full" /> : <><FaRegUser className="text-slate-500 m-auto" size={50} /></>}
              <RiPencilFill size={30} className="absolute bottom-1 right-1 rounded-full bg-white border border-[#B0B0B0] cursor-pointer text-[#2B5A9E] p-1 hover:scale-105" onClick={() => {}}/>
            </div>
            <div className="w-full">
              <div className="w-full">
                <div className="flex flex-col gap-2 pb-2 border-b-2 border-[#D1D1D1]">
                  <h1 className="text-[1.57rem] font-semibold ">{`${candidate.firstName} ${candidate.lastName}`}</h1>
                  <p className="text-xl font-medium text-[#3D3D3D]">{`${'Frontend Developer'}`}</p>
                </div>
              </div>
              <div className="flex justify-between gap-10 pt-2">
                <div className="flex flex-col gap-5 justify-between">
                  <div className="flex gap-2 items-center"><CiLocationOn size={25}/>{`${'Delhi'}`}</div>
                  <div className="flex gap-2 items-center"><RxBackpack size={25}/>Fresher</div>
                </div>
                <div className="flex flex-col gap-5 justify-between">
                  <div className="flex gap-2 items-center"><FiPhone size={20}/>{`${userData.mobile ? userData.mobile.slice(0,2)+'XXXXXXX' : '91XXXXXXX'}`}</div>
                  <div className="flex gap-2 items-center"><MdOutlineMail size={20}/>{`${userData.email ? userData.email.replace(/(.{2}).+(.{2}@.+)/, "$1*****$2") : 'abc@gmail.com'}`}</div>
                </div>
              </div>
            </div>
            <button className="bg-[#2B5A9E] text-white font-medium text-xl py-[.7rem] px-10 ml-24 rounded-2xl hover:opacity-80">Edit</button>
          </div>
          <div className="relative bg-[#FFECDD] px-[2rem] py-[2.9rem] w-[40vw] border rounded-lg border-[#ECDFC1] mt-2">
            <h4 className="text-lg font-medium">How to create a good Resume on Workify?</h4>
            <Link to={'/resume-building'} className="text-lg font-semibold text-[#9E5A0D] hover:opacity-80">Read blog post</Link>
            <div className="absolute -top-5 text-lg font-medium bg-[#FFCBA4] border border-[#E9DED4] text-[#B85900] rounded-lg px-4 py-2 cursor-default">
              Must Read
            </div>
          </div>
        </div>
        <div className="flex gap-8 items-start mt-6">
          <div className="bg-white py-[3.73rem] px-[3.12rem] border-[2px] rounded-lg border-[#B0B0B0]">
            <h1 className="text-lg font-semibold">Add More</h1>
            {sideBarData.map((data, index) => (
              <div key={index} className="flex text-lg font-medium justify-between items-center rounded-lg pt-[1.4rem] pb-[.7rem] w-[20vw]">
                <p>{data.title}</p>
                <button className="text-[#2B5A9E] rounded-2xl hover:opacity-80">{data.status}</button>
              </div>
            ))}
          </div>
          <div className="w-full flex flex-col gap-7">
            <div className="bg-white font-medium py-[3.13rem] px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full max-w-[64vw]">
              <h1 className="text-xl pb-3">Portfolio</h1>
              <p className="text-lg text-[#3D3D3D] pb-4">Showcase your skills and achievements to stand out- create a personalized portfolio that grabs attention and open doors to opportunities!</p>
              <PortfolioCard bg={'#E6ECF8'}/>
              <div className="w-full flex gap-3 mt-6 items-center justify-center flex-col border-[2px] py-3 pb-5 px-5 border-dashed border-[#B0B0B0]">
                <h1 className="text-[#2B5A9E] text-xl cursor-pointer"><span className="text-black">Already Have a Portfolio ? </span>Upload Portfolio</h1>
                <h3 className="text-lg text-[#3D3D3D]">Supported Formats: doc, docx, rtf, pdf, upto 2 MB</h3>
              </div>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full max-w-[64vw]">
              <h1 className="text-xl pb-3">Resume</h1>
              <p className="text-lg text-[#3D3D3D] pb-4">70% of recruiters discover candidates through their resume.</p>
              <div className="w-full flex gap-3 items-center justify-center flex-col border-[2px] py-3 pb-5 px-5 border-dashed border-[#B0B0B0]">
                <h1 className="text-[#2B5A9E] text-xl cursor-pointer">Upload Resume</h1>
                <h3 className="text-lg text-[#3D3D3D]">Supported Formats: doc, docx, rtf, pdf, upto 2 MB</h3>
              </div>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full max-w-[64vw]">
              <div
                className="flex justify-between">
                  <h1 className="text-xl pb-3">
                    Key Skills
                  </h1>
                  <FaPlus
                    size={20}
                    className="text-[#2B5A9E] cursor-pointer hover:opacity-80"
                    onClick={()=> {}}
                  />
                </div>
              <p className="text-lg text-[#3D3D3D] pb-4">Recruiters look for candidates with specific key skills</p>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full max-w-[64vw]">
              <div
                className="flex justify-between">
                  <h1 className="text-xl pb-3">
                    Projects
                  </h1>
                  <FaPlus
                    size={20}
                    className="text-[#2B5A9E] cursor-pointer hover:opacity-80"
                    onClick={()=> {}}
                  />
                </div>
              <p className="text-lg text-[#3D3D3D] pb-4">Stand out to employers by adding details about projects that you have done so far</p>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full max-w-[64vw]">
              <div
                className="flex justify-between">
                  <h1 className="text-xl pb-3">
                    Employment
                  </h1>
                  <FaPlus
                    size={20}
                    className="text-[#2B5A9E] cursor-pointer hover:opacity-80"
                    onClick={()=> {}}
                  />
                </div>
              <p className="text-lg text-[#3D3D3D] pb-4">UI UX Developer</p>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full max-w-[64vw]">
              <div
                className="flex justify-between">
                  <h1 className="text-xl pb-3">
                    Preferred location
                  </h1>
                  <FaPlus
                    size={20}
                    className="text-[#2B5A9E] cursor-pointer hover:opacity-80"
                    onClick={()=> {}}
                  />
                </div>
              <p className="text-lg text-[#3D3D3D] pb-4 flex gap-2 items-center">New Delhi, Bangalore/Bengaluru, Mumbai<RiPencilFill size={20}/></p>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full max-w-[64vw]">
              <div
                className="flex justify-between">
                  <h1 className="text-xl pb-3">
                    Education
                  </h1>
                  <FaPlus
                    size={20}
                    className="text-[#2B5A9E] cursor-pointer hover:opacity-80"
                    onClick={()=> {}}
                  />
                </div>
              <p className="text-lg text-[#3D3D3D] pb-4 flex gap-2 items-center">B.Tech/B.E. from Ajay Kumar Garg Engineering College, Ghaziabad<RiPencilFill size={20}/></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

const sideBarData = [
  { title : 'Resume' , status : 'Uploaded' },
  { title : 'Resume headline' , status : 'Add' },
  { title : 'Portfolio' , status : 'Add' },
  { title : 'Key Skill' , status : 'Add' },
  { title : 'Employment' , status : 'Add' },
  { title : 'Education' , status : 'Add' },
  { title : 'Projects' , status : 'Add' },
  { title : 'Personal Details' , status : 'Add' }
]

export default Profile