
export interface JobState {
    jobId: string;
    jobTitle: string;
    companyName: string;
    location: string;
    salary: number;
    description: string;
    requirements: string[];
    postedDate: string;
    applicationDeadline: string;
}

export const initialJobState: JobState = {
    jobId: '',
    jobTitle: '',
    companyName: '',
    location: '',
    salary: 0,
    description: '',
    requirements: [],
    postedDate: '',
    applicationDeadline: ''
};