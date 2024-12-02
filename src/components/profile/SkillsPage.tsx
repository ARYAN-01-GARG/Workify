import { FaStar } from "react-icons/fa6";
import DialogCard from "./DialogCard";
import { JobInput } from "./JobInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { CandidateState, openResumePage, setCandidate } from "../../store/features/roleSelection/CandidateSlice";
import { closeSkillsPage, SkillsPageState } from "../../store/features/roleSelection/SkillsPageSlice";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const SkillsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [skill , setSkill] = useState<string>('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const candidate = useSelector((state: { candidate: CandidateState }) => state.candidate.candidate);
    const error = useSelector((state: { skillsPage : SkillsPageState }) => state.skillsPage.error);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const skillRegex = /^[a-zA-Z][a-zA-Z0-9\s. ]+$/;

    const handleSkillSelect = (skill: string) => {
        if (!skillRegex.test(skill)) {
            setErrorMessage('Invalid skill format.');
        } else if (selectedSkills.includes(skill)) {
            setErrorMessage('Skill already added.');
        } else if (selectedSkills.length >= 10) {
            setErrorMessage('Maximum number of skills selected.');
        } else {
            setSelectedSkills((prevSkills) => [...prevSkills, skill]);
            setSkill('');
            setErrorMessage('');
        }
    };

    const handleSkillRemove = (skill: string) => {
        setSelectedSkills((prevSkills) => prevSkills.filter((prevSkill) => prevSkill !== skill));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSkills.length >= 10) {
            setErrorMessage('Maximum number of skills selected.');
        } else {
            const properCaseSkill = skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
            handleSkillSelect(properCaseSkill);
        }
    };

    const handleSubmit = () => {
        const updatedCandidate = { ...candidate, skill: selectedSkills };
        dispatch(setCandidate(updatedCandidate));
        dispatch(closeSkillsPage());
        dispatch(openResumePage());
    };

    return (
        <DialogCard
            title="“Welcome to Workify! Let&apos;s start your journey”"
            description="Your next career move is waiting! Let&apos;s fine-tune your profile and get you connected to exciting opportunities tailored just for you."
            action={handleSubmit}
            actionLabel="Proceed"
            disabled={selectedSkills.length === 0}
        >
            <form className="mt-16" onSubmit={handleFormSubmit}>
                <div className="w-full flex gap-2 items-center">
                    <FaStar className="text-[#2B5A9E]" />
                    <h1 className="text-xl font-semibold">Experience</h1>
                </div>
                <div className="flex items-center gap-6 py-6 max-w-[95%]">
                    <JobInput
                        label={'Skills'}
                        placeholder={'Your Skills'}
                        value={skill}
                        error={error}
                        onChange={(e) => setSkill(e.target.value)}
                    />
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <div className="flex gap-3 pt-2 mt-5 flex-wrap">
                    {selectedSkills.map((skill, index) => (
                        <span
                            key={index}
                            className="flex gap-2 items-center bg-[#E6ECF8] px-2 py-1 text-[1.1rem] font-medium rounded-md border border-[#D1D1D1] cursor-pointer"
                        >
                            {skill}<RxCross2 size={15} className="ml-2" onClick={() => handleSkillRemove(skill)} />
                        </span>
                    ))}
                </div>
            </form>
        </DialogCard>
    );
};

export default SkillsPage;