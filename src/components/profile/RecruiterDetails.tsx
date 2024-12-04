import { useSelector } from "react-redux";
import RecruiterJob from "./RecruiterJob";
import { RecruiterState } from "../../store/features/roleSelection/RecruiterSlice";
import RecruiterLocation from "./RecruiterLocation";
import RecruiterCompanyDetails from "./RecruiterCompanyDetails";

const RecruiterDetails = () => {

    const isRecruiterJobOpen = useSelector((state: { recruiter: RecruiterState }) => state.recruiter.isRecruiterJobOpen);
    const isRecruiterLocationOpen = useSelector((state: { recruiter: RecruiterState }) => state.recruiter.isRecruiterLocationOpen);
    const isrecruiterCompanyDetailsOpen = useSelector((state: { recruiter: RecruiterState }) => state.recruiter.isRecruiterCompanyDetailsOpen);

    return (
        <div className="bg-[#F3F6FC] w-[61vw] min-h-[30vh] rounded-2xl pb-10">
            {isRecruiterJobOpen && <RecruiterJob />}
            {isRecruiterLocationOpen && <RecruiterLocation/>}
            {isrecruiterCompanyDetailsOpen && <RecruiterCompanyDetails/>}
        </div>
    )
}

export default RecruiterDetails;