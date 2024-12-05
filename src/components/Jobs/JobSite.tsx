import { RiPencilFill } from "react-icons/ri";
import { useState, ChangeEvent } from "react";
import { FaPlus } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { updateJobField, addSkill } from '../../store/PostJobSlice';

const JobSite = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("PART_TIME");
  const [country, setCountry] = useState("India");
  const [language, setLanguage] = useState("English");
  const [companyName, setCompanyName] = useState("Google");
  const [isEditing, setIsEditing] = useState({
    country: false,
    language: false,
    companyName: false,
  });
  const dispatch = useDispatch();

  const addSkillHandler = () => {
    if (skillInput.trim()) {
      dispatch(addSkill(skillInput.trim()));
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleJobTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
    dispatch(updateJobField({ field: 'title', value: e.target.value }));
  };

  const handleJobTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJobType(value);
    dispatch(updateJobField({ field: 'jobType', value }));
    dispatch(updateJobField({ field: 'mode', value: value === 'remote' ? 'ONLINE' : 'OFFLINE' }));
  };

  const handleEditChange = (field: keyof typeof isEditing, value: string) => {
    if (field === 'country') setCountry(value);
    if (field === 'language') setLanguage(value);
    if (field === 'companyName') setCompanyName(value);
  };

  const saveEdit = (field: keyof typeof isEditing) => {
    setIsEditing({ ...isEditing, [field]: false });
  };

  return (
    <main className="pt-9 flex flex-col justify-start items-center gap-4">
      <div className="w-[60vw] px-28 py-1 bg-white rounded-2xl flex justify-between items-center">
        <div>
          <h1 className="text-[1.57rem] font-semibold mb-2">Create a job post</h1>
          <h3 className="text-[1.57rem] font-medium">Provide basic information</h3>
        </div>
        <div>
          <img src="/createJob.svg" alt="Create Job" />
        </div>
      </div>
      <div className="w-[60vw] px-28 py-7 bg-white rounded-2xl">
        <div className="text-xl font-medium">
          <div className="flex items-center my-1">
            <span>Country:</span>
            {isEditing.country ? (
              <>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => handleEditChange('country', e.target.value)}
                  className="ml-2 border-b-2 border-[#2B5A9E]"
                />
                <button onClick={() => saveEdit('country')} className="ml-2 text-[#2B5A9E]">Save</button>
              </>
            ) : (
              <>
                <span className="text-[#4F4F4F]">{country}</span>
                <RiPencilFill
                  size={25}
                  className="ml-2 text-[#2B5A9E] cursor-pointer hover:opacity-80"
                  onClick={() => setIsEditing({ ...isEditing, country: true })}
                />
              </>
            )}
          </div>
          <div className="flex items-center my-1">
            <span>Language:</span>
            {isEditing.language ? (
              <>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => handleEditChange('language', e.target.value)}
                  className="ml-2 border-b-2 border-[#2B5A9E]"
                />
                <button onClick={() => saveEdit('language')} className="ml-2 text-[#2B5A9E]">Save</button>
              </>
            ) : (
              <>
                <span className="text-[#4F4F4F]">{language}</span>
                <RiPencilFill
                  size={25}
                  className="ml-2 text-[#2B5A9E] cursor-pointer hover:opacity-80"
                  onClick={() => setIsEditing({ ...isEditing, language: true })}
                />
              </>
            )}
          </div>
          <div className="flex items-center my-1">
            <span>Company Name:</span>
            {isEditing.companyName ? (
              <>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => handleEditChange('companyName', e.target.value)}
                  className="ml-2 border-b-2 border-[#2B5A9E]"
                />
                <button onClick={() => saveEdit('companyName')} className="ml-2 text-[#2B5A9E]">Save</button>
              </>
            ) : (
              <>
                <span className="text-[#4F4F4F]">{companyName}</span>
                <RiPencilFill
                  size={25}
                  className="ml-2 text-[#2B5A9E] cursor-pointer hover:opacity-80"
                  onClick={() => setIsEditing({ ...isEditing, companyName: true })}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-[60vw] px-28 py-10 bg-white rounded-2xl">
        <h2 className="text-xl font-medium">Job title</h2>
        <input
          type="text"
          placeholder="Job title"
          value={jobTitle}
          onChange={handleJobTitleChange}
          className="placeholder:text-xl text-xl font-medium border-2 border-[#B0B0B0] rounded-lg w-full px-4 py-2 mt-3"
        />
      </div>
      <div className="w-[60vw] px-28 py-10 bg-white rounded-2xl">
        <h2 className="text-xl font-medium">Skills required for this job</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Add a skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="placeholder:text-xl text-xl font-medium border-2 border-[#B0B0B0] rounded-lg w-full px-4 py-2 mt-3"
          />
          <button onClick={addSkillHandler} className="mt-3 p-3 bg-[#2B5A9E] text-white rounded-full">
            <FaPlus size={20} />
          </button>
        </div>
        <div className="flex gap-3 pt-2 mt-5">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="w-[60vw] px-28 py-10 bg-white rounded-2xl">
        <h2 className="text-xl font-medium">Job Type</h2>
        <div className="flex gap-4 items-center border-2 border-[#B0B0B0] rounded-lg w-full px-4 py-2 mt-3 text-lg font-medium">
          <input
            type="radio"
            name="job-type"
            value="PART_TIME"
            id="PART_TIME"
            checked={jobType === 'PART_TIME'}
            onChange={handleJobTypeChange}
            className="w-5 h-5"
          />
          <label htmlFor="PART_TIME">Employees will report to a specific address</label>
        </div>
        <div className="flex gap-4 items-center border-2 border-[#B0B0B0] rounded-lg w-full px-4 py-2 mt-3 text-lg font-medium">
          <input
            type="radio"
            name="job-type"
            value="REMOTE"
            id="remote"
            checked={jobType === 'REMOTE'}
            onChange={handleJobTypeChange}
            className="w-5 h-5"
          />
          <label htmlFor="remote">Employees will not report to a specific address</label>
        </div>
      </div>
    </main>
  );
};

export default JobSite;