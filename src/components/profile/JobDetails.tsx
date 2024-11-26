import { useState } from "react";
import { useDispatch } from "react-redux";
import { setRecruiter } from "../../store/features/roleSelection/RoleSelectionSlice";
import MagnifyLens from "../assets/MagnifyLens";
import DialogCard from "./DialogCard";
import { JobInput } from "./JobInput";
import { FaStar } from "react-icons/fa6";
import { setIsRecruiterOpen } from "../../store/features/roleSelection/RecruiterSlice";
import { setUserData } from "../../store/features/UserSlice";

const JobDetails = () => {
    const dispatch = useDispatch();
    const [counter, setCounter] = useState(0);
    const [pages, setPages] = useState([
        {
            heading: "Where do you currently work?",
            inputs: [
                { label: "Job title", value: '', placeholder: "e.g., HR", isRequired: true },
                { label: "Company", value: '', placeholder: "e.g., Google", isRequired: true }
            ]
        },
        {
            heading: "Where are you based?",
            inputs: [
                { label: '', value: '', placeholder: "Select for a different location", description: "You can choose a city, state or country", icon: <MagnifyLens />, isRequired: true },
                { label: '', value: '', placeholder: "Select a role", isRequired: true }
            ]
        },
        {
            heading: "Your Company Details?",
            inputs: [
                { label: "Company Email", value: '', placeholder: "e.g., company.design@gmail.com", isRequired: true },
                { label: "Company Website", value: '', placeholder: "e.g., Google", isRequired: true },
            ]
        }
    ]);

    const setChange = (index: number, value: string) => {
        const newPages = [...pages];
        newPages[counter].inputs[index].value = value;
        setPages(newPages);
    };

    const isFormValid = () => {
        return pages[counter].inputs.every(input => input.value.trim() !== '');
    };

    const handleNext = () => {
        if (counter < pages.length - 1) {
            setCounter((prev) => prev + 1);
        } else {
            dispatch(setIsRecruiterOpen(false));
            dispatch(setUserData({ role: 'recruiter' }));
            dispatch(setRecruiter({
                jobTitle: pages[0].inputs[0].value,
                companyName: pages[0].inputs[1].value,
                location: pages[1].inputs[0].value,
                jobType: pages[1].inputs[1].value,
                companyEmail: pages[2].inputs[0].value,
                companyWebsite: pages[2].inputs[1].value,
                jobDescription: pages[2].inputs[2].value,
                jobRequirements: pages[2].inputs[3].value
            }));
        }
    };

    return (
        <div className="bg-[#F3F6FC] w-[61vw] min-h-[30vh] rounded-2xl pb-10">
            <DialogCard
                title="“Welcome to Workify! Let&apos;s Build Your Hiring Hub”"
                description="As a recruiter, your path to discovering the best candidates begins now. Update your details, post jobs, and explore talent pools build just for you."
                action={handleNext}
                actionLabel="Proceed"
                disabled={!isFormValid()}
            >
                <form className={`mt-16`}>
                    <div className="flex w-full">
                        <div className="w-full flex gap-2 items-center">
                            {pages[counter].inputs.some(input => input.isRequired) && <FaStar className="text-[#2B5A9E]" />}
                            <h1 className="text-xl font-semibold">{pages[counter].heading}</h1>
                        </div>
                        {counter==1 && <h1 className="text-xl font-semibold w-full flex gap-2"><FaStar className="text-[#2B5A9E]" /><span>What role are you hiring for?</span></h1>}
                    </div>
                    <div className={`flex gap-6 py-6 max-w-[95%]`}>
                        {pages[counter].inputs.map((input, index) => (
                            (counter === 1 && index === 1) ? (
                                <div className="w-full pt-4" key={index}>
                                    <div className="relative">
                                        <JobInput
                                            label={input.label}
                                            placeholder={input.placeholder}
                                            value={input.value}
                                            onChange={(e) => setChange(index, e.target.value)}
                                            description={input.description}
                                            icon={input.icon}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <JobInput
                                    key={index}
                                    label={input.label}
                                    placeholder={input.placeholder}
                                    value={input.value}
                                    onChange={(e) => setChange(index, e.target.value)}
                                    description={input.description}
                                    icon={input.icon}
                                />
                            )
                        ))}
                    </div>
                </form>
            </DialogCard>
        </div>
    )
}

export default JobDetails;