import { FaRegUser } from "react-icons/fa6"
import Footer from "../components/landingPage/Footer"
import Header from "../components/landingPage/Header"
import { useSelector } from "react-redux"
import { UserState } from "../store/features/auth/UserState"
import { CiLocationOn } from "react-icons/ci"
import { FiPhone } from "react-icons/fi"
import { RxBackpack } from "react-icons/rx"
import { MdOutlineMail } from "react-icons/md"
import { Link } from "react-router-dom"

const Profile = () => {


  const userData = useSelector((state: { user: UserState }) => state.user.userData);

  return (
    <div className="min-h-screen flex flex-col bg-[#E6ECF8]">
      <Header />
      <main className="flex-grow">
        <div className="px-[3.125rem] py-[2.6rem] flex gap-6 w-full items-start">
          <div className="flex gap-8 border-[2px] border-[#B0B0B0] py-[3.2rem] px-[2.6rem] bg-white rounded-lg w-full max-w-[60vw] items-start">
            <div className="w-full max-w-40 h-40 rounded-full bg-slate-300 flex justify-center items-center">
              <FaRegUser className="text-slate-500 m-auto" size={50} />
            </div>
            <div className="w-full">
              <div className="w-full">
                <div className="flex flex-col gap-2 pb-2 border-b-2 border-[#D1D1D1]">
                  <h1 className="text-[1.57rem] font-semibold ">{`${userData.firstName} ${userData.lastName}`}</h1>
                  <p className="text-xl font-medium text-[#3D3D3D]">{`FrontEnd Developer`}</p>
                </div>
              </div>
              <div className="flex justify-between gap-10 pt-2">
                <div className="flex flex-col gap-5 justify-between">
                  <div className="flex gap-2 items-center"><CiLocationOn size={25}/>{`${'Delhi'}`}</div>
                  <div className="flex gap-2 items-center"><RxBackpack size={25}/>Fresher</div>
                </div>
                <div className="flex flex-col gap-5 justify-between">
                  <div className="flex gap-2 items-center"><FiPhone size={20}/>{`${userData.mobile ? userData.mobile.slice(0,2)+'XXXXXXX' : '91XXXXXXX'}`}</div>
                  <div className="flex gap-2 items-center"><MdOutlineMail size={20}/>{`${userData.email ? userData.email : 'abc@gmail.com'}`}</div>
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
        <div className="flex gap-8 items-start">
          <div></div>
          <div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile