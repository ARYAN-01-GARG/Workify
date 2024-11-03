import { Outlet, useNavigate } from "react-router-dom"
import RenderImage from "../../components/auth/RenderImage"
import { useState, useEffect } from "react"

const AuthPage = () => {
  const navigate = useNavigate();

  const images =[
    {
      image: "/images/image1.svg",
      title: "Welcome to Workify!",
      subTitle: "Where your career journey begins!",
      width:'500'
    },
    {
      image: "/images/image3.svg",
      title: "Unlock your potential with Workify!",
      subTitle: "Connecting talent and opportunities!",
      width : '550'
    },
    {
      image: "/images/image2.svg",
      title: "Step into your Future Today",
      subTitle: "Unlock potential, embrace opportunity, and shape your future .",
      width : '420'
    }
  ]
  const [currentImage, setCurrentImage] = useState(0);

  const handleImageChange = (val:number) => {
    setCurrentImage(val)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

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
            image={images[currentImage].image}
            width={images[currentImage].width}
            alt="Image"
            className=""
            title={images[currentImage].title}
            subTitle={images[currentImage].subTitle}
          />
        </div>
        <div className="hidden md:flex justify-center items-center gap-2 w-full">
          <div onClick={() => {handleImageChange(0)}} className={`border-[0.25rem] ${currentImage === 0 ? 'border-[#2B5A9E] transition duration-500 w-12' : 'border-white w-7'} rounded-xl`}></div>
          <div onClick={() => {handleImageChange(1)}} className={`border-[0.25rem] ${currentImage === 1 ? 'border-[#2B5A9E] transition duration-500 w-12' : 'border-white w-7'} rounded-xl`}></div>
          <div onClick={() => {handleImageChange(2)}} className={`border-[0.25rem] ${currentImage === 2 ? 'border-[#2B5A9E] transition duration-500 w-12' : 'border-white w-7'} rounded-xl`}></div>
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