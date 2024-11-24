import RecruiterSVG from '../assets/RecruiterSVG';


interface DialogCardProps {
    title: string;
    subTitle?: string;
    description?: string;
    actionLabel: string;
    disabled?: boolean;
    action: () => void;
    children: React.ReactNode;
}

const DialogCard:React.FC<DialogCardProps> = ({
    title,
    subTitle,
    description,
    actionLabel,
    disabled=false,
    action,
    children
}) =>{
  return (
    <div className="pt-20 w-[80%] mx-auto">
        <header className="text-center flex flex-col justify-center items-center gap-7 text-[1.58rem]">
            <h1 className="font-semibold">{title}</h1>
            {subTitle && <h2 className="font-medium">{subTitle}</h2>}
            <p className="font-medium text-[#4F4F4F] text-xl max-w-[75%] text-center">{description}</p>
            <RecruiterSVG/>
        </header>
        <div>
            <main>
                {children}
            </main>
            <footer className="flex justify-end items-center my-5">
                <button onClick={action} className={`${disabled ? 'bg-[#2B5A9E] text-[#F3F6FC] hover:opacity-90' : 'text-[#5D5D5D] bg-[#C8D8EF]'} px-5 py-2 text-[1rem] font-semibold rounded-md`}>{actionLabel}</button>
            </footer>
        </div>
    </div>
  )
}

export default DialogCard