import { Link , useNavigate } from "react-router-dom"
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import Modal from "../../components/auth/Modal";
import Input from "../../components/auth/Input";
import { toast } from "react-hot-toast";


interface Errors{
  nameError: string
  contactError: string
  passwordError: string
}

const RegisterPage = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors , setErrors] = useState<Errors>({ nameError: '', contactError: '', passwordError: ''});

  const [name, setName] = useState<string>('');
  const NAME_REGEX = /^[a-zA-Z ]{3,22}$/;
  const nameRef = useRef<HTMLInputElement>(null);


  const [contact, setContact] = useState<string>('');
  const contactRef = useRef<HTMLInputElement>(null);
  const PHONE_REGEX = /^[0-9]{10}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  useEffect(() => {
    nameRef.current?.focus();
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isContactValid = EMAIL_REGEX.test(contact) || PHONE_REGEX.test(contact);
    const isPasswordValid = PASSWORD_REGEX.test(password);
    if(!NAME_REGEX.test(name) || !isContactValid || !isPasswordValid){
      setErrors({
        nameError: (name.length < 3) && /[a-zA-Z]/.test(name) ? 'Name is invalid must be between 2 to 22 characters' : !name ? 'Name is required!' : (!NAME_REGEX.test(name)) ? 'Name is invalid!' : '',
        contactError: (!isContactValid) ?  /^[0-9]{10}$/.test(contact) ? 'Phone number is invalid!' : !contact ? 'Email or Phone Number is required!' : 'Email is invalid!' : '',
        passwordError: (!isPasswordValid) ? !password ? 'Password is required!' : 'Password must be at least 6 characters and include uppercase, lowercase, digit, and special character' :  ''
      })
      return;
    }
    else if(NAME_REGEX.test(name) || isContactValid || isPasswordValid){
      setErrors({
        nameError: '',
        contactError: '',
        passwordError: ''
      })
    }
    // Api logic
    setIsLoading(true);
    toast.loading('Creating account...');
    try{
      // API cal
      const response = await axios.post('https://workify-springboot-1-sinj.onrender.com/api/v1/auth/register', {
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        username: name.split(' ')[0] + Math.floor(Math.random() * 1000),
        email: EMAIL_REGEX.test(contact) ? contact : null,
        mobile: PHONE_REGEX.test(contact) ? contact : null,
        password: password
      });
      toast.success('Account created successfully!');
      console.log(response.data);
      setTimeout(() => {
        toast.dismiss();
      })
      setTimeout(() => {
        navigate('/auth/verify');
      },10000)
    } catch (error){
      console.log(error);
      toast.dismiss();
      toast.error('Something went wrong.');
    } finally{
      setIsLoading(false);
      console.log('Account created successfully!');
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
            inputRef={nameRef}
            label='Name'
            charSize={22}
            value={name}
            onChange={setName}
            disabled={isLoading}
            errors={errors.nameError}
            onKeyDown={(e) => handleKeyDown(e, contactRef)}
          />
          <Input
            inputRef={contactRef}
            label={/[0-9]/.test(contact) && !/[a-zA-Z]/.test(contact) ? 'Phone number' : /[a-zA-Z]/.test(contact) ? 'Email' : 'Enter Email/Phone number'}
            value={contact}
            charSize={50}
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
            charSize={50}
            onChange={setPassword}
            type="password"
            disabled={isLoading}
            errors={errors.passwordError}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </form>
      </Modal>
    </>
  )
}

export default RegisterPage