import { useId } from "react";

interface JobInputProps {
    label?: string;
    placeholder: string;
    description?: string;
    icon?: React.ReactNode;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const JobInput: React.FC<JobInputProps> = ({
    label,
    placeholder,
    description,
    icon,
    value,
    error,
    onChange,
}) => {
    const id = useId();

    return (
        <div className="w-full flex flex-col justify-start gap-1 *: relative">
            {label !== '' &&
                <label
                    htmlFor={id}
                    className="text-xl font-medium">
                    {label}
                </label>}
            {description !== '' && <p className="px-2 text-[#4F4F4F] text-[12px] font-medium mb-2">{description}</p>}
            <input
                id={id}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="
                        relative
                        border-[2px]
                        border-[#888888]
                        placeholder:text-[#454545]
                        px-3
                        py-2
                        rounded-lg
                        outline-none
                        font-semibold
                        placeholder:text-[12px]
                "
            />
            {icon && <div className="absolute bottom-[0.6rem] right-3">{icon}</div>}
            {error && <p className="text-red-500 text-[12px] font-medium">{error}</p>}
        </div>
    )
}