import { RefObject, useId } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface InputProps{
    type? : string;
    charSize? : number;
    ref : RefObject<HTMLInputElement>;
    label : string;
    value : string;
    onChange : (value : string) => void;
    disabled? : boolean;
    errors : string | undefined;
    showPassword? : boolean;
    setShowPassword? : (value : boolean) => void;
}



const Input:React.FC<InputProps> = ({
    type = 'text',
    label,
    charSize,
    ref,
    value,
    onChange,
    disabled=false,
    errors,
    showPassword,
    setShowPassword
}) => {

    const handleTogglePassword = () => {
        if(setShowPassword){
            setShowPassword(!showPassword);
        }
    };

    const id = useId();

  return (
    <div className="w-full relative">
        <input
            ref={ref}
            id={id}
            type={showPassword ? 'text' : type}
            disabled={disabled}
            value={value}
            maxLength={charSize}
            onChange={e => onChange(e.target.value)}
            placeholder=""
            className={`
                peer
                w-full
                p-3
                pt-4
                bg-white
                border-2
                rounded-lg
                outline-none
                transition
                diasbled:opacity-70
                disabled:cursor-not-allowed
                disabled:bg-gray-100
                ${type === 'password' && !showPassword && value ? 'font-bold text-2xl' : 'font-light'}
                ${errors ? 'border-red-500' : 'border-neutral-500'}
                ${errors ? 'focus:border-red-500' : 'focus:border-[#2B5A9E]'}
        `}
        />
        {label === 'Password' && (
        <div
          className="absolute top-4 right-4 cursor-pointer transition duration-150 peer-placeholder-shown:hidden"
          onClick={handleTogglePassword}
        >
          {!showPassword ? (
            <BsEyeSlash size={22} />
          ) : (
            <BsEye size={22} />
          )}
        </div>
      )}
        <label htmlFor={id} className={`
            absolute
            text-sm
            text-neutral-600
            duration-150
            transform
            -translate-y-7
            bg-white
            px-1
            top-4
            left-4
            z-10
            orgin-[0]
            peer-placeholder-shown:scale-110
            peer-placeholder-shown:translate-y-0
            peer-focus:-translate-y-7
            ${errors ? 'text-red-500' : 'text-zinc-500'}
            ${errors ? 'peer-focus:text-red-500' : 'peer-focus:text-[#2B5A9E]'}`}>
            {label}
        </label>
        <div className={`${errors ? '-mb-3' : '' }`}>
            {errors && <span className="text-rose-500 rounded-xl p-1 px-2 mx-1 font-medium flex justify-start items-center gap-1">{errors}</span>}
        </div>
    </div>
  )
}

export default Input