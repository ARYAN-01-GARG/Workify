import { Outlet } from "react-router-dom"
import Header from "../components/landingPage/Header"
import { BiHomeAlt } from "react-icons/bi"
import Footer from "../components/landingPage/Footer"
import { AiOutlineFolderOpen } from "react-icons/ai"
import { RxBackpack } from "react-icons/rx"
import { FaRegCopy } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5"
import { useState, useEffect } from "react"
import { CiChat1 } from "react-icons/ci"
import { useSelector } from "react-redux"
// import { UserState } from "../store/features/auth/UserState"
import { FaRegUser } from "react-icons/fa6"
import { Candidate } from "../store/features/roleSelection/CandidateSlice"

const menuItems = [
  { icon: <BiHomeAlt size={20} />, label: "My home" },
  { icon: <AiOutlineFolderOpen size={20} />, label: "Portfolio" },
  { icon: <RxBackpack size={20} />, label: "Jobs" },
  { icon: <CiChat1 size={20} />, label: "Chats" },
  { icon: <FaRegCopy size={20}/>, label: "Applied" },
  { icon: <BiHomeAlt size={20} />, label: "Companies" },
  { icon: <IoBookOutline size={20}/>, label: "Blog" },
  { icon: <BiHomeAlt size={20} />, label: "Membership" },
];

const scores = [
  { title: "Posted Job Offers", score: '12,357' , icon : '/images/home/bag.svg' },
  { title: "Employers", score: '3,513' , icon : '/images/home/employee.svg' },
  { title: "Applications sent", score: '52,651' , icon : '/images/home/clip.svg' },
  { title: "Job offers viewed", score: '2,481,455' , icon : '/images/home/folder.svg' },
]

const LayoutForcandidate = () => {

  // const userData = useSelector((state : { user : UserState}) => state.user.userData);
  const candidate = useSelector((state : { candidate : { candidate : Candidate}}) => state.candidate.candidate);
  const [isActive, setIsActive] = useState('My home');
  const [isScrolled, setIsScrolled] = useState(false);

  const handleMenuClick = (label: string) => {
    setIsActive(label);
    const section = document.getElementById(label);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 40,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = menuItems.map(item => document.getElementById(item.label));
      const scrollPosition = window.scrollY + window.innerHeight / 4;

      for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
          setIsActive(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-[#E6ECF8] min-h-[100vh]">
      <Header />
      <main className="px-10 flex my-10 gap-6 items-start">
        <div className={`bg-white min-w-[18vw] py-10 rounded-lg ${isScrolled ? 'sticky top-0 self-start' : ''}`}>
          <figure className="w-full flex flex-col items-center">
            <div className="bg-slate-300 w-32 h-32 rounded-full flex justify-center items-center">
              {candidate.profileImageKey ? <img src={candidate.profileImageKey} alt="User" className="w-full h-full rounded-full" /> : <FaRegUser size={50} className="text-slate-500"/>}
            </div>
            <figcaption className="font-semibold my-1">{`${candidate.firstName} ${candidate.lastName || ''}`}</figcaption>
          </figure>
          <div></div>
          <div className="mt-12 mb-6 flex items-center text-[1.05rem]">
            <div className="mx-auto flex flex-col gap-6 justify-center items-start">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center font-semibold gap-4 cursor-pointer ${isActive === item.label ? 'text-[#2B5A9E]' : 'text-black'}`}
                  onClick={() => handleMenuClick(item.label)}
                >
                  <div className="list-disc">{item.icon}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-grow scroll-smooth">
          <Outlet />
        </div>
        <div className={`bg-white pl-6 pr-10 py-[4.75rem] flex flex-col gap-10 items-start overflow-hidden rounded-xl ${isScrolled ? 'sticky top-0 self-start' : ''}`}>
          <h1 className="text-xl font-semibold text-center">Job offers Statistics</h1>
          {scores.map((score, index) => (
            <div key={index} className="flex items-center gap-5">
              <div className="w-[60px] h-[60px]">
                <img src={score.icon} alt='Score Image' className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-1">
                <h5 className="font-semibold text-xl">{score.score}</h5>
                <p className="font-medium text-[1rem]">{score.title}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LayoutForcandidate;