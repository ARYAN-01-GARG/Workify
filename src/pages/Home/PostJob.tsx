import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { postJob } from '../../store/PostJobSlice';
import JobSite from "../../components/Jobs/JobSite";
import Header from "../../components/landingPage/Header";
import JobSite2 from "../../components/Jobs/JobSite2";
import { RootState, AppDispatch } from '../../store/store';

const PostJob = () => {
  const [renderPage, setRenderPage] = useState('jobSite');
  const dispatch = useDispatch<AppDispatch>();
  const jobData = useSelector((state: RootState) => state.postJob);

  const handleSubmit = () => {
    if (renderPage === 'jobSite2') {
      dispatch(postJob(jobData));
    } else if (isFormValid()) {
      setRenderPage('jobSite2');
    }
  };

  const isFormValid = () => {
    const { title, description, location, experience, jobType, mode, minSalary, maxSalary, employmentType, requiredSkills } = jobData;
    return title && description && location && experience && jobType && mode && minSalary && maxSalary && employmentType && requiredSkills.length > 0;
  };

  return (
    <div className="bg-[#E6ECF8] min-h-screen flex flex-col">
      <Header />
      {renderPage === 'jobSite' ? <JobSite /> : <JobSite2 />}
      <button
        onClick={handleSubmit}
        className={`mt-4 mb-32 py-3 px-10 bg-[#2B5A9E] text-white rounded-xl ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isFormValid()}
      >
        {renderPage === 'jobSite2' ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default PostJob;