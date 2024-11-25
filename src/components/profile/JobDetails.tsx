import MagnifyLens from "../assets/MagnifyLens"
import DialogCard from "./DialogCard"
import { JobInput } from "./JobInput"

const JobDetails = () => {
  return (
    <div className="bg-[#F3F6FC] w-[61vw] min-h-[30vh] rounded-2xl pb-10">
        <DialogCard
            title = "“Welcome to Workify! Let&apos;s Build Your Hiring Hub”"
            description="As a recruiter, your path to discovering the best candidates begins now. Update your details, post jobs, and explore talent pools build just for you."
            action={() => {}}
            actionLabel="Proceed"
            disabled={true}
        >
            <form className="mt-16">
                <h1 className="text-xl font-medium">Where do you currently work?</h1>
                <div className="flex gap-6 py-6 max-w-[95%]">
                    <JobInput
                        label="Job title"
                        placeholder="e.g., HR"
                    />
                    <JobInput
                        label="Company"
                        placeholder="e.g., Google"
                    />
                </div>
                <div className="flex gap-12 items-center mb-20 max-w-[95%]">
                    <div className="flex flex-col w-full">
                        <h1 className="text-xl font-medium mb-2">Where are you based?</h1>
                        <JobInput
                            placeholder="Select for a different location"
                            description="You can choose a city, state or country"
                            icon ={<MagnifyLens/>}
                        />
                    </div>
                    <div className="flex flex-col w-full justify-between">
                        <h1 className="text-xl font-medium mb-9">What role are you hiring for?</h1>
                        <JobInput
                            placeholder="Select a role"
                        />
                    </div>
                </div>
                <h1 className="text-xl font-medium">Your Company Details?</h1>
                <div className="flex gap-6 py-6 max-w-[95%]">
                    <JobInput
                        label="Comapny Email"
                        placeholder="e.g., company.design@gmail.com"
                    />
                    <JobInput
                        label="Company Website"
                        placeholder="e.g., Google"
                    />
                </div>
            </form>
        </DialogCard>
    </div>
  )
}

export default JobDetails