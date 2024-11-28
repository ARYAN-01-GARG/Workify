import JobCard from "../Jobs/JobCard"

const HomePage = () => {
  return (
    <div className="w-full flex flex-col gap-10 scroll-smooth">
      <div className="min-h-screen bg-white" id="My home"></div>
      <div className="min-h-screen bg-white" id="Portfolio"></div>
      <div id="Jobs" className="w-full flex flex-col gap-10">
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
      </div>
      <div className="min-h-screen bg-white" id="Tempings"></div>
      <div className="min-h-screen bg-white" id="Applied"></div>
      <div className="min-h-screen bg-white" id="Companies"></div>
      <div className="min-h-screen bg-white" id="Blog"></div>
      <div className="min-h-screen bg-white" id="Membership"></div>
    </div>
  )
}

export default HomePage