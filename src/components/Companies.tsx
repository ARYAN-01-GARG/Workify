import { Link } from "react-router-dom"

const Companies = () => {
  return (
    <div className="mb-16">
        <div className="w-full">
            <img src="/images/apple.png" alt="apple png" className="w-full"/>
        </div>
        <div className="flex gap-10 items-center pl-28 pr-10">
          <div className="-mt-16 w-[20vw]">
            <img src="/images/appleIcon.png" alt="apple Icon" className="w-full h-full"/>
          </div>
          <div className="py-10 w-full">
            <div className="flex justify-between gap-3 items-center w-full">
              <div className="">
                <h1 className="text-[2.5rem] font-semibold">Apple</h1>
                <p className="text-xl text-[#3D3D3D] font-medium">Think Different - But Not Too Different</p>
              </div>
              <div className="flex gap-5 ">
                <Link to={'gshgshj'} className="bg-[#E6ECF8] text-xl font-medium py-2 px-5 border border-[#757474] rounded-2xl hover:bg-[#d4dae5] ">Create Job Alert</Link>
                <button className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80">Follow</button>
              </div>
            </div>
            <div className="flex max-w-[50%] gap-10">
              <p className="flex flex-col gap-2 py-4">
                <span className="font-semibold text-[#3D3D3D]">Website</span>
                <a href={'www.google.com'} target="blank" className="text-[#2B5A9E] underline font-semibold">apple.com</a>
              </p>
              <p className="flex flex-col gap-2 py-4">
                <span className="font-semibold text-[#3D3D3D]">Location</span>
                <span className="font-semibold text-black" >Cupertino, California</span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <h3>Overview</h3>
            <h3>Jobs</h3>
          </div>
          <div>
            <div>

            </div>
            <div>
              <div>

              </div>
              <div>

              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Companies