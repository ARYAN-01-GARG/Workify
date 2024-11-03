import { useEffect, useRef } from "react";
import Input from "../../components/auth/Input";
import Modal from "../../components/auth/Modal"
import { useNavigate } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { ForgotPasswordState } from "../../store/features/auth/ForgotPasswordState";
import { setContact } from "../../store/features/auth/ForgotPasswordSlice";
import { setIsAllowed, setSendBy } from "../../store/features/auth/VerifyOTPSlice";
import { validateContact } from "../../store/features/auth/ForgotPasswordSlice";
import { AppDispatch } from "../../store/store";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const contact = useSelector((state: { forgot : ForgotPasswordState} ) => state.forgot.contact);
    const isLoading = useSelector((state: { forgot : ForgotPasswordState} ) => state.forgot.isLoading);
    const error = useSelector((state: { forgot : ForgotPasswordState} ) => state.forgot.errors);
    const isAuthenticated = useSelector((state: { user: { isAuthenticated: boolean; }; }) => state.user.isAuthenticated);

    const contactRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isAuthenticated){
            navigate('/dashboard');
        } else {
        contactRef.current?.focus();}
    }, [ dispatch, isAuthenticated , navigate ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            dispatch(validateContact(contact))
            .then((res) => {
                if(res.type === 'forgotPassword/validateContact/fulfilled'){
                    dispatch(setIsAllowed(true));
                    dispatch(setSendBy('forgot'));
                    navigate('/auth/verify');
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
  return (
    <Modal
        backURL="/auth/login"
        title="Forgot Password"
        subTitlte="Enter your registered email or phone number"
        disabled={isLoading}
        footer={<></>}
        onSubmit={handleSubmit}
        actionLabel="Get OTP"
    >
        <form className="flex flex-col gap-5 w-full mt-3 -mb-5" onSubmit={handleSubmit}>
          <Input
            inputRef={contactRef}
            label={/[0-9]/.test(contact) && !/[a-zA-Z]/.test(contact) ? 'Phone number' : /[a-zA-Z]/.test(contact) ? 'Email' : 'Enter Email/Phone number'}
            value={contact}
            onChange={(value) => dispatch(setContact(value))}
            disabled={isLoading}
            type="text"
            errors={error}
          />
        </form>
    </Modal>
  )
}

export default ForgotPassword;