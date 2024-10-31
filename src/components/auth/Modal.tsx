import React, { useCallback } from "react"
import { Link } from "react-router-dom"

interface ModalProps{
  backURL: string
  disabled: boolean
  title: string
  subTitlte: string
  children: React.ReactNode
  actionLabel: string
  onSubmit: (e:React.FormEvent) => void
  footer: React.ReactNode
  secondaryAction?: () => void
}

const Modal:React.FC<ModalProps> = ({
  backURL,
  disabled,
  title,
  subTitlte,
  children,
  actionLabel,
  onSubmit,
  footer,
}) => {

  const handleSubmit = useCallback((e:React.FormEvent) => {
    if(disabled){
      return;
    }
    onSubmit(e);
  },[onSubmit, disabled]);



  return (
    <div className="relative h-full w-full flex justify-center items-center">
      <div
        className="flex flex-col justify-center items-center gap-12 max-w-[385px]">
          <div className={`absolute top-10 right-20 text-4xl ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <Link aria-disabled={disabled} to={backURL}>←</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold">{title}</h1>
            <h2 className="text-[.95rem] font-medium pl-1 pr-4">{subTitlte}</h2>
          </div>
          <div className="w-full">
            {children}
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={disabled}
            className={` outline-none w-full bg-[#2B5A9E] text-white text-xl font-medium text-center p-[.6rem] shadow-sm rounded-xl ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {disabled ? "Please wait..." : actionLabel}
          </button>
          <div
            aria-disabled={disabled}>
            {footer}
          </div>
      </div>
    </div>
  )
}

export default Modal