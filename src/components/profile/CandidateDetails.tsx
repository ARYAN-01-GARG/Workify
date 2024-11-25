import DialogCard from "./DialogCard"
import { JobInput } from "./JobInput"

const CandidateDetails = () => {

    const pageContents = [
        {
            heading : 'Education',
            inputLabels : ['University/Institute','Course'],
            inputPlaceholders : ['Select university/institute','Select course']
        },
        {
            heading : 'Your Preferences',
            inputLabels : ['Location','Career Interests'],
            inputPlaceholders : ['Select location','eg., UI/UX Design, Data Science']
        },
        {
            heading : 'Experience',
            inputLabels : ['Company Name','Current Job title'],
            inputPlaceholders : ['e.g., TCS','e.g., Software Developer']
        }
    ]



  return (
    <div className="bg-[#F3F6FC] w-[61vw] min-h-[30vh] rounded-2xl pb-10">
        <DialogCard
            title = "“Welcome to Workify! Let&apos;s start your journey”"
            description="Your next career move is waiting! Let’s fine-tune your profile and get you connected to exciting opportunities tailored just for you."
            action={() => {}}
            actionLabel="Proceed"
            disabled={true}
        >
            <form className="mt-16">
                <h1 className="text-xl font-semibold">{pageContents[1].heading}</h1>
                <div className="flex gap-6 py-6 max-w-[95%]">
                    <JobInput
                        label={pageContents[1].inputLabels[0]}
                        placeholder={pageContents[1].inputPlaceholders[0]}
                    />
                    <JobInput
                        label={pageContents[1].inputLabels[1]}
                        placeholder={pageContents[1].inputPlaceholders[1]}
                    />
                </div>
            </form>
        </DialogCard>
    </div>
  )
}

export default CandidateDetails