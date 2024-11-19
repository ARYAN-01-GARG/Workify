import Button from "./Button"
import NavBar from "./NavBar"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex justify-between shadow-sm items-center px-10 py-4 bg-white md:gap-10">
      <div className="py-2 lg:scale-105 min-w-[10vw]">
        <img src="/images/Workify.svg" alt="logo" />
      </div>
      <nav className="lg:flex justify-between items-center px-5 -mr-20 hidden">
        <NavBar elements={["Home", "Find Jobs", "Find Candidates", "For Recruiters" , "Career Advice"]} />
      </nav>
      <div className="flex justify-center items-center gap-5">
        <Button redirect='/auth/login' label='Login' type='link'/>
        <Button redirect='/auth/register' label='Sign up' type='normal'/>
      </div>
    </header>
  )
}

export default Header