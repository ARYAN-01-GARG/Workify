import DialogCard from "./DialogCard"

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
            <JobCard/>
        </DialogCard>
    </div>
  )
}

const JobCard= () => {
    return (
        <div className="">
            hello
        </div>
    )
}

export default JobDetails