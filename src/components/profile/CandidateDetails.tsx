import { useState } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa"; // Import FaCheckCircle icon
import DialogCard from "./DialogCard"
import { JobInput } from "./JobInput"
import { setIsCandidateOpen } from "../../store/features/roleSelection/CandidateSlice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/features/UserSlice";
import { setCandidate } from "../../store/features/roleSelection/RoleSelectionSlice";

const CandidateDetails = () => {

    const dispatch = useDispatch();
    const [counter, setCounter] = useState(0);
    const [pages, setPages] = useState([
        {
            heading: 'Education',
            inputs: [
                { label: 'University/Institute', value: '' , placeholder: 'Select university/institute', isRequired: true },
                { label: 'Course', value : '' , placeholder: 'Select course', isRequired: true }
            ]
        },
        {
            heading: 'Your Preferences',
            inputs: [
                { label: 'Location',value: '' , placeholder: 'Select location', isRequired: true },
                { label: 'Career Interests',value: '' , placeholder: 'eg., UI/UX Design, Data Science', isRequired: true }
            ]
        },
        {
            heading: 'Experience',
            inputs: [
                { label: 'Company Name',value: '' , placeholder: 'e.g., TCS', isRequired: false },
                { label: 'Current Job title',value: '' , placeholder: 'e.g., Software Developer' , isRequired: false}
            ]
        }
    ]);
    const [isResume , setIsResume] = useState(false);

    const setChange = (index: number, value: string) => {
        const newPages = [...pages];
        newPages[counter].inputs[index].value = value;
        setPages(newPages);
    };

    const isFormValid = () => {
        if (counter <= 1){
            return pages[counter].inputs.every(input => input.value.trim() !== '');
        }
        return true;
    };

    const handleNext = () => {
        if (counter < pages.length) {
            setCounter((prev) => prev + 1);
        } else {
            dispatch(setIsCandidateOpen(false));
            dispatch(setUserData({ role: 'candidate' }));
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            const resumeFile = fileInput && fileInput.files ? fileInput.files[0] : null;
            dispatch(setCandidate({
                education: pages[0].inputs[0].value,
                course: pages[0].inputs[1].value,
                location: pages[1].inputs[0].value,
                careerInterests: pages[1].inputs[1].value,
                companyName: pages[2].inputs[0].value,
                currentJobTitle: pages[2].inputs[1].value,
                isResumeUploaded: isResume,
                resumeFile: resumeFile
            }));
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setIsResume(true);
            console.log("PDF file uploaded:", file.name);
        } else {
            console.error("Please upload a valid PDF file.");
        }
    };

    return (
        <div className="bg-[#F3F6FC] w-[61vw] min-h-[30vh] rounded-2xl pb-10">
            {counter < pages.length ? (
                <DialogCard
                    title="“Welcome to Workify! Let&apos;s start your journey”"
                    description="Your next career move is waiting! Let&apos;s fine-tune your profile and get you connected to exciting opportunities tailored just for you."
                    action={handleNext}
                    actionLabel="Proceed"
                    disabled={!isFormValid()}
                >
                    <form className="mt-16">
                        <div className="w-full flex gap-2 items-center">
                            {pages[counter].inputs.some(input => input.isRequired) && <FaStar className="text-[#2B5A9E]" />}
                            <h1 className="text-xl font-semibold">{pages[counter].heading}</h1>
                        </div>
                        <div className="flex gap-6 py-6 max-w-[95%]">
                            {pages[counter].inputs.map((input, index) => (
                                <JobInput
                                    key={index}
                                    label={input.label}
                                    placeholder={input.placeholder}
                                    value={input.value}
                                    onChange={(e) => setChange(index, e.target.value)}
                                />
                            ))}
                        </div>
                    </form>
                </DialogCard>
            ) : (
                <DialogCard
                    title="Upload a recent resume or CV"
                    description="Autocomplete your profile in just a few seconds by uploading a resume."
                    action={handleNext}
                    actionLabel={isResume ? "Complete Profile" : 'Skip'}
                    disabled={false}
                >
                    <div className="w-[90%] mx-auto flex flex-col gap-10 justify-center items-center my-6">
                        {!isResume ? (
                            <img src="/images/role-card/UploadResume.svg" alt="Upload Resume" />
                        ) : (
                            <div className="flex gap-4 items-center">
                                <FaCheckCircle className="text-[#2cc655] text-4xl" />
                                <span className="text-xl">Resume Uploaded</span>
                            </div>
                        )}
                        <button className="bg-[#2B5A9E] text-[#F3F6FC] font-medium text-xl py-3 w-[350px] rounded-lg hover:opacity-80">
                            <label htmlFor="file-upload" className="cursor-pointer">
                                {isResume ? 'Change Resume' : 'Upload Resume'}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </button>
                    </div>
                </DialogCard>
            )}
        </div>
    )
}

export default CandidateDetails