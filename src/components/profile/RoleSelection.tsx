import React from "react";
import DialogCard from "./DialogCard"
import { useDispatch, useSelector } from "react-redux";
import { RoleSelectionState, setIsOpen, setRole } from "../../store/features/roleSelection/RoleSelectionSlice";
import { setIsCandidateOpen } from "../../store/features/roleSelection/CandidateSlice";
import { setIsRecruiterOpen } from "../../store/features/roleSelection/RecruiterSlice";
import { activeUser } from "../../store/features/UserSlice";

interface RoleCardProps {
    title: string;
    description: string;
    icon : string;
    isSelected?: boolean;
    onClick: () => void;
}

const RoleSelection = () => {
    const dispatch = useDispatch();
    const role = useSelector((state: {roleSelection : RoleSelectionState}) => state.roleSelection.role);

    const handleRoleClick = (selectedRole: string) => {
        dispatch(setRole(selectedRole));
    };

    const handleNext = () => {
        if(role === 'recruiter'){
            dispatch(setIsRecruiterOpen(true));
            dispatch(setIsOpen(false));
        }else if(role === 'candidate'){
            dispatch(setIsCandidateOpen(true));
            dispatch(setIsOpen(false));
        } else {
            return;
        }

    }

  return (
    <div className="bg-[#F3F6FC] w-[61vw] min-h-[30vh] rounded-2xl">
        <DialogCard
            title = "Your account is created- Welcome to Workify!"
            subTitle = "Now, let&apos;s set up your path"
            description="Are you here to find the right talent, or to start an exciting new job journey?"
            action={handleNext}
            actionLabel="Next"
            disabled={!(role === 'candidate' || role === 'recruiter')}
        >
            <form className="flex justify-center items-center gap-8 mt-12">
                <RoleCard
                    title="Talent Seeker"
                    description="For Recruiter"
                    icon={'/images/role-card/recruiter.svg'}
                    isSelected={role === 'recruiter'}
                    onClick={() => handleRoleClick('recruiter')}
                />
                <RoleCard
                    title="Job Hunter"
                    description="For Job Seekers"
                    icon={'/images/role-card/candidate.svg'}
                    isSelected={role === 'candidate'}
                    onClick={() => handleRoleClick('candidate')}
                />
            </form>
        </DialogCard>
    </div>
  )
}

const RoleCard:React.FC<RoleCardProps> = ({
    title,
    description,
    icon,
    isSelected,
    onClick,
}) => {
    return (
        <div className="w-[45%] py-5 px-6 rounded-2xl relative border border-[#6D6D6D] cursor-pointer hover:scale-[1.02]" onClick={onClick}>
            <div className="mx-1">
            <img src={icon} alt="Card-image" loading="lazy"/>
            </div>
            <div className="font-medium text-xl">
            <h4>{title}</h4>
            <p className="text-sm font-medium text-[#4F4F4F]">{`(${description})`}</p>
            </div>
            {isSelected ? (
                <img src="/images/role-card/checkboxChecked.svg" alt="checked" className="absolute p-1 border border-[#6D6D6D] rounded-xl top-5 right-5" />
            ) :
            (
                <div className="border border-[#6D6D6D] absolute p-4 rounded-xl top-5 right-5"/>
            )
            }
        </div>
    )
}

export default RoleSelection