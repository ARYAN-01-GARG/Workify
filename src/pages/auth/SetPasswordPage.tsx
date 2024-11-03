import { useEffect, useRef } from "react";
import Input from "../../components/auth/Input";
import Modal from "../../components/auth/Modal";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, setConfirmPassword, setPassword, SetPasswordPageState } from "../../store/features/auth/SetPasswordPageSlice";
import { AuthState } from "../../store/features/auth/AuthState";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { setShowPassword } from "../../store/features/auth/AuthSlice";
import { ForgotPasswordState } from "../../store/features/auth/ForgotPasswordState";
import { VerifyOTPState } from "../../store/features/auth/VerifyOTPState";
import { setIsAllowed, setSendBy } from "../../store/features/auth/VerifyOTPSlice";
import { setContact } from "../../store/features/auth/ForgotPasswordSlice";

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const password = useSelector((state : { newPassword : SetPasswordPageState }) => state.newPassword.password);
  const isAuthenticated = useSelector((state : { user : { isAuthenticated : boolean } }) => state.user.isAuthenticated);
  const isAllowed = useSelector((state : { verifyOTP : VerifyOTPState }) => state.verifyOTP.isAllowed);
  const showPassword = useSelector((state : { auth : AuthState }) => state.auth.showPassword);
  const contact = useSelector((state : { forgot : ForgotPasswordState }) => state.forgot.contact);
  const otp = useSelector((state : { verifyOTP : VerifyOTPState }) => state.verifyOTP.otp);
  const confirmPassword = useSelector((state : { newPassword : SetPasswordPageState }) => state.newPassword.confirmPassword);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const isLoading = useSelector((state : { newPassword : SetPasswordPageState }) => state.newPassword.isLoading);
  const errors = useSelector((state : { newPassword : SetPasswordPageState }) => state.newPassword.errors);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      dispatch(changePassword({
        contact,
        otp,
        password,
        confirmPassword
      }))
      .then((res) => {
        if(res.type === 'newPassword/setPassword/fulfilled'){
            dispatch(setSendBy(''));
            dispatch(setIsAllowed(false));
            dispatch(setPassword(''));
            dispatch(setConfirmPassword(''));
            dispatch(setContact(''));
            navigate('/auth/login');
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

  useEffect(() => {
    // if (!isAllowed || isAuthenticated) {
    //   navigate('/auth/login');
    // } else {
      passwordRef.current?.focus();
    // }
  }, [dispatch , isAllowed , isAuthenticated , navigate]);

  return (
    <Modal
        backURL="/auth/verify"
        title="Set New Password"
        subTitlte="Please make sure your password is secure"
        disabled={isLoading}
        footer={<></>}
        onSubmit={handleSubmit}
        actionLabel="Get OTP"
    >
        <form className="flex flex-col gap-5 w-full mt-3 -mb-5" onSubmit={handleSubmit}>
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
            onKeyDown={(e) => handleKeyDown(e , confirmPasswordRef)}
          />
          <Input
            inputRef={confirmPasswordRef}
            label='Confirm Password'
            value={confirmPassword}
            charSize={50}
            onChange={(value) => dispatch(setConfirmPassword(value))}
            type="password"
            disabled={isLoading}
            errors={errors.confirmPasswordError}
            showPassword={showPassword}
            setShowPassword={(value) => dispatch(setShowPassword(value))}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </form>
    </Modal>
  );
};

export default SetPasswordPage;