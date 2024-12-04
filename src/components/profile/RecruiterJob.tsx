import { FaStar } from "react-icons/fa6"
import DialogCard from "./DialogCard"
import { JobInput } from "./JobInput"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { closeRecruiterJob, openRecruiterLocation, RecruiterState, setRecruiter } from "../../store/features/roleSelection/RecruiterSlice";

const RecruiterJob = () => {

    const dispatch = useDispatch<AppDispatch>();
    const recruiter = useSelector((state : {recruiter : RecruiterState }) => state.recruiter.recruiter);

    const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRecruiter({ ...recruiter, jobTitle: e.target.value }));
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRecruiter({ ...recruiter, companyName : e.target.value }));
    };

    const isDisabled = !recruiter.jobTitle || !recruiter.companyName;

    const handleSubmit = () => {
        if(!isDisabled) {
            dispatch(setRecruiter({ ...recruiter }));
            dispatch(closeRecruiterJob());
            dispatch(openRecruiterLocation());
        }
    }

  return (
    <DialogCard

            title="“Welcome to Workify! Let&apos;s start your journey”"
            description="Your next career move is waiting! Let&apos;s fine-tune your profile and get you connected to exciting opportunities tailored just for you."
            action={handleSubmit}
            actionLabel="Proceed"
            disabled={isDisabled}
        >
            <form className="mt-16">
                <div className="w-full flex gap-2 items-center">
                    <FaStar className="text-[#2B5A9E]" />
                    <h1 className="text-xl font-semibold">Where do you currently work?</h1>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 py-6 max-w-[95%]">
                    <JobInput
                        label={'Job title'}
                        placeholder={'e.g., Recruiting Manager'}
                        value={recruiter.jobTitle}
                        onChange={handleJobTitleChange}
                    />
                    <JobInput
                        label={'Company'}
                        placeholder={'e.g., Google'}
                        value={recruiter.companyName}
                        onChange={handleCompanyChange}
                    />
                </div>
            </form>
        </DialogCard>
  )
}

export default RecruiterJob