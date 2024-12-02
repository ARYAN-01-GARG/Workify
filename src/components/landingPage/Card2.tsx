
interface Card2Props {
    imageURL : string,
    title: string,
    description: string,
    className? : string
}

const Card2:React.FC<Card2Props> = ({
    imageURL,
    title,
    description,
    className
}) => {
  return (
    <div className={`${className} flex items-center md:pl-6 max-w-[45vw] lg:max-w-[50vw] min-w-[20vw] gap-5 py-3 cursor-pointer`}>
      <div className="bg-[#E6ECF8] p-2 md:p-5 rounded-lg">
        <img src={imageURL} alt="Image" />
      </div>
        <div className="text-[.7rem]">
          <p className="font-medium md:text-lg text-[#3D3D3D] text-nowrap">{title}</p>
          <p className="font-medium md:text-sm text-[#5E6670]">{description}</p>
        </div>
    </div>
  )
}

export default Card2