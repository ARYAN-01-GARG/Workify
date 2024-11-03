import { Link } from "react-router-dom"

const LandingPage = () => {
  return (
    <div className="bg-sky-600 flex flex-col justify-center items-center text-white min-h-screen text-xl gap-5">
      <p className="font-bold text-4xl">Welcome to Workify 👋</p>
      <Link to="/auth/register" className="bg-black text-white p-4 rounded-xl hover:opacity-80">Sign Up</Link>
    </div>
  )
}

export default LandingPage