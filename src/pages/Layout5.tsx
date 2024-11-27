import { Outlet } from "react-router-dom"
import Header from "../components/landingPage/Header"
import { BiHomeAlt } from "react-icons/bi"
import Footer from "../components/landingPage/Footer"
import { AiOutlineFolderOpen } from "react-icons/ai"
import { RxBackpack } from "react-icons/rx"
import { FaRegCopy } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5"

const menuItems = [
  { icon: <BiHomeAlt size={20} />, label: "My home" },
  { icon: <AiOutlineFolderOpen size={20} />, label: "Portfolio" },
  { icon: <RxBackpack size={20} />, label: "Jobs" },
  { icon: <RxBackpack size={20} />, label: "Tempings" },
  { icon: <FaRegCopy size={20}/>, label: "Applied" },
  { icon: <BiHomeAlt size={20} />, label: "Companies" },
  { icon: <IoBookOutline size={20}/>, label: "Blog" },
  { icon: <BiHomeAlt size={20} />, label: "Membership" },
];

const Layout5 = () => {
  return (
    <div className="bg-[#E6ECF8] min-h-[100vh]">
        <Header/>
        <main className="px-14 flex my-10 gap-10">
            <div className="bg-white min-w-[18vw] py-10 rounded-lg">
                <figure className="w-full flex flex-col items-center">
                    <div className="bg-slate-500 w-32 h-32 rounded-full flex justify-center items-center">
                        Image
                    </div>
                    <figcaption className="font-semibold my-1">Aryan garg</figcaption>
                </figure>
                <div></div>
                <div className="mt-12 mb-6 flex items-center text-[1.05rem]">
                    <div className="mx-auto flex flex-col gap-6 justify-center items-start">
                        {menuItems.map((item, index) => (
                          <div key={index} className="flex items-center font-semibold text-[#2B5A9E] cursor-pointer">
                            <div>{item.icon}</div>
                            <div>{item.label}</div>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <Outlet />
            </div>
            <div>
                Side
            </div>
        </main>
        <Footer />
    </div>
  )
}

export default Layout5