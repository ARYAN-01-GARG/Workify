import {
  setName,
  setContact,
  setPassword,
  setShowPassword,
  registerUser
} from "../../store/features/auth/AuthSlice";
import { AuthState } from "../../store/features/auth/AuthState";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../components/auth/Modal";
import Input from "../../components/auth/Input";
import { useRef, useEffect } from "react";
import { Link , useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import { setIsAllowed } from "../../store/features/auth/VerifyOTPSlice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: { auth: AuthState }) => state.auth.isLoading);
  const errors = useSelector((state: { auth: AuthState }) => state.auth.errors);
  const name = useSelector((state: { auth: AuthState }) => state.auth.name);
  const contact = useSelector((state: { auth: AuthState }) => state.auth.contact);
  const password = useSelector((state: { auth: AuthState }) => state.auth.password);
  const showPassword = useSelector((state: { auth: AuthState }) => state.auth.showPassword);
  const isAuthenticated = useSelector((state: { user: { isAuthenticated: boolean; }; }) => state.user.isAuthenticated);

  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch({ type: 'auth/activeUser' });
    nameRef.current?.focus();
  },[ dispatch ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try{
      dispatch(registerUser({
        name: name,
        contact: contact,
        password: password
      }))
      .then((res) => {
        if(res.type === 'auth/registerUser/fulfilled'){
        dispatch(setIsAllowed(true));
        navigate('/auth/verify');
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

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
  );

  return (
    <>
      <Modal
        disabled={isLoading}
        backURL="/"
        title="Create Your Account"
        subTitlte="Join the Workify community to find your ideal job fit."
        actionLabel="Create Account"
        onSubmit={handleSubmit}
        footer={isAuthenticated ? <></> : footer}
      >
        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          <Input
            inputRef={nameRef}
            label='Name'
            charSize={22}
            value={name}
            onChange={(value) => dispatch(setName(value))}
            disabled={isLoading}
            errors={errors.nameError}
            onKeyDown={(e) => handleKeyDown(e, contactRef)}
          />
          <Input
            inputRef={contactRef}
            label={/[0-9]/.test(contact) && !/[a-zA-Z]/.test(contact) ? 'Phone number' : /[a-zA-Z]/.test(contact) ? 'Email' : 'Enter Email/Phone number'}
            value={contact}
            charSize={50}
            onChange={(value) => dispatch(setContact(value))}
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
            onChange={(value) => dispatch(setPassword(value))}
            type="password"
            disabled={isLoading}
            errors={errors.passwordError}
            showPassword={showPassword}
            setShowPassword={(value) => dispatch(setShowPassword(value))}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </form>
      </Modal>
    </>
  );
};

export default RegisterPage;