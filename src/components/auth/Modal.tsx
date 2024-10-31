import React from "react"
import { Link } from "react-router-dom"

interface ModalProps{
  backURL: string
  title: string
  subTitlte: string
  children: React.ReactNode
  actionLabel: string
  action: () => void
  footer: React.ReactNode
  secondaryAction?: () => void
}

const Modal:React.FC<ModalProps> = ({
  backURL,
  title,
  subTitlte,
  children,
  actionLabel,
  action,
  footer,
}) => {
  return (
    <div className="relative h-full w-full flex justify-center items-center">
      <div
        className="flex flex-col justify-center items-center gap-12 max-w-[385px]">
          <div className="absolute top-10 right-20 text-4xl ">
            <Link to={backURL}>←</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold">{title}</h1>
            <h2 className="text-[.95rem] font-medium pl-1 pr-4">{subTitlte}</h2>
          </div>
          <div>
            {children}
          </div>
          <div className="w-full bg-[#2B5A9E] text-white text-xl font-medium text-center p-[.6rem] shadow-sm rounded-xl">
            <button onClick={action}>
              {actionLabel}
            </button>
          </div>
          <div>
            {footer}
          </div>
      </div>
    </div>
  )
}

export default Modal