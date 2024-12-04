import { FaStar } from "react-icons/fa6"
import DialogCard from "./DialogCard"
import { JobInput } from "./JobInput"
import { useDispatch, useSelector } from "react-redux"
import { closeRecruiterCompany, createRecruiterProfile, RecruiterState, setIsRecruiterOpen, setRecruiter } from "../../store/features/roleSelection/RecruiterSlice"
import { AppDispatch } from "../../store/store"
import { setUserData } from "../../store/features/UserSlice"
import { UserState } from "../../store/features/auth/UserState"

const RecruiterCompanyDetails = () => {

    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: { user: UserState }) => state.user.userData);
    const recruiter = useSelector((state: { recruiter: RecruiterState }) => state.recruiter.recruiter);

    const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRecruiter({ ...recruiter, companyEmail: e.target.value }));
    };

    const handleCompanyWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRecruiter({ ...recruiter, companyWebsite: e.target.value }));
    };

    const isDisabled = !recruiter.companyEmail || !recruiter.companyWebsite;

    const handleSubmit = () => {
        if(!isDisabled) {
            dispatch(createRecruiterProfile(recruiter)).then(() => {
                dispatch(closeRecruiterCompany());
                dispatch(setIsRecruiterOpen(false));
                dispatch(setUserData({ ...userData , role : 'recruiter' }));
            });
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
                <h1 className="text-xl font-semibold">Your Company Details?</h1>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 py-6 max-w-[95%]">
                <JobInput
                    label={'Company Email'}
                    placeholder={'e.g., company.design@gmail.com'}
                    value={recruiter.companyEmail}
                    onChange={handleCompanyNameChange}
                />
                <JobInput
                    label={'Company Website'}
                    placeholder={'e.g., www.google.com'}
                    value={recruiter.companyWebsite}
                    onChange={handleCompanyWebsiteChange}
                />
            </div>
        </form>
    </DialogCard>
  )
}

export default RecruiterCompanyDetails