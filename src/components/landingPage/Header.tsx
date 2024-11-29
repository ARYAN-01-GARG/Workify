import { useDispatch, useSelector } from "react-redux";
import Button from "./Button"
import NavBar from "./NavBar"
import { UserState } from "../../store/features/auth/UserState";
import { BiBell } from "react-icons/bi";
import { FaRegCircleUser, FaRegUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../store/store";
import { activeUser, logout } from "../../store/features/UserSlice";
import { MdLogout } from "react-icons/md";

const Header = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: { user : UserState}) => state.user.isAuthenticated);
  const role = useSelector((state: { user : UserState}) => state.user.userData.role);
  const [isOpen , setIsOpen] = useState(false);
  const navElementsBeforeLogin = ["Home", "Find Jobs", "Find Candidates", "For Recruiters" , "Career Advice"];
  const navElementsForCandidate = ["Jobs", "Companies", "Chats", "About Us" , "Career Advice"];
  const navElementsForRecruiter = ["Post a Job", "Find Talent", "Chats", "About Us"];

  useEffect(() => {
    dispatch(activeUser());
  }, [dispatch,isAuthenticated, role]);

  const handleLogout = () => {
    dispatch(logout());
  }

  const UserMenu =(
    <div className="absolute py-3 bg-[#fffefe] top-10 -right-7 px-4 rounded-xl flex flex-col gap-3">
      <div
        className="py-2 px-3 bg-[#E6ECF8] text-[#2B5A9E] text-sm font-medium flex gap-2 items-center text-nowrap rounded-2xl cursor-pointer transition hover:bg-[#2B5A9E] hover:text-white"
        onClick={() => navigate('/profile')}
      >
        <FaRegUser size={20} className="cursor-pointer"/>
        <span>View Profile</span>
      </div>
      <div
        className="py-2 px-3 bg-[#E6ECF8] text-[#2B5A9E] text-sm font-medium flex gap-2 items-center text-nowrap rounded-2xl cursor-pointer transition hover:bg-[#2B5A9E] hover:text-white"
        onClick={handleLogout}
      >
        <MdLogout size={25} className="cursor-pointer"/>
        <span>Log out</span>
      </div>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 flex justify-between shadow-sm items-center px-10 py-4 bg-white md:gap-10">
      <div className="py-2 lg:scale-105 min-w-[10vw] cursor-pointer">
        <Link to={'/'}><img src="/images/Workify.svg" alt="logo" /></Link>
      </div>
      <nav className={`lg:flex justify-between items-center px-5 ${isAuthenticated ? '' : '-mr-20'} hidden`}>
        <NavBar elements={!isAuthenticated ? navElementsBeforeLogin : role ==='recruiter' ? navElementsForRecruiter : role === 'candidate' ? navElementsForCandidate : navElementsBeforeLogin } />
      </nav>
      {
        (isAuthenticated && role !== '') ? (
          <div className="flex justify-center items-center gap-5 relative">
            <BiBell size={30} className="mr-6"/>
            <FaRegCircleUser size={30} onClick={() => setIsOpen((prev)=> !prev)} className="cursor-pointer bg-slate-300 rounded-full"/>
            {isOpen && UserMenu}
          </div>
        ) : (
          <div className="flex justify-center items-center gap-5">
            <Button redirect='/auth/login' label='Login' type='link'/>
            <Button redirect='/auth/register' label='Sign up' type='normal'/>
          </div>
        )
      }
    </header>
  )
}

export default Header