export interface IUpdateCandidateProfile {
  name?: string;
  bio?: string;
  about?: string;
  resumeUrl?: string;
  skills?: string[];
  education?: any;
  experience?: any;
}

export interface IUpdateRecruiterProfile {
  name?: string;
  bio?: string;
  about?: string;
  companyId?: string;
}
