import { FaChevronRight } from "react-icons/fa6";

interface TopCompanyCardProps {
    title: string;
    count: number;
}

const TopCompanyCard:React.FC<TopCompanyCardProps> = ({
    title,
    count
}) => {
  return (
    <div className="bg-white py-5 px-8 rounded-2xl text-xl font-semibold text-nowrap">
        <h3 >{title}</h3>
        <p className="text-lg font-medium py-1 text-[#2B5A9E] flex gap-2 items-center">{`${count}+ Companies`}<FaChevronRight size={20}/></p>
    </div>
  )
}

export default TopCompanyCard