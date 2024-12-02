import { useId } from "react";

interface JobSelectionInputProps {
    label: string;
    options: string[];
    value: string;
    defaultValue?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}


const JobSelectionInput:React.FC<JobSelectionInputProps> = ({
    label,
    options,
    value,
    defaultValue,
    onChange
}) => {
    const id = useId();
  return (
    <div className="w-full flex flex-col justify-start gap-1 relative">
        {label !== '' &&
                <label
                    htmlFor={id}
                    className="text-xl font-medium mb-3">
                    {label}
                </label>}
        <select
            id={id}
            className="
                        border-[2px]
                        border-[#888888]
                        px-3
                        py-2
                        rounded-lg
                        outline-none
                        font-semibold
                "
            name="degree"
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
        >
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    </div>
  )
}

export default JobSelectionInput