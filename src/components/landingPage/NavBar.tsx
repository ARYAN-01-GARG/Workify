import { NavLink } from "react-router-dom"

interface NavBarProps {
    elements: string[]
}

const NavBar = ({
    elements
} : NavBarProps) => {
  return (
    <div className="flex justify-evenly items-center md:gap-8 lg:gap-12 mr-8 font-[650] text-[1.05rem] text-[#16233B]">
       {elements.map((element, index) => {
            return (
                <NavLink
                    className={({isActive}) => `hover:text-[#3965A4] ${isActive ? 'text-[#3965A4]' : 'text-[#16233B]'} transition duration-300`}
                    to={`${element === "Home" ? '/' : `/${element.toLowerCase().replace(/\s+/g, '-')}`}`} key={index}
                    end
                >
                    {element}
                </NavLink>
            )
        })}
    </div>
  )
}

export default NavBar