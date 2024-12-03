import { useSelector } from "react-redux";
import { CandidateState } from "../../store/features/roleSelection/CandidateSlice";

interface DialogCardProps {
    title: string;
    subTitle?: string;
    description?: string;
    actionLabel: string;
    disabled?: boolean;
    action: () => void;
    isResume? : boolean;
    children: React.ReactNode;
}

const DialogCard:React.FC<DialogCardProps> = ({
    title,
    subTitle,
    description,
    actionLabel,
    disabled=false,
    action,
    isResume,
    children
}) =>{
    const isResumeOpen = useSelector((state: { candidate: CandidateState }) => state.candidate.isResumeOpen);
  return (
    <div className="pt-20 w-[90%] lg:w-[80%] mx-auto">
        <header className="text-center flex flex-col justify-center items-center gap-7 text-xl lg:text-[1.58rem]">
            <h1 className="font-semibold">{title}</h1>
            {subTitle && <h2 className="font-medium text-lg lg:text-[1.58rem]">{subTitle}</h2>}
            <p className="font-medium text-[#4F4F4F] text-[16px] lg:text-xl max-w-[90%] lg:max-w-[75%] text-center">{description}</p>
        </header>
        <div className="w-full">
            <main className="w-full">
                {children}
            </main>
            <footer className="flex justify-end items-center my-5">
                <button
                    onClick={action}
                    disabled={disabled}
                    className={`${isResumeOpen && !isResume ? 'bg-transparent text-[#2B5A9E] border-2 border-[#2B5A9E] ' : disabled ? 'text-[#5D5D5D] bg-[#C8D8EF] cursor-not-allowed' : 'bg-[#2B5A9E] text-[#F3F6FC] hover:opacity-90'}  px-5 py-2 text-[1rem] font-semibold rounded-md`}>
                        {actionLabel}
                    </button>
            </footer>
        </div>
    </div>
  )
}

export default DialogCard