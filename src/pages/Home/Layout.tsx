import { Outlet } from "react-router-dom"
import Header from "../../components/landingPage/Header"
import { BiHomeAlt } from "react-icons/bi"
import Footer from "../../components/landingPage/Footer"
import { AiOutlineFolderOpen } from "react-icons/ai"
import { RxBackpack } from "react-icons/rx"
import { IoMdCopy } from "react-icons/io"
import { PiBuildingOfficeBold } from "react-icons/pi"
import { HiOutlineBookOpen } from "react-icons/hi"

const Layout = () => {
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
                <div className="mt-12 mb-6 flex items-center text-[1.05rem]">
                    <div className="mx-auto flex flex-col gap-6 justify-center items-start">
                        <div className="flex items-center gap-5 font-semibold">
                            <BiHomeAlt size={20}/>
                            <p>My home</p>
                        </div>
                        <div className="flex items-center gap-5 font-semibold">
                            <AiOutlineFolderOpen size={20}/>
                            <p>Portfolio</p>
                        </div>
                        <div className="flex items-center gap-5 font-semibold">
                            <RxBackpack size={20}/>
                            <p>Jobs</p>
                        </div>
                        <div className="flex items-center gap-5 font-semibold">
                            <RxBackpack size={20}/>
                            <p>Tempings</p>
                        </div>
                        <div className="flex justify-center items-center gap-5 font-semibold">
                            <IoMdCopy size={20}/>
                            <p>My Home</p>
                        </div>
                        <div className="flex justify-center items-center gap-5 font-semibold">
                            <PiBuildingOfficeBold size={20}/>
                            <p>My Home</p>
                        </div>
                        <div className="flex justify-center items-center gap-5 font-semibold">
                            <HiOutlineBookOpen size={20}/>
                            <p>My Home</p>
                        </div>
                        <div className="flex  justify-center items-center gap-5 font-semibold">
                            <PiBuildingOfficeBold size={20}/>
                            <p>My Home</p>
                        </div>
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

export default Layout