import { useState } from "react";
import { closeResumePage, setIsCandidateOpen } from "../../store/features/roleSelection/CandidateSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../store/features/UserSlice";
import { setCandidate, uploadResume } from "../../store/features/roleSelection/RoleSelectionSlice";
import { UserState } from "../../store/features/auth/UserState";
import { AppDispatch } from "../../store/store";
import EducationPage from "./EducationPage";
import { EducationState } from "../../store/features/roleSelection/EducationPageSlice";
import PreferencePage from "./PreferencePage";
import { PreferencePageState } from "../../store/features/roleSelection/PreferencePageSlice";
import ExperiencePage from "./ExperiencePage";
import { ExperiencePageState } from "../../store/features/roleSelection/ExperiencePageSlice";
import SkillsPage from "./SkillsPage";
import { SkillsPageState } from "../../store/features/roleSelection/SkillsPageSlice";
import { CandidateState } from "../../store/features/roleSelection/CandidateSlice";
import DialogCard from "./DialogCard";
import { FaCheckCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const CandidateDetails = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [isLoading , setIsLoading] = useState(false);
    const isEducationOpen = useSelector((state: {educationPage : EducationState}) => state.educationPage.isEducationOpen);
    const isPreferenceOpen = useSelector((state: { preferencePage : PreferencePageState}) => state.preferencePage.isPreferenceOpen);
    const isExperienceOpen = useSelector((state: { experiencePage: ExperiencePageState }) => state.experiencePage.isExperienceOpen);
    const isSkillsOpen = useSelector((state: { skillsPage: SkillsPageState }) => state.skillsPage.isSkillsOpen);
    const isResumeOpen = useSelector((state: { candidate: CandidateState }) => state.candidate.isResumeOpen);
    const candidate = useSelector((state: { candidate: CandidateState }) => state.candidate.candidate);
    const userData = useSelector((state: { user: UserState }) => state.user.userData);
    const token = useSelector((state: { user: UserState }) => state.user.token) as string;
    const [isResume , setIsResume] = useState(false);

    const handleNext = () => {
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        const resumeFile = fileInput && fileInput.files ? fileInput.files[0] : null;
        const resumeFileName = resumeFile ? resumeFile.name : null;
        dispatch(setCandidate({ ...candidate, isResumeUploaded: isResume, resumeFileName: resumeFileName }));
        try {
            if (resumeFile) {
                setIsLoading(true);
                dispatch(uploadResume({ resume: resumeFile, token })).then((res) => {
                    if(res.type === 'roleSelection/uploadResume/fulfilled'){
                    dispatch(setIsCandidateOpen(false));
                    dispatch(closeResumePage());
                    dispatch(setUserData({ ...userData, role: 'candidate' }));
                    setIsLoading(false);
                }});
            }
        } catch (error) {
            console.error("Error uploading resume:", error);
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        dispatch(setIsCandidateOpen(false));
        dispatch(closeResumePage())
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                console.error("Please upload a valid PDF file.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                console.error("File size should be less than 5 MB.");
                return;
            }
            setIsResume(true);
            console.log("PDF file uploaded:", file.name);
        }
    };

    const handleCutResume = () => {
        setIsResume(false);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const ResumePage = (
        <DialogCard
            title="Upload a recent resume or CV"
            description="Autocomplete your profile in just a few seconds by uploading a resume."
            action={isResume ? handleNext : handleSkip}
            actionLabel={isResume ? "Upload Resume" : 'Skip for Now'}
            disabled={isLoading}
            isResume={isResume}
        >
            <div className="w-[90%] mx-auto flex flex-col gap-10 justify-center items-center my-6">
                {!isResume ? (
                    <>
                        <img src="/images/role-card/UploadResume.svg" alt="Upload Resume" />
                        <p className="text-[#4F4F4F] text-sm font-medium text-center">Click the button below to upload your resume as a .pdf, .doc, .docx,.rtf or .txt file</p>
                    </>
                ) : (
                    <div className="flex gap-4 items-center border border-[#7f7e7e] px-3 py-2 rounded-lg">
                        <FaCheckCircle className="text-[#2cc655] text-4xl" />
                        <span className="text-xl">Resume Selected</span>
                        <RxCross2 size={20} className="hover:opacity-80 cursor-pointer" onClick={handleCutResume}/>
                    </div>
                )}
                <button className="bg-[#2B5A9E] text-[#F3F6FC] font-medium text-xl py-3 px-10 md:w-[350px] rounded-lg hover:opacity-80">
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
    )

    return (
        <div className="bg-[#F3F6FC] w-[85vw] lg:w-[61vw] min-h-[30vh] rounded-2xl pb-10">
            {isEducationOpen && <EducationPage/>}
            {isPreferenceOpen && <PreferencePage/>}
            {isExperienceOpen && <ExperiencePage />}
            {isSkillsOpen && <SkillsPage />}
            {isResumeOpen && ResumePage}
        </div>
    )
}

export default CandidateDetails