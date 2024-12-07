import { CiCalendar } from "react-icons/ci"
import { FaClipboardList } from "react-icons/fa6"
import { PiMoneyFill } from "react-icons/pi"
import { JobState} from "../../store/features/AllRecommendedJobSlice"
import { format, differenceInDays } from 'date-fns';
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../store/store"
import { applyJob, setAppliedJobs } from "../../store/features/job/ApplyJobSlice"

const JobCard2 = ({
    job
}:{ job: JobState}) => {

    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const isApplied = useSelector((state : {applyJob : {jobs: JobState[]}}) => Array.isArray(state.applyJob.jobs) && state.applyJob.jobs.some((j) => j.id === job.id));
    const appliedJobs = useSelector((state : {applyJob : {jobs: JobState[]}}) => state.applyJob.jobs);
    const formatJobStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy');
    }

    const calculateDaysAgo = (dateString: string) => {
        const date = new Date(dateString);
        return differenceInDays(new Date(), date);
    }

    const handleApplyJob = async () => {
        setIsLoading(true);
        try {
            const res = await dispatch(applyJob(job.id));
            if (res.type === 'applyJob/applyJobFunc/fulfilled') {
                dispatch(setAppliedJobs([...appliedJobs, job]));
            }
        } catch (error) {
            console.error('Failed to apply for job', error);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="relative flex flex-col justify-between items-start bg-white px-8 py-8 rounded-xl border-2 border-[#6D6D6D]/50">
        <div className="absolute -top-5 right-6 px-3 py-[0.4rem] font-medium text-[#2B5A9E] bg-[#E6ECF8] border-[2px] border-[#C8D8EF] rounded-lg">{job.mode === 'ONLINE' ? 'Remote' : 'In-Office'}</div>
        <div className="flex gap-4 pt-4 w-full">
            <div className="w-[60px] h-[60px] bg-red-400 rounded-full">
                <img src={'/images/jobPostImage.svg'} alt="jobPost" className="w-full h-full rounded-full" />
            </div>
            <div className="">
                <h5 className="text-xl font-semibold">{job.title}</h5>
                <div className="text-[#6D6D6D] text-[1rem] md:text-lg font-medium flex gap-1 flex-wrap"><p>{`${job.company || ''} | `}</p><p className="text-nowrap">{` ${job.location || 'Delhi, India'}`}</p></div>
            </div>
        </div>
        <div className="hidden lg:flex justify-between items-center w-full pt-10">
            <p className="text-[#2B5A9E] text-lg font-medium"><span>Posted on {formatDate(job.postedAt)}</span><span className="">{` .  Posted ${calculateDaysAgo(job.postedAt)}d ago`}</span></p>
            <div className="flex gap-5">
                {!isApplied && <button onClick={handleApplyJob} disabled={isLoading} className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80">Apply Now</button>}
                {isApplied && <div className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80">Applied</div>}
            </div>
        </div>
        <div className="w-full flex justify-between flex-wrap items-start mt-10 mb-5 lg:pr-20 lg:max-w-[65vw]">
            <div className="font-medium w-[40%] lg:w-auto text-[#5D5D5D]">
                <div className="flex items-center gap-2 pb-3"><PiMoneyFill size={20}/><p>Job Offer</p></div>
                <p className="text-[#3D3D3D]">{`$ ${job.minSalary} - ${job.maxSalary}`}</p>
            </div>
            <div className="font-medium w-[40%] lg:w-auto text-[#5D5D5D]">
                <div className="flex items-center gap-2 pb-3"><FaClipboardList size={20}/><p>Job Status</p></div>
                <p className="text-[#3D3D3D]">{`${job.jobStatus ? formatJobStatus(job.jobStatus) : 'Close'}`}</p>
            </div>
            <div className="font-medium w-[40%] lg:w-auto text-[#5D5D5D]">
                <div className="flex items-center gap-2 pb-3"><p>Experience</p></div>
                <p className="text-[#3D3D3D]">{job.experience > 0 ? `0-${job.experience} years` : 'Fresher'}</p>
            </div>
            <div className="font-medium w-[40%] lg:w-auto text-[#5D5D5D]">
                <div className="flex items-center gap-1 pb-3"><CiCalendar size={25}/><p>Start Date</p></div>
                <p className="text-[#3D3D3D]">Immediate</p>
            </div>
        </div>
        <div className="flex lg:hidden flex-wrap justify-between items-center w-full pt-10">
            <p className="text-[#2B5A9E] text-lg font-medium"><span>Posted on {formatDate(job.postedAt)}</span><span className="">{` .  Posted ${calculateDaysAgo(job.postedAt)}d ago`}</span></p>
            <div className="flex gap-5 justify-center lg:justify-start">
                {!isApplied && <button onClick={handleApplyJob} disabled={isLoading} className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80">Apply Now</button>}
                {isApplied && <div className="bg-[#2B5A9E] text-white font-medium text-xl py-2 px-5 rounded-2xl hover:opacity-80">Applied</div>}
            </div>
        </div>
    </div>
  )
}

export default JobCard2