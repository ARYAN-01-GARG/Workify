import { useSelector } from "react-redux";
import { CandidateState } from "../store/features/roleSelection/CandidateSlice";
import { RiPencilFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa6";

const ProfileEditPage = () => {
    // const dispatch = useDispatch();
    const candidate = useSelector((state: { candidate : CandidateState}) => state.candidate.candidate);
    console.log(candidate)
  return (
    <div className="absolute min-h-screen w-full bg-neutral-600/70 z-50 flex justify-center items-center">
         <div className="flex flex-col py-16 px-[2.8rem] bg-white rounded-2xl min-w-[65vw] gap-6">
            <h1 className="text-[1.57rem] font-medium">Complete your profile</h1>
            <EditCard>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-4 justify-between items-center"><h2 className="text-xl font-medium">{`${candidate.firstName || ''} ${candidate.lastName || ''}`}</h2><RiPencilFill size={25} className="hover:opacity-70 cursor-pointer"/></div>
                    <div className="text-[1rem] font-medium text-[#454545]">
                        {candidate.phone && <p>{candidate.phone}</p>}
                        {candidate.email && <p>{candidate.email}</p>}
                        {candidate.location && <p>{candidate.location}</p>}
                    </div>
                </div>
            </EditCard>
            <EditCard
                label="Work Experience"
            >
                <div className="flex flex-col gap-3">
                    {candidate.experience.length > 0 && candidate.experience[0].position ?
                        <>
                            <div className="flex gap-4 justify-between items-center"><h2 className="text-xl font-medium">{`${candidate.experience[0].position}`}</h2><div className="flex gap-5 items-center"><RiPencilFill size={25} className="hover:opacity-70 cursor-pointer"/><FaTrash size={20} className="hover:opacity-70 cursor-pointer"/> </div></div>
                            <div className="text-[1rem] font-medium text-[#454545]">
                                {candidate.experience[0].position && <p>{candidate.experience[0].position}</p>}
                                {candidate.experience[0].yearsWorked !== 0 && <p>Years Worked : {candidate.experience[0].yearsWorked}</p>}
                            </div>
                        </> :
                        <div className="flex gap-4 justify-between items-center"><h2 className="text-xl font-medium">Add Experience</h2><RiPencilFill size={25} className="hover:opacity-70 cursor-pointer"/></div>
                    }
                </div>
            </EditCard>
            <EditCard
                label="Education">
                    <>
                        <div className="flex gap-4 justify-between items-center"><h2 className="text-xl font-medium">{`${candidate.education[0].institution || ''}`}</h2><div className="flex gap-5 items-center"><RiPencilFill size={25} className="hover:opacity-70 cursor-pointer"/><FaTrash size={20} className="hover:opacity-70 cursor-pointer"/></div></div>
                    </>
            </EditCard>
         </div>
    </div>
  )
}

export const EditCard = ({
    label,
    children
} : { label? : string,children : React.ReactNode}) => {
    return (
        <div>
            {label && <h2 className="text-xl font-medium mb-3">{label}</h2>}
            <div className="py-5 px-[1.4rem] rounded-lg border border-[#B0B0B0]">
                {children}
            </div>
        </div>
    )
}

export default ProfileEditPage