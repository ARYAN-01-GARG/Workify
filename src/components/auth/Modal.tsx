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
  footer
}) => {
  return (
    <div
      className="h-full w-full ">
        <div>
          <Link to={'/'}>←</Link>
        </div>
        <div>
          <h1>{title}</h1>
          <p>{subTitlte}</p>
        </div>
        <div>
          {children}
        </div>
        <div>
          <button onClick={action}>{actionLabel}</button>
        </div>
        <div>
          {footer}
        </div>
    </div>
  )
}

export default Modal