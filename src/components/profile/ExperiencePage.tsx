import { FaStar } from "react-icons/fa6";
import DialogCard from "./DialogCard";
import { JobInput } from "./JobInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { closeExperiencePage, ExperiencePageState, setExperience } from "../../store/features/roleSelection/ExperiencePageSlice";
import { CandidateState, setCandidate } from "../../store/features/roleSelection/CandidateSlice";
import JobSelectionInput from "./JobSelectionInput";
import { openSkillsPage } from "../../store/features/roleSelection/SkillsPageSlice";
import { useEffect, useState } from "react";

const ExperiencePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const experience = useSelector((state: { experiencePage: ExperiencePageState }) => state.experiencePage.experience);
    const candidate = useSelector((state: { candidate: CandidateState }) => state.candidate.candidate);

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setExperience({ ...experience, companyName: e.target.value }));
    };

    const handleYearsWorkedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setExperience({ ...experience, yearsWorked: Number(e.target.value) }));
    };

    const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setExperience({ ...experience, position: e.target.value }));
    };


    const handleSubmit = () => {
        dispatch(setCandidate({ ...candidate, experience : [{...experience}] }));
        dispatch(closeExperiencePage());
        dispatch(openSkillsPage());
    };

    return (
        <DialogCard
            title="“Welcome to Workify! Let&apos;s start your journey”"
            description="Your next career move is waiting! Let&apos;s fine-tune your profile and get you connected to exciting opportunities tailored just for you."
            action={handleSubmit}
            actionLabel="Proceed"
            disabled={false}
        >
            <form className="mt-16 w-[90%] mx-auto">
                <div className="w-full flex gap-2 items-center">
                    <FaStar className="text-[#2B5A9E]" />
                    <h1 className="text-xl font-semibold">Experience</h1>
                </div>
                <div className={`flex flex-col md:flex-row items-center gap-6 py-6 ${isLargeScreen ? 'no-wrap' : 'lg:flex-wrap'} `}>
                    <JobInput
                        label={'Company Name'}
                        placeholder={'Your Company Name'}
                        value={experience.companyName}
                        onChange={handleCompanyNameChange}
                    />
                    <JobInput
                        label={'Job title'}
                        placeholder={'e.g., Software Engineer'}
                        value={experience.position}
                        onChange={handlePositionChange}
                    />
                    <JobSelectionInput
                        label={'Years Worked'}
                        options={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                        value={experience.yearsWorked.toString()}
                        onChange={handleYearsWorkedChange}
                    />
                </div>
            </form>
        </DialogCard>
    );
};

export default ExperiencePage;