import Button from "./Button"
import NavBar from "./NavBar"

const Header = () => {
  return (
    <header className="sticky top-0 flex justify-between items-center px-10 py-4 bg-white md:gap-10">
      <div className="py-2 scale-105">
        <img src="/public/images/Workify.svg" alt="logo" />
      </div>
      <nav className="flex justify-between items-center px-5 min-w-[65vw]">
        <NavBar elements={["Home", "Find Jobs", "Find Candidates", "For Recruiters" , "Career Advice"]} />
        <div className="flex justify-center items-center gap-5">
          <Button redirect='/auth/login' label='Login' type='link'/>
          <Button redirect='/auth/register' label='Sign up' type='normal'/>
        </div>
      </nav>
    </header>
  )
}

export default Header