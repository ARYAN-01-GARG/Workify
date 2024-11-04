import { useId, forwardRef } from "react"

interface InputOTPProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean; // Make error prop optional
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputOTP = forwardRef<HTMLInputElement, InputOTPProps>(({
    value,
    onChange,
    disabled,
    error,
    onKeyDown
}, ref) => {

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value.replace(/[^0-9]/g, ''); // Allow only numeric input
        onChange(newValue);
    };

    const id = useId();

    return (
        <div className="relative">
            <input
                ref={ref}
                type='text'
                maxLength={1}
                className={`peer bg-[#F6F6F6] max-w-12 md:max-w-12 lg:max-w-14 min-h-20 rounded-xl text-3xl font-semibold px-3 md:px-4 caret-transparent outline-none focus:border-2 focus:border-[#2ec15a] ${error ? 'border-2 border-red-500' : value.length === 1 ? 'border-2 border-[#2B5A9E]' : 'border-2 border-[#F6F6F6]'} ${disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
                placeholder=""
                disabled={disabled}
                value={value}
                onChange={handleInput}
                onKeyDown={onKeyDown}
            />
            <label htmlFor={id} className="peer-placeholder-shown:block hidden">
                <div className="absolute border-b-[0.2rem] border-black w-8 z-10 bottom-6 md:left-3 left-[15%] rounded-xl "></div>
            </label>
        </div>
    )
});

export default InputOTP