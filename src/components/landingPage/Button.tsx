import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom"

interface ButtonProps {
    label: string,
    redirect: string,
    type: string,
    Icon? : IconType,
}

const Button = ({
    label,
    redirect,
    type,
} : ButtonProps) => {

    const navigate = useNavigate();
  return (
    <button
        onClick={() => navigate(redirect)}
        className={`
            px-2 py-1
            text-lg
            rounded-lg
            mx-2
            hover:opacity-90
            outline-none
            hover:shadow-none
            ${type === 'link' ? 'text-[#3965A4] font-semibold' : 'bg-[#2A5B9E] text-white font-medium shadow-md'}
    `}>
        {label}
    </button>
  )
}

export default Button