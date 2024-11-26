import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AllRoutesWithOutLogin = () => {

    const navigate = useNavigate();

    useEffect(()=> {
        navigate('/');
    },[navigate])
  return (
    <div className="text-6xl flex justify-center items-center h-screen w-full">404 Not Found</div>
  )
}

export default AllRoutesWithOutLogin