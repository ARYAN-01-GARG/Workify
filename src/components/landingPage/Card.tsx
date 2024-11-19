
interface CardProps {
    imageURL: string;
    count: string | number;
    description: string;
}

const Card:React.FC<CardProps> = ({
    imageURL,
    count,
    description,
}) => {
  return (
    <div className="px-5 bg-white w-[167px] h-[71px] lg:min-w-[21vw] lg:min-h-[118px] flex justify-start items-center gap-5 rounded-lg shadow-md">
        <div className="bg-[#E7F0FA] p-[3px] lg:p-5 rounded-md">
            <img src={imageURL} alt="Image" className={`w-full h-full ${imageURL === '/images/landing-page/briefcase.svg' ? '' : 'my-1 mr-2'} `}/>
        </div>
        <div className="">
            <p className="font-medium md:text-xl text-[#18191C]">{count}</p>
            <p className="font-semibold text-sm lg:text-[1rem] text-[#767F8C] text-nowrap">{description}</p>
        </div>
    </div>
  )
}

export default Card