import { Link } from "react-router-dom"
import Modal from "../../components/Auth/Modal"

const RegisterPage = () => {

  const footer = (
    <p className="text-sm -mt-7">
      Already have an account?{" "}
      <Link to="/auth/login" className="text-[.95rem] text-[#2B5A9E] font-semibold">
        Log in
      </Link>
    </p>
  )
  return (
    <>
      <Modal
        backURL="/"
        title="Create Your Account"
        subTitlte="Join the Workify community to find your ideal job fit."
        actionLabel="Create Account"
        action={() => {}}
        footer={footer}
      >
        <div className="border border-red-500 p-10">Main Body</div>
      </Modal>
    </>
  )
}

export default RegisterPage