export interface IEducation {
  id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date | string;
  endDate?: Date | string;
  grade?: string;
  activities?: string;
  description?: string;
}

export interface IExperience {
  id?: string;
  title: string;
  employmentType: string;
  companyName: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  startDate: Date | string;
  endDate?: Date | string;
  currentlyWorking: boolean;
  description?: string;
}

export interface IUpdateCandidateProfile {
  name?: string;
  bio?: string;
  about?: string;
  resumeUrl?: string;
  skills?: string[];
  education?: IEducation[];
  experience?: IExperience[];
}

export interface IUpdateRecruiterProfile {
  name?: string;
  bio?: string;
  about?: string;
  companyId?: string;
}
