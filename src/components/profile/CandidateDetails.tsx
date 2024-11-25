import { useState } from "react";
import DialogCard from "./DialogCard"
import { JobInput } from "./JobInput"

const CandidateDetails = () => {
    const [counter, setCounter] = useState(0);

    const pages = [
        {
            heading: 'Education',
            inputs: [
                { label: 'University/Institute', placeholder: 'Select university/institute' },
                { label: 'Course', placeholder: 'Select course' }
            ]
        },
        {
            heading: 'Your Preferences',
            inputs: [
                { label: 'Location', placeholder: 'Select location' },
                { label: 'Career Interests', placeholder: 'eg., UI/UX Design, Data Science' }
            ]
        },
        {
            heading: 'Experience',
            inputs: [
                { label: 'Company Name', placeholder: 'e.g., TCS' },
                { label: 'Current Job title', placeholder: 'e.g., Software Developer' }
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
                title="“Welcome to Workify! Let&apos;s start your journey”"
                description="Your next career move is waiting! Let&apos;s fine-tune your profile and get you connected to exciting opportunities tailored just for you."
                action={handleNext}
                actionLabel="Proceed"
                disabled={false}
            >
                <form className="mt-16">
                    <h1 className="text-xl font-semibold">{pages[counter].heading}</h1>
                    <div className="flex gap-6 py-6 max-w-[95%]">
                        {pages[counter].inputs.map((input, index) => (
                            <JobInput
                                key={index}
                                label={input.label}
                                placeholder={input.placeholder}
                            />
                        ))}
                    </div>
                </form>
            </DialogCard>
        </div>
    )
}

export default CandidateDetails