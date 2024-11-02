import { Outlet, useNavigate } from "react-router-dom"
import RenderImage from "../../components/auth/RenderImage"

const AuthPage = () => {
  const navigate = useNavigate()
  return (
    <div
      className="
        md:flex
        min-h-screen
        bg-[#C8D8EF]

    ">
      <div className="relative flex flex-col justify-center items-center  gap-3 flex-grow min-h-[12vh] md:min-h-screen p-6 bg-[#C8D8EF] md:max-w-[52vw] text-4xl">
        <button
          className="absolute top-10 left-8 md:top-5 md:left-14"
          onClick={() => navigate("/")}
        >
          <img src="/images/Workify.svg" alt="Logo" />
        </button>
        <div className="hidden md:block w-full h-[80%] mt-10">
          <RenderImage
            image="/images/image1.svg"
            alt="Description of SVG"
            className=""
            title="Welcome to Workify!"
            subTitle="Where your career journey begins!"
          />
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

export default AuthPage;