import { useState } from "react";
import MagnifyLens from "../assets/MagnifyLens"
import DialogCard from "./DialogCard"
import { JobInput } from "./JobInput"

const JobDetails = () => {
    const [counter, setCounter] = useState(0);

    const pages = [
        {
            heading: "Where do you currently work?",
            inputs: [
                { label: "Job title", placeholder: "e.g., HR" },
                { label: "Company", placeholder: "e.g., Google" }
            ]
        },
        {
            heading: "Where are you based?",
            inputs: [
                { label: '', placeholder: "Select for a different location", description: "You can choose a city, state or country", icon: <MagnifyLens /> },
                { label: '', placeholder: "Select a role" }
            ]
        },
        {
            heading: "Your Company Details?",
            inputs: [
                { label: "Company Email", placeholder: "e.g., company.design@gmail.com" },
                { label: "Company Website", placeholder: "e.g., Google" }
            ]
        }
    ];

    const handleNext = () => {
        if (counter < pages.length - 1) {
            setCounter((prev) => prev + 1);
        } else {
            return;
        }
    };

    return (
        <div className="bg-[#F3F6FC] w-[61vw] min-h-[30vh] rounded-2xl pb-10">
            <DialogCard
                title="“Welcome to Workify! Let&apos;s Build Your Hiring Hub”"
                description="As a recruiter, your path to discovering the best candidates begins now. Update your details, post jobs, and explore talent pools build just for you."
                action={handleNext}
                actionLabel="Proceed"
                disabled={false}
            >
                <form className={`mt-16`}>
                    <div className="flex gap-36 w-full">
                        <h1 className="text-xl font-medium">{pages[counter].heading}</h1>
                        {counter==1 && <h1 className="text-xl font-medium ">What role are you hiring for?</h1>}
                    </div>
                    <div className={`flex gap-6 py-6 max-w-[95%]`}>
                        {pages[counter].inputs.map((input, index) => ((counter===1 && index===1)?
                            <div className="w-full pt-4">
                                <div className="relative">
                                    <JobInput
                                        key={index}
                                        label={input.label}
                                        placeholder={input.placeholder}
                                        description={input.description}
                                        icon={input.icon}
                                    />
                                </div>
                            </div> :
                                <JobInput
                                    key={index}
                                    label={input.label}
                                    placeholder={input.placeholder}
                                    description={input.description}
                                    icon={input.icon}
                                />
                        ))}
                    </div>
                </form>
            </DialogCard>
        </div>
    )
}

export default JobDetails