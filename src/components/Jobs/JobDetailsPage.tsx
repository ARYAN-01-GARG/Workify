import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../landingPage/Header"
import JobCard2 from "./JobCard2"
import JobCard3 from "./JobCard3";
import { Link, useParams } from "react-router-dom";
import { JobState, AllRecommendedJobsState, getAllRecommendedJobs } from "../../store/features/AllRecommendedJobSlice";
import { AppDispatch } from "../../store/store";

const JobDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector((state: {getAllRecommendedJobs : AllRecommendedJobsState }) => state.getAllRecommendedJobs.jobs);
  const [job, setJob] = useState<JobState | null>(null);
  const [benefits, setBenefits] = useState<string[]>([]);

  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(getAllRecommendedJobs());
    }
  }, [dispatch, jobs.length]);

  useEffect(() => {
    if (id && jobs.length > 0) {
      const selectedJob = jobs.find(job => job.id === Number(id));
      if (selectedJob) {
        setJob(selectedJob);
        if (selectedJob.mode === 'ONLINE') {
          setBenefits(['Flexible Hours', 'Remote Work']);
        } else {
          setBenefits(['Health Insurance', 'Office Lunch']);
        }
      }
    }
  }, [id, jobs]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!job) {
    return <div>Not found...</div>;
  }
  return (
    <div className="w-full bg-[#E6ECF8] min-h-screen">
      <Header />
      <div className="w-full px-10 py-10">
        <JobCard2 job={job}/>
        <div className="flex gap-12 w-full py-10">
          <div className="flex flex-col flex-grow gap-8">
            <div className="bg-white px-10 py-12 flex flex-col gap-6 rounded-lg">
              <div className="flex flex-col gap-2 text-xl ">
                <h2 className="font-semibold">About Job</h2>
                <h3 className="text-lg font-medium text-[#3D3D3D]">{job.description ? job.description : 'Senior Full-stack Developer role, with end-to-end ownership of the Company&apos;s Android apps.'}</h3>
              </div>
              <div className="text-lg font-medium max-w-[90%]">
                <h4 className="text-[#2a2a2a] pb-5">
                  Key Responisbility :
                </h4>
                <div className="text-[#5D5D5D] pl-1">
                  <p>1. Collaborate with cross-functional teams to design, develop, and implement new features for our Android applications</p>
                  <p>2. Optimize App performance and ensure seamless user experience.</p>
                  <p>3. Contribute to the overall Tech strategy & roadmap of the company to drive innovation & growth.</p>
                </div>
              </div>
            </div>
            <div className="bg-white px-10 py-12 flex flex-col gap-6 rounded-lg">
              <div className="flex flex-col text-xl ">
                <h2 className="font-semibold">About The Company</h2>
                <h3 className="text-lg font-medium text-[#3D3D3D]">{job.company}</h3>
                <div className="text-lg font-medium text-[#2B5A9E]">
                  <a href={`${job.postedBy.companyWebsite}`} target="_blank" className="border-b border-[#2B5A9E]"> Website</a> •
                  <span className="border-b border-[#2B5A9E]"> Linkedin</span> •
                  <Link to={''} className="border-b border-[#2B5A9E]"> Profile</Link>
                </div>
              </div>
              <h4 className="text-lg font-medium">{job.postedBy.industry} • 1-10 employees </h4>
              <div className="text-lg font-medium max-w-[90%]">
                <h4 className="text-[#3D3D3D] pb-5 ">
                  {`${job.postedBy.companyName} is a ${job.postedBy.industry} company based in ${job.location}.`}
                </h4>
                <div className="text-[#3D3D3D] pl-1">
                  <p>We provide formal credit access to the underserved Micro & Small sized Indian retailers, through innovative Finance product offerings and underwriting powered by modern Data Science techniques, cutting-edge Technology, and our segment IP.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 justify-start">
            <div className="bg-white px-10 pt-10 w-[20vw] rounded-lg">
              <h2 className="text-xl font-semibold ">Skills-Mandatory</h2>
              <div className="flex gap-3 py-5 flex-wrap">
                {job.requiredSkills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
                            {skill}
                    </span>
                ))}
              </div>
            </div>
            <div className="bg-white px-10 pt-10 w-[20vw] rounded-lg ">
              <h2 className="text-xl font-semibold">Extra Benefits</h2>
              <div className="flex gap-3 py-5 pb-10 flex-wrap">
                {benefits.map((benefit, index) => (
                    <span
                        key={index}
                        className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
                            {benefit}
                    </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-[#2B5A9E] font-medium text-xl py-10">Similar Jobs</h2>
        <div className="w-full flex gap-10 relative ">
          <JobCard3 job={jobs[5]} />
          <JobCard3 job={jobs[6]}/>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsPage