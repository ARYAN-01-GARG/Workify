import { IconType } from "react-icons"
import { GrLocation } from "react-icons/gr"

interface Card3Props{
    Icon?: IconType,
    imageURL? : string,
    location : string,
    title : string,
    outline? : boolean
}

const Card3 = ({
    Icon,
    imageURL,
    location,
    title,
    outline=false
}:Card3Props) => {
  return (
    <div className="p-6 flex flex-col gap-1 w-[29.5vw] border border-[#E4E5E8] rounded-lg shadow-lg shadow-neutral-500/10 my-4 transition hover:scale-[1.04]">
        <div className="flex items-center mb-4 gap-5">
            <div className={`${imageURL ? 'bg-[#EA4C89]' : 'bg-[#F3F6FC]'} p-4 rounded-md `}>
                {Icon ? <Icon size={30} /> : <img src={imageURL} alt={title} />}
            </div>
            <div>
                <h6 className="flex gap-2 text-lg font-medium">
                    {title} <p className={`${outline ? 'bg-[#FCEEEE]' : 'bg-[#E6ECF8]'} rounded-full text-sm text-center px-3 ${outline ? 'text-[#E05151]' : 'text-[#3C74BB]'} flex items-center`}>Featured</p>
                </h6>
                <p className="flex items-center gap-2 font-medium text-sm text-[#767F8C] pt-1">
                    <GrLocation size={20} className="font-bold"/>{location}
                </p>
            </div>
        </div>
        <div className="w-full py-2 text-[#2B5A9E] font-semibold bg-[#E7F0FA] text-center rounded-sm cursor-pointer transition hover:scale-[1.05]">
            Open position (6)
        </div>
    </div>
  )
}

export default Card3