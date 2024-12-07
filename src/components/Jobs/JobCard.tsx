import { CiCalendar } from "react-icons/ci"
import { FaClipboardList } from "react-icons/fa6"
import { PiMoneyFill } from "react-icons/pi"
import { Link } from "react-router-dom"
import { JobState } from "../../store/features/AllRecommendedJobSlice"
import { format, differenceInDays } from 'date-fns';
import { applyJob, setAppliedJobs } from "../../store/features/job/ApplyJobSlice"
import { AppDispatch } from "../../store/store"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"

const JobCard = ({
    job,
}: { job : JobState }) => {

    const dispatch = useDispatch<AppDispatch>();
    const jobs = useSelector((state : {allJobs : {jobs : JobState[]}}) => state.allJobs.jobs);
    const isApplied = useSelector((state : {applyJob : {jobs: JobState[]}}) => state.applyJob.jobs.some((j) => j.id === job.id));
    const formatJobStatus = (status: string) => {
        if (!status) return 'N/A';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy');
    }

    const calculateDaysAgo = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return differenceInDays(new Date(), date);
    }

    const defaultJob = {
        mode: 'OFFLINE',
        title: 'Software Developer',
        company: '',
        location: 'Delhi, India',
        requiredSkills: [],
        minSalary: '10000',
        maxSalary: '20000',
        jobStatus: 'Close',
        experience: 0,
        postedAt: '',
        id: ''
    };

    const jobData = { ...defaultJob, ...job };
    const [isLoading, setIsLoading] = useState(false);

    const handleApplyJob = () => {
        setIsLoading(true);
        try {
            dispatch(applyJob(jobData.id)).then((res) => {
                if(res.type === 'applyJob/applyJobFunc/fulfilled') {
                    setIsLoading(false);
                    dispatch(setAppliedJobs([...jobs.filter((job) => job.id === jobData.id)]));
                }
                setIsLoading(false);
            });
        } catch (error) {
            console.error('Failed to apply for job', error);
        }
    }

  return (

    <div className="relative flex flex-col justify-between items-start bg-white px-5 lg:px-8 py-8 rounded-xl border-2 border-[#6D6D6D]/50">
        <div className="absolute -top-5 right-6 px-3 py-[0.4rem] font-medium text-[#2B5A9E] bg-[#E6ECF8] border-[2px] border-[#C8D8EF] rounded-lg">{jobData.mode === 'ONLINE' ? 'Remote' : 'In-Office'}</div>
        <div className="flex gap-4 items-center w-full">
            <div className="max-w-[53px] w-full md:max-w-[60px] h-[53px] md:h-[60px] bg-red-400 rounded-full">
                <img src={'/images/jobPostImage.svg'} alt="jobPost" className="w-full h-full rounded-full" />
            </div>
            <div>
                <h5 className="text-lg md:text-xl font-medium md:font-semibold">{jobData.title}</h5>
                <div className="text-[#6D6D6D] text-[1rem] md:text-lg font-medium flex gap-1"><p>{`${jobData.company} | `}</p><p className="text-nowrap">{` ${jobData.location}`}</p></div>
            </div>
        </div>
        <div className="flex gap-3 pt-2 mt-3 lg:mt-5 flex-wrap">
            {jobData.requiredSkills.map((skill, index) => (
                <span
                    key={index}
                    className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
                        {skill}
                </span>
            ))}
        </div>
        <div className="w-full flex text-[1rem] lg:gap-5 justify-between items-center mt-10 mb-5 lg:pr-16 flex-wrap">
            <div className="font-medium w-[40%] lg:w-auto text-[#5D5D5D]">
                <div className="flex items-center md:gap-2 pb-3 "><PiMoneyFill size={20}/><p>Job Offer</p></div>
                <p className="text-[#3D3D3D]">{`Rs ${jobData.minSalary} - ${jobData.maxSalary}`}</p>
            </div>
            <div className="font-medium w-[40%] lg:w-auto text-[#5D5D5D]">
                <div className="flex items-center md:gap-2 pb-3"><FaClipboardList size={18}/><p>Job Status</p></div>
                <p className="text-[#3D3D3D]">{formatJobStatus(jobData.jobStatus)}</p>
            </div>
            <div className="font-medium w-[40%] lg:w-auto text-[#5D5D5D]">
                <div className="flex items-center md:gap-2 pb-3"><p>Experience</p></div>
                <p className="text-[#3D3D3D]">{jobData.experience > 0 ? `0-${jobData.experience} years` : 'Fresher'}</p>
            </div>
            <div className="font-medium w-[40%] lg:w-auto text-[#5D5D5D] pr-[4.2rem] md:pr-0 lg:pr-[4.2rem]">
                <div className="flex items-center md:gap-1 pb-3"><CiCalendar size={25}/><p>Start Date</p></div>
                <p className="text-[#3D3D3D]">Immediate</p>
            </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-center w-full pt-3">
            <p className="text-[#2B5A9E] font-medium flex flex-wrap">Posted on {formatDate(jobData.postedAt)}<span className="hidden lg:block">{` .  Posted ${calculateDaysAgo(jobData.postedAt)}d ago`}</span></p>
            <div className="flex gap-5">
                <Link to={`/jobs/${jobData.id.toString()}`} className="bg-[#E6ECF8] text-xl font-medium py-2 px-5 border border-[#D1D1D1] text-center rounded-2xl hover:bg-[#d4dae5] ">View Details</Link>
                {isApplied && <div className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80">Applied</div>}
                {!isApplied && <button onClick={handleApplyJob} disabled={isLoading} className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80 text-center">Apply Now</button>}
            </div>
        </div>
    </div>
  )
}

export default JobCard;