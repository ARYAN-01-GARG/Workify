import { useState } from "react"
import { IconType } from "react-icons";
import { FaChevronDown, FaLocationDot } from "react-icons/fa6";
import { HiMiniMagnifyingGlassCircle } from "react-icons/hi2";
import { IoFilterSharp } from "react-icons/io5";

interface SearchInputProps {
    placeholder: string;
    Icon : IconType;
    value: string;
    size?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isBg?: boolean;
}


const SearchBar = () => {
    const [SearchText , setSearchText] = useState('');
    const [location , setLocation] = useState('');
  return (
    <div className="bg-[#F7F6F7] border border-[#D1D1D1] shadow-sm my-3 rounded-2xl">
        <div className="flex gap-5 border-b-2 border-[#D1D1D1] pb-4 mt-5 px-5">
            <SearchInput
                placeholder={'Search a job title'}
                value={SearchText}
                onChange={(e) => setSearchText(e.target.value)}
                Icon={HiMiniMagnifyingGlassCircle}
                size={35}
            />
            <SearchInput
                placeholder={'India'}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                Icon={FaLocationDot}
                size={25}
            />
        </div>
        <div className="flex gap-3 justify-center items-center my-3">
           <IoFilterSharp size={25} className="text-[#2A5A9F] cursor-pointer"/>
           <div className="cursor-pointer font-medium text-xl">Filters</div>
           <FaChevronDown size={15} className="cursor-pointer"/>
        </div>
    </div>
  )
}


export const SearchInput:React.FC<SearchInputProps> = ({
    placeholder,
    Icon,
    value,
    onChange,
    size,
    isBg=false
}) => {
    return (
        <div className={`border-[2px] border-[#6092D0] rounded-xl px-4 py-3 flex-grow flex gap-5 items-center ${isBg ? 'bg-white' : 'bg-transparent'}`}>
            <Icon size={size} className="text-[#2A5A9F] hover:opacity-80 cursor-pointer "/>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`outline-none placeholder:text-[#454545] text-[#454545] text-lg font-medium ${isBg ? 'bg-white' : 'bg-transparent'} w-full`}
             />
        </div>
    )
}

export default SearchBar