import { FaPlus, FaRegUser } from "react-icons/fa6"
import Footer from "../components/landingPage/Footer"
import Header from "../components/landingPage/Header"
import { useDispatch, useSelector } from "react-redux"
import { UserState } from "../store/features/auth/UserState"
import { CiLocationOn } from "react-icons/ci"
import { FiPhone } from "react-icons/fi"
import { RxBackpack } from "react-icons/rx"
import { MdOutlineMail } from "react-icons/md"
import { Link } from "react-router-dom"
import { uploadProfilePic, uploadResume, setCandidate, CandidateState } from "../store/features/roleSelection/CandidateSlice"
import { RiPencilFill } from "react-icons/ri"
import { PortfolioCard } from "./Home/HomePage"
import { useEffect, useState } from "react"
import { AppDispatch } from "../store/store"
import toast from 'react-hot-toast';
import ProfileEditPage from "./ProfileEditPage"

const sideBarData = [
  { title : 'Resume' , status : 'Uploaded' },
  { title : 'Resume headline' , status : 'Add' },
  { title : 'Portfolio' , status : 'Add' },
  { title : 'Key Skill' , status : 'Add' },
  { title : 'Employment' , status : 'Add' },
  { title : 'Education' , status : 'Add' },
  { title : 'Projects' , status : 'Add' },
  { title : 'Personal Details' , status : 'Add' }
]

const Profile = () => {


  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: { user: UserState }) => state.user.token) as string;
  const [isLoading , setIsLoading] = useState(false);
  const candidate = useSelector((state: { candidate: CandidateState }) => state.candidate.candidate);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(['New Delhi', 'Bangalore/Bengaluru', 'Mumbai']);
  const [newLocation, setNewLocation] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [newInstitution, setNewInstitution] = useState(candidate.education[0]?.institution || '');
  const [newDegree, setNewDegree] = useState(candidate.education[0]?.degree || '');
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const editPageOpen = useSelector((state: { profileEdit: { editPageOpen: boolean } }) => state.profileEdit.editPageOpen);

  useEffect(() => {
    if (editPageOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [editPageOpen]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) {
      return;
    } else {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 3 * 1024 * 1024) {
          toast.error('Please choose an image between 2-3 MB');
          setIsLoading(false);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (selectedImage) {
      dispatch(uploadProfilePic({ token, profileImageKey: selectedImage }));
      setSelectedImage(null);
    }
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Please choose a resume file up to 2 MB');
        return;
      }
      setSelectedResume(file);
    }
  };

  const handleSaveResume = () => {
    if (selectedResume) {
      dispatch(uploadResume({ token, resumeFile: selectedResume }));
      setSelectedResume(null);
    }
  };

  const handleResumeClick = () => {
    document.getElementById('resumeUpload')?.click();
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...candidate.skill, newSkill.trim()];
      dispatch(setCandidate({ ...candidate, skill: updatedSkills }));
      setNewSkill('');
      setIsAddingSkill(false);
      setIsProfileChanged(true);
    }
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setPreferredLocations([newLocation.trim()]);
      setNewLocation('');
      setIsAddingLocation(false);
      setIsEditingLocation(false);
      setIsProfileChanged(true);
    }
  };

  const handleEditLocation = () => {
    setIsEditingLocation(true);
    setNewLocation(preferredLocations[0]);
  };

  const handleEditEducation = () => {
    setIsEditingEducation(true);
    setNewInstitution(candidate.education[0]?.institution || '');
    setNewDegree(candidate.education[0]?.degree || '');
  };

  const handleSaveEducation = () => {
    const updatedEducation = {
      ...candidate.education[0],
      institution: newInstitution,
      degree: newDegree,
    };
    dispatch(setCandidate({ ...candidate, education: [updatedEducation] }));
    setIsEditingEducation(false);
    setIsProfileChanged(true);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    // await dispatch(updateProfile({ token, candidate }));
    setIsLoading(false);
    setIsProfileChanged(false);
  };

  useEffect(() => {
    console.log('Candidate', editPageOpen);
  },[editPageOpen]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#E6ECF8]">
      <Header />
      <main className="flex-grow px-4 lg:px-[3.125rem] py-[2.6rem] ">
        <div className="flex gap-6 w-full items-start">
          <div className="flex gap-8 border-[2px] border-[#B0B0B0] py-5 lg:py-[3.2rem] px-2 lg:px-[2.6rem] bg-white rounded-lg w-full lg:max-w-[60vw] items-start">
            <div className="relative w-full max-w-25 lg:max-w-40 h-25 lg:h-40 rounded-full bg-slate-300 flex justify-center items-center">
              {selectedImage ? (
                <img src={selectedImage} alt="User" className="w-full h-full rounded-full" />
              ) : candidate.profileImageKey ? (
                <img src={candidate.profileImageKey} alt="User" className="w-full h-full rounded-full" />
              ) : (
                <FaRegUser className="text-slate-500 m-auto" size={50} />
              )}
              {isEditing && (
                <label htmlFor="profilePicUpload" className="absolute bottom-1 right-1 rounded-full bg-white border border-[#B0B0B0] cursor-pointer text-[#2B5A9E] p-1 hover:scale-105">
                  <RiPencilFill size={30} className="p-1"/>
                </label>
              )}
              <input type="file" id="profilePicUpload" className="hidden" onChange={handlePhotoChange} />
            </div>
            <div className="w-full">
              <div className="w-full">
                <div className="flex flex-col gap-2 pb-2 border-b-2 border-[#D1D1D1]">
                  <h1 className="text-xl lg:text-[1.57rem] font-semibold ">{`${candidate.firstName || ''} ${candidate.lastName || ''}`}</h1>
                  <p className="lg:text-xl text-[1rem] font-medium text-[#3D3D3D]">{`${candidate.domain}`}</p>
                  <button className="block lg:hidden bg-[#2B5A9E] text-white font-medium text-[1rem] py-2 px-5 rounded-2xl hover:opacity-80" onClick={isEditing ? handleSaveProfile : handleEditClick}>
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
              </div>
              <div className="hidden justify-between gap-10 pt-2 lg:flex">
                <div className="flex flex-col gap-5 justify-between">
                  <div className="flex gap-2 items-center"><CiLocationOn size={25}/>{`${candidate.location}`}</div>
                  <div className="flex gap-2 items-center"><RxBackpack size={25}/>{`${candidate.experience[0].yearsWorked ? candidate.experience[0].yearsWorked < 5 ? 'Fresher' : 'Experienced' : 'Fresher' }`}</div>
                </div>
                <div className="flex flex-col gap-5 justify-between">
                  <div className="flex gap-2 items-center"><FiPhone size={20}/>{`${candidate.phone ? candidate.phone : 'Not verified'}`}</div>
                  <div className="flex gap-2 items-center"><MdOutlineMail size={20}/>{`${candidate.email ? candidate.email : 'abc@gmail.com'}`}</div>
                </div>
              </div>
            </div>
            <button className="hidden lg:block bg-[#2B5A9E] text-white font-medium text-xl py-[.7rem] px-10 ml-20 rounded-2xl hover:opacity-80" onClick={isEditing ? handleSaveProfile : handleEditClick}>
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          <div className="relative hidden lg:block bg-[#FFECDD] px-[2rem] py-[2.9rem] w-[40vw] border rounded-lg border-[#ECDFC1] mt-2">
            <h4 className="text-lg font-medium">How to create a good Resume on Workify?</h4>
            <Link to={'/resume-building'} className="text-lg font-semibold text-[#9E5A0D] hover:opacity-80">Read blog post</Link>
            <div className="absolute -top-5 text-lg font-medium bg-[#FFCBA4] border border-[#E9DED4] text-[#B85900] rounded-lg px-4 py-2 cursor-default">
              Must Read
            </div>
          </div>
        </div>
        <div className="flex gap-8 items-start mt-6">
          <div className="hidden lg:block bg-white py-[3.73rem] px-[3.12rem] border-[2px] rounded-lg border-[#B0B0B0]">
            <h1 className="text-lg font-semibold">Add More</h1>
            {sideBarData.map((data, index) => (
              <div key={index} className="flex text-lg font-medium justify-between items-center rounded-lg pt-[1.4rem] pb-[.7rem] w-[20vw]">
                <p>{data.title}</p>
                <button className="text-[#2B5A9E] rounded-2xl hover:opacity-80">{data.status}</button>
              </div>
            ))}
          </div>
          <div className="w-full flex flex-col gap-7">
            <div className="bg-white font-medium py-[3.13rem] px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] hidden w-full lg:max-w-[64vw]">
              <h1 className="text-xl pb-3 hidden lg:block">Portfolio</h1>
              <h1 className="text-xl pb-3 hidden lg:block">Create</h1>
              <div className="text-lg text-[#3D3D3D] pb-4">

              </div>
              <p className="text-lg text-[#3D3D3D] pb-4">Showcase your skills and achievements to stand out- create a personalized portfolio that grabs attention and open doors to opportunities!</p>
              <div className="w-full hidden lg:block">
                <PortfolioCard bg={'#E6ECF8'}/>
              </div>
              <div className="w-full flex gap-3 mt-6 items-center justify-center flex-col border-[2px] py-3 pb-5 px-5 border-dashed border-[#B0B0B0]">
                <h1 className="text-[#2B5A9E] text-xl cursor-pointer"><span className="text-black">Already Have a Portfolio ? </span>Upload Portfolio</h1>
                <h3 className="text-lg text-[#3D3D3D]">Supported Formats: doc, docx, rtf, pdf, upto 2 MB</h3>
              </div>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-8 lg:px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full lg:max-w-[64vw]">
              <h1 className="text-xl pb-3">Resume</h1>
              <p className="text-lg text-[#3D3D3D] pb-4">70% of recruiters discover candidates through their resume.</p>
              {candidate.resumeKey && <a href={candidate.resumeKey} target="_blank" rel="noopener noreferrer" className="w-full text-lg text-[#2B5A9E] text-center px-10">Resume.pdf</a>}
              <div className="w-full flex gap-3 items-center justify-center flex-col border-[2px] py-3 pb-5 px-5 border-dashed border-[#B0B0B0] mt-5">
                <h1 className="text-[#2B5A9E] text-xl cursor-pointer" onClick={handleResumeClick}>
                  {candidate.resumeKey ? 'Update Resume' : 'Upload Resume'}
                </h1>
                <h3 className="text-lg text-[#3D3D3D]">Supported Formats: doc, docx, rtf, pdf, upto 2 MB</h3>
                <input type="file" id="resumeUpload" className="hidden" onChange={handleResumeUpload} />
                {selectedResume && (
                  <button className="bg-[#2B5A9E] text-white font-medium text-xl py-[.7rem] px-10 rounded-2xl hover:opacity-80" onClick={handleSaveResume}>
                    Save Resume
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-8 lg:px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full lg:max-w-[64vw]">
              <div className="flex justify-between">
                <h1 className="text-xl pb-3">Key Skills</h1>
                <FaPlus size={20} className="text-[#2B5A9E] cursor-pointer hover:opacity-80" onClick={() => setIsAddingSkill(true)} />
              </div>
              <p className="text-lg text-[#3D3D3D] pb-4">Recruiters look for candidates with specific key skills</p>
              <div className="flex gap-3 flex-wrap">
                {candidate.skill.map((skill, index) => (
                  <span key={index} className="bg-[#E6ECF8] px-2 py-1 text-[1rem] font-medium rounded-md border border-[#D1D1D1]">
                    {skill}
                  </span>
                ))}
              </div>
              {isAddingSkill && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill"
                    className="border rounded px-2 py-1 flex-grow"
                  />
                  <button className="bg-[#2B5A9E] text-white px-4 py-1 rounded" onClick={handleAddSkill}>Add</button>
                </div>
              )}
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-8 lg:px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full lg:max-w-[64vw]">
              <div className="flex justify-between">
                <h1 className="text-xl pb-3">Employment</h1>
                <FaPlus size={20} className="text-[#2B5A9E] cursor-pointer hover:opacity-80" onClick={()=> {}} />
              </div>
              <p className="text-lg text-[#3D3D3D] pb-4">UI UX Developer</p>
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-8 lg:px-[3.45rem] border-[2px] rounded-lg border-[#B0B0B0] w-full lg:max-w-[64vw]">
              <div className="flex justify-between">
                <h1 className="text-xl pb-3">Preferred location</h1>
                <FaPlus size={20} className="text-[#2B5A9E] cursor-pointer hover:opacity-80" onClick={() => setIsAddingLocation(true)} />
              </div>
              <p className="text-lg text-[#3D3D3D] pb-4 flex gap-2 items-center">
                {preferredLocations.join(', ')}
                <RiPencilFill size={20} className="cursor-pointer" onClick={handleEditLocation} />
              </p>
              {(isAddingLocation || isEditingLocation) && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Add a new location"
                    className="border rounded px-2 py-1 flex-grow"
                  />
                  <button className="bg-[#2B5A9E] text-white px-4 py-1 rounded" onClick={handleAddLocation}>
                    {isEditingLocation ? 'Edit' : 'Add'}
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white font-medium py-[3.13rem] px-8 lg:px-[3.45rem]+ border-[2px] rounded-lg border-[#B0B0B0] w-full lg:max-w-[64vw]">
              <div className="flex justify-between">
                <h1 className="text-xl pb-3">Education</h1>
                <FaPlus size={20} className="text-[#2B5A9E] cursor-pointer hover:opacity-80" onClick={handleEditEducation} />
              </div>
              <p className="text-lg text-[#3D3D3D] pb-4 flex gap-2 items-center">
                {candidate.education[0]?.institution || 'No institution'}, {candidate.education[0]?.degree || 'No degree'}
                <RiPencilFill size={20} className="cursor-pointer" onClick={handleEditEducation} />
              </p>
              {isEditingEducation && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    placeholder="Edit institution"
                    className="border rounded px-2 py-1 flex-grow"
                  />
                  <input
                    type="text"
                    value={newDegree}
                    onChange={(e) => setNewDegree(e.target.value)}
                    placeholder="Edit degree"
                    className="border rounded px-2 py-1 flex-grow"
                  />
                  <button className="bg-[#2B5A9E] text-white px-4 py-1 rounded" onClick={handleSaveEducation}>Save</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {isProfileChanged && (
          <div className="flex justify-center mt-6">
            <button
              className="bg-[#2B5A9E] text-white font-medium text-xl py-[.7rem] px-10 rounded-2xl hover:opacity-80"
              onClick={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </main>
      <Footer />
      {editPageOpen &&
        <ProfileEditPage />
      }
    </div>
  )
}

export default Profile