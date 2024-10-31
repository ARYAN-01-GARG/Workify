import { Link } from "react-router-dom"
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import Modal from "../../components/auth/Modal";
import Input from "../../components/auth/Input";


interface Errors{
  nameError: string
  contactError: string
  passwordError: string
}

const RegisterPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors , setErrors] = useState<Errors>({ nameError: '', contactError: '', passwordError: ''});

  const [name, setName] = useState<string>('');
  const NAME_REGEX = /^[a-zA-Z ]{3,22}$/;
  const nameRef = useRef<HTMLInputElement>(null);


  const [contact, setContact] = useState<string>('');
  const contactRef = useRef<HTMLInputElement>(null);
  const PHONE_REGEX = /^[0-9]{10}$/;
  const EMAIL_REGEX = /^[a-zA-Z]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isContactValid = EMAIL_REGEX.test(contact) || PHONE_REGEX.test(contact);
    if(!NAME_REGEX.test(name) || !isContactValid || password.length < 6){
      setErrors({
        nameError: (name.length < 3) && /[a-zA-Z]/.test(name) ? 'Name is invalid must be between 2 to 22 characters' : (!NAME_REGEX.test(name)) ? 'Name is invalid!' : '',
        contactError: (!isContactValid) ?  /^[0-9]{10}$/.test(contact) ? 'Phone number is invalid!' : 'Email is invalid!' : '',
        passwordError: (password.length < 6) ? 'Password must be at least 6 characters' : ''
      })
    }
    if(!name || !contact || !password){
      setErrors({
        nameError: !name ? 'Name is required!' : '',
        contactError: !contact ? 'Email or Phone Number is required!' : '',
        passwordError: !password ? 'Password is required!' : ''
      })
      return;
    }
    else if(NAME_REGEX.test(name) || isContactValid || password.length > 6){
      setErrors({
        nameError: '',
        contactError: '',
        passwordError: ''
      })
    }
    // Api logic
    setIsLoading(true);
    try{
      // API call
      const response = await axios.post('http://localhost:3000/auth/login', {contact, password});
      console.log(response.data);
    } catch (error){
      console.log(error);
    } finally{
      setIsLoading(false);
    }
  }

  const footer = (
    <p className="text-sm -mt-7">
      Already have an account?{" "}
      <Link to="/auth/login" className={`text-[.95rem] text-[#2B5A9E] font-semibold ${isLoading ? 'opacity-70' : ''}`}>
        Log in
      </Link>
    </p>
  )
  return (
    <>
      <Modal
        disabled={isLoading}
        backURL="/"
        title="Create Your Account"
        subTitlte="Join the Workify community to find your ideal job fit."
        actionLabel="Create Account"
        onSubmit={handleSubmit}
        footer={footer}
      >
        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          <Input
            ref={nameRef}
            label='Name'
            value={name}
            onChange={setName}
            disabled={isLoading}
            errors={errors.nameError}
          />
          <Input
            ref={contactRef}
            label={/[0-9]/.test(contact) && !/[a-zA-Z]/.test(contact) ? 'Phone number' : /[a-zA-Z]/.test(contact) ? 'Email' : 'Enter Email/Phone number'}
            value={contact}
            onChange={setContact}
            disabled={isLoading}
            type="text"
            errors={errors.contactError}
          />
          <Input
            ref={passwordRef}
            label='Password'
            value={password}
            onChange={setPassword}
            type="password"
            disabled={isLoading}
            errors={errors.passwordError}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            />
        </form>
      </Modal>
    </>
  )
}

export default RegisterPage