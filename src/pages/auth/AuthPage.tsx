import { Outlet } from "react-router-dom"
import RenderImage from "../../components/auth/RenderImage"

const AuthPage = () => {
  return (
    <div
      className="
        md:flex
        min-h-screen
        bg-[#C8D8EF]

    ">
      <div className="flex flex-col justify-center items-center flex-grow min-h-[12vh] md:min-h-screen p-6 bg-[#C8D8EF] md:max-w-[52vw] text-4xl">
        <div>
          logo
        </div>
        <div className="hidden md:block">
          <RenderImage/>
        </div>
        <div className="hidden md:block">
          1-2-3
        </div>
      </div>
      <div
        className="md:flex-grow bg-white rounded-t-[2rem] md:rounded-r-none md:rounded-s-[3.5rem] md:max-w-[48vw] min-h-[88vh] md:min-h-screen shadow-md"
      >
        <Outlet/>
      </div>
    </div>
  )
}

export default AuthPage