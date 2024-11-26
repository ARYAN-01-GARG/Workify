import { useSelector } from "react-redux";
import Button from "./Button"
import NavBar from "./NavBar"
import { UserState } from "../../store/features/auth/UserState";
import { BiBell } from "react-icons/bi";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: { user : UserState}) => state.user.isAuthenticated);
  const navElementsBeforeLogin = ["Home", "Find Jobs", "Find Candidates", "For Recruiters" , "Career Advice"];
  const navElementsAfterLogin = ["Jobs", "Companies", "Communites", "About Us" , "Career Advice"];

  return (
    <header className="sticky top-0 z-50 flex justify-between shadow-sm items-center px-10 py-4 bg-white md:gap-10">
      <div className="py-2 lg:scale-105 min-w-[10vw] cursor-pointer">
        <Link to={'/'}><img src="/images/Workify.svg" alt="logo" /></Link>
      </div>
      <nav className={`lg:flex justify-between items-center px-5 ${isAuthenticated ? '' : '-mr-20'} hidden`}>
        <NavBar elements={isAuthenticated ? navElementsAfterLogin : navElementsBeforeLogin } />
      </nav>
      {
        isAuthenticated ? (
          <div className="flex justify-center items-center gap-5">
            <BiBell size={30} className="mr-6"/>
            <FaRegCircleUser size={30} onClick={() => navigate('/dashboard')} className="cursor-pointer"/>
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