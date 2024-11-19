import { Link, useNavigate } from "react-router-dom"
import Modal from "../../components/auth/Modal"
import Input from "../../components/auth/Input";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContact, setPassword, setShowPassword ,loginUser } from "../../store/features/auth/AuthSlice";
import { AuthState } from "../../store/features/auth/AuthState";
import { AppDispatch } from "../../store/store";
import { UserState } from "../../store/features/auth/UserState";
import { setIsAuthenticated, setToken, setUserData } from "../../store/features/UserSlice";

const LoginPage = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isLoading = useSelector((state: { auth : AuthState}) => state.auth.isLoading);
  const errors = useSelector((state: { auth : AuthState}) => state.auth.errors);
  const contact = useSelector((state: { auth : AuthState}) => state.auth.contact);
  const password = useSelector((state: { auth : AuthState}) => state.auth.password);
  const showPassword = useSelector((state: { auth : AuthState}) => state.auth.showPassword);
  const IsAuthenticated = useSelector((state: { user : UserState}) => state.user.isAuthenticated);
  const userData = useSelector((state: { user : UserState}) => state.user.userData);

  const contactRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(loginUser({contact, password}))
      .then((res) => {
        if (res.type === 'auth/loginUser/fulfilled') {
            const newUserData = {
                ...userData,
                firstName: res.payload.firstName,
                lastName: res.payload.lastName,
                contact : contact
            }
            dispatch(setUserData(newUserData));
            dispatch(setIsAuthenticated(true));
            dispatch(setToken(res.payload.token));
            dispatch(setPassword(''));
            dispatch(setContact(''));
        }
      })
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    if(IsAuthenticated){
      navigate('/dashboard');
    }
    else {
      contactRef.current?.focus();
    }
  },[ IsAuthenticated , navigate ]);

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
            onChange={(e) => dispatch(setContact(e))}
            disabled={isLoading}
            type="text"
            errors={errors.contactError}
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          />
          <Input
            inputRef={passwordRef}
            label='Password'
            value={password}
            onChange={(e) => dispatch(setPassword(e))}
            type="password"
            disabled={isLoading}
            errors={errors.passwordError}
            showPassword={showPassword}
            setShowPassword={(value) => dispatch(setShowPassword(value))}
            onKeyDown={(e) => handleKeyDown(e)}
            autoComplete="off"
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