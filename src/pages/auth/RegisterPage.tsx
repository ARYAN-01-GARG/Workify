import Modal from "../../components/Auth/Modal"

const RegisterPage = () => {
  return (
    <>
      <Modal 
        backURL="/"
        title="Create Your Account"
        subTitlte="Join the Workify community to find your ideal job fit"
        actionLabel="Create Account"
        action={() => {}}
        footer={<></>}
      />
      <div>Main Body</div>
    </>
  )
}

export default RegisterPage