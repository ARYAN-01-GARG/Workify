import { Link } from "react-router-dom"
import Modal from "../../components/auth/Modal"
import axios from "axios";
import Input from "../../components/auth/Input";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";



interface Errors{
  nameError: string
  contactError: string
  passwordError: string
}

const LoginPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors , setErrors] = useState<Errors>({ nameError: '', contactError: '', passwordError: ''});

  const [contact, setContact] = useState<string>('');
  const contactRef = useRef<HTMLInputElement>(null);
  const PHONE_REGEX = /^[0-9]{10}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    contactRef.current?.focus();
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isContactValid = EMAIL_REGEX.test(contact) || PHONE_REGEX.test(contact);
    if(!isContactValid || password.length < 6){
      setErrors({
        ...errors,
        contactError: (!isContactValid) ?  /^[0-9]{10}$/.test(contact) ? 'Phone number is invalid!' : 'Email is invalid!' : '',
        passwordError: (password.length < 6) ? 'Password must be at least 6 characters' : ''
      })
    }
    if(!contact || !password){
      setErrors({
        ...errors,
        contactError: !contact ? 'Email or Phone Number is required!' : '',
        passwordError: !password ? 'Password is required!' : ''
      })
      return;
    }
    else if(isContactValid || password.length > 6){
      setErrors({
        ...errors,
        contactError: '',
        passwordError: ''
      })
    }
    // Api logic
    setIsLoading(true);
    toast.loading('Please wait...');
    try{
      // API call

      const response = await axios.post('https://workify-springboot-1-sinj.onrender.com/api/v1/auth/authenticate', {
        contact : contact,
        password
      });
      console.log(response.data);
      toast.dismiss();
      toast.success('Login Successfull!');
    } catch (error){
      console.log(error);
      toast.dismiss();
      toast.error('Invalid Password or Email/Phone number');
    } finally{
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef?: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef) {
        nextRef.current?.focus();
      } else {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const footer = (
    <p className="text-sm -mt-7">
      Don't have an account?{" "}
      <Link to="/auth/register" className={`text-[.95rem] text-[#2B5A9E] font-semibold ${isLoading ? 'opacity-70' : ''}`}>
        Sign Up
      </Link>
    </p>
  )
  return (
    <>
      <Modal
        disabled={isLoading}
        backURL="/"
        title="Login"
        subTitlte="To explore opportunities and take the next step in your career"
        actionLabel="Log in"
        onSubmit={handleSubmit}
        footer={footer}
      >
        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          <Input
            inputRef={contactRef}
            label={/[0-9]/.test(contact) && !/[a-zA-Z]/.test(contact) ? 'Phone number' : /[a-zA-Z]/.test(contact) ? 'Email' : 'Enter Email/Phone number'}
            value={contact}
            onChange={setContact}
            disabled={isLoading}
            type="text"
            errors={errors.contactError}
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          />
          <Input
            inputRef={passwordRef}
            label='Password'
            value={password}
            onChange={setPassword}
            type="password"
            disabled={isLoading}
            errors={errors.passwordError}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <div className="flex justify-between items-center font-medium">
            <div className="flex items-center gap-1">
              <input type="checkbox" id="remember" className="bg-neutral-800 outline-none border-none"/>
              <label htmlFor="remember">Remember me</label>
            </div>
            <div>
              <Link to="/auth/forgot-password">Forgot password?</Link>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default LoginPage