import { NavLink } from "react-router-dom"

interface NavBarProps {
    elements: string[]
}

const NavBar = ({
    elements
} : NavBarProps) => {
  return (
    <div className="flex justify-evenly items-center md:gap-8 lg:gap-16 mr-8 font-semibold text-[1.05rem] text-[#333]">
       {elements.map((element, index) => {
            return (
                <NavLink
                    className={({isActive}) => `hover:text-[#3965A4] ${isActive ? 'text-[#3965A4]' : 'text-[#333]'} transition duration-300`}
                    to={`${element === "Home" ? '/' : element}`} key={index}
                >
                    {element}
                </NavLink>
            )
        })}
    </div>
  )
}

export default NavBar