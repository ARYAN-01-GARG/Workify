import { FaStar } from "react-icons/fa6"
import DialogCard from "./DialogCard"
import { JobInput } from "./JobInput"
import JobSelectionInput from "./JobSelectionInput"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../store/store"
import { closeEducationPage, EducationState, setEducation } from "../../store/features/roleSelection/EducationPageSlice"
import { CandidateState , setCandidate } from "../../store/features/roleSelection/CandidateSlice"
import { openPreferencePage } from "../../store/features/roleSelection/PreferencePageSlice"

const cousreOptions = [
    'Inter',
    'Diploma',
    'B.Tech',
    'M.Tech',
    'B.Sc',
    'M.Sc',
    'B.Com',
    'M.Com',
    'B.A',
    'M.A',
    'BBA',
    'MBA',
    'BCA',
    'MCA',
    'others'
]

const EducationPage = () => {

    const dispatch = useDispatch<AppDispatch>();
    const university = useSelector((state: { educationPage: EducationState }) => state.educationPage.education.institution);
    const candidate = useSelector((state : { candidate : CandidateState }) => state.candidate);
    const education = useSelector((state: { educationPage: EducationState }) => state.educationPage.education);
    const degree = useSelector((state: { educationPage: EducationState }) => state.educationPage.education.degree);

    const setUniversity = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setEducation({ ...education, institution: e.target.value }));
    }

    const setDegree = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setEducation({ ...education, degree: e.target.value }));
    }

    const isFormValid = university.trim() !== '' && degree.trim() !== '';

    const handleSubmit = () => {
        if (isFormValid) {
            dispatch(setCandidate({ ...candidate, education : [{...education}] }));
            dispatch(closeEducationPage());
            dispatch(openPreferencePage());
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
                    <h1 className="text-xl font-semibold">Education</h1>
                </div>
                <div className="flex  items-center gap-6 py-6 max-w-[95%]">
                    <JobInput
                        label={'University/Institute'}
                        placeholder={'select university/institute'}
                        value={university}
                        onChange={setUniversity}
                    />
                    <JobSelectionInput
                        label={'Course'}
                        options={cousreOptions}
                        value={degree}
                        onChange={setDegree}
                    />
                </div>
            </form>
        </DialogCard>
    )
}

export default EducationPage