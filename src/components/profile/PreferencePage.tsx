import { FaStar } from "react-icons/fa6"
import DialogCard from "./DialogCard"
import JobSelectionInput from "./JobSelectionInput"
import { JobInput } from "./JobInput"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { closePreferencePage, PreferencePageState, setLocation, setDomain } from "../../store/features/roleSelection/PreferencePageSlice";
import { CandidateState, setCandidate } from "../../store/features/roleSelection/CandidateSlice";
import { openExperiencePage } from "../../store/features/roleSelection/ExperiencePageSlice";

const domainOptions = [
    'UI/UX Design',
    'Data Science',
    'Frontend Development',
    'Backend Development',
    'Fullstack Development',
    'Mobile Development',
    'DevOps & SysAdmin',
    'Quality Assurance',
    'Cyber Security',
    'Cloud Computing',
    'Game Development',
    'Project Management',
    'Machine Learning',
    'Software Development',
    'Product Management',
    'Marketing',
    'Finance',
    'Human Resources',
    'Operations',
    'Others'
]

const PreferencePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: { preferencePage: PreferencePageState }) => state.preferencePage.location);
    const domain = useSelector((state: { preferencePage: PreferencePageState }) => state.preferencePage.domain);
    const candidate = useSelector((state: { candidate: CandidateState }) => state.candidate.candidate);

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setLocation(e.target.value));
    }

    const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setDomain(e.target.value));
    }

    const isFormValid = location.trim() !== '' && domain.trim() !== '';

    const handleSubmit = () => {
        if (isFormValid) {
            dispatch(setCandidate({ ...candidate , location , domain }));
            dispatch(closePreferencePage());
            dispatch(openExperiencePage());
        } else return;
    };

    return (
        <DialogCard
            title="“Welcome to Workify! Let&apos;s start your journey”"
            description="Your next career move is waiting! Let&apos;s fine-tune your profile and get you connected to exciting opportunities tailored just for you."
            action={handleSubmit}
            actionLabel="Proceed"
            disabled={!isFormValid}
        >
            <form className="mt-16">
                <div className="w-full flex gap-2 items-center">
                    <FaStar className="text-[#2B5A9E]" />
                    <h1 className="text-xl font-semibold">Your Preferences</h1>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 py-6 max-w-[95%]">
                    <JobInput
                        label={'Location'}
                        placeholder={'Your Location'}
                        value={location}
                        onChange={handleLocationChange}
                    />
                    <JobSelectionInput
                        label={'Domain'}
                        options={domainOptions}
                        value={domain}
                        onChange={handleDomainChange}
                    />
                </div>
            </form>
        </DialogCard>
    )
}

export default PreferencePage