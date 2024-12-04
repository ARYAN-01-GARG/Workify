import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { closeRecruiterLocation, openRecruiterCompany, RecruiterState, setRecruiter } from "../../store/features/roleSelection/RecruiterSlice";
import DialogCard from "./DialogCard";
import { FaStar } from "react-icons/fa6";
import { JobInput } from "./JobInput";
import JobSelectionInput from "./JobSelectionInput";

const RecruiterLocation = () => {
  const dispatch = useDispatch<AppDispatch>();
    const recruiter = useSelector((state : {recruiter : RecruiterState }) => state.recruiter.recruiter);

    const handleCompanyLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRecruiter({ ...recruiter, companyLocation: e.target.value }));
    };

    const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setRecruiter({ ...recruiter,  industry: e.target.value }));
    };

    const isDisabled = !recruiter.companyLocation || !recruiter.industry;

    const handleSubmit = () => {
        if(!isDisabled) {
            dispatch(setRecruiter({ ...recruiter }));
            dispatch(closeRecruiterLocation());
            dispatch(openRecruiterCompany());
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
          <div className="flex flex-col md:flex-row gap-6 py-6 max-w-[95%]">
            <div className="w-full flex flex-col gap-2 items-start">
              <div className="flex gap-2 items-center justify-start">
                <FaStar className="text-[#2B5A9E]" />
                <h1 className="text-xl font-semibold">Where are you based?</h1>
              </div>
              <JobInput
                  description={'You can choose a city, state or country'}
                  placeholder={"Search for a different location"}
                  value={recruiter.companyLocation}
                  onChange={handleCompanyLocationChange}
              />
            </div>
            <div className="w-full flex flex-col gap-2 items-start justify-between">
              <div className="flex gap-2 items-center justify-start">
                <FaStar className="text-[#2B5A9E]" />
                <h1 className="text-xl font-semibold">Company Type?</h1>
              </div>
                <JobSelectionInput
                    options={['IT', 'Finance', 'Healthcare', 'Retail', 'Manufacturing','Product-based', 'Other']}
                    value={recruiter.industry}
                    onChange={handleIndustryChange}
                />
            </div>
          </div>
        </form>
    </DialogCard>
  )
}

export default RecruiterLocation