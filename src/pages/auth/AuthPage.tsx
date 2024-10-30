import { Outlet } from "react-router-dom"

const AuthPage = () => {
  return (
    <div
      className="
        flex
        min-h-screen
        bg-[#C8D8EF]

    ">
      <div className="flex justify-center items-center flex-grow bg-[#C8D8EF] max-w-[52vw] text-4xl">
        Images
      </div>
      <div
        className="flex-grow bg-white rounded-s-[3.5rem] max-w-[48vw] shadow-md"
      >
        <Outlet/>
      </div>
    </div>
  )
}

export default AuthPage