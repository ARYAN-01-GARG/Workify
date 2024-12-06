import { Link } from "react-router-dom"


const MissingPage = () => {
  return (
    <div className="font-semibold h-screen flex flex-col gap-4 justify-center items-center text-4xl flex-wrap bg-[#E7EDF8]">
       <p className="font-semibold">This Page is Secured in <span className="text-[#2B5A9E]">Vault</span></p>
       <p><span className="text-[#2B5A9E]">Verify Yourself</span> to See.</p>
       <p>Who knows! Which perfect Job is <span className="text-[#2B5A9E]">Waiting!</span></p>
       <div className="gap-4 flex text-2xl font-bold text-white mt-5">
        <Link to={'/auth/login'} className="hover:opacity-80 bg-[#2B5A9E] px-4 py-2 rounded-xl">Login</Link>
        <Link to={'/auth/register'} className="hover:opacity-80 bg-[#2B5A9E] px-4 py-2 rounded-xl">Sign up</Link>
       </div>
    </div>
  )
}

export default MissingPage