import { useState, useRef, useEffect } from "react";
import Modal from "../../components/auth/Modal";
import InputOTP from "../../components/auth/InputOTP";
import { useSelector, useDispatch } from "react-redux";
import { setIsAllowed, setOTP, verifyOTP , verifyForgotOTP } from "../../store/features/auth/VerifyOTPSlice";
import { AuthState } from "../../store/features/auth/AuthState";
import { AppDispatch } from "../../store/store";
import { setIsAuthenticated, setToken, setUserData } from "../../store/features/auth/UserSlice";
import { registerUser, setContact, setName, setPassword } from "../../store/features/auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import { VerifyOTPState } from "../../store/features/auth/VerifyOTPState";
import { validateContact } from "../../store/features/auth/ForgotPasswordSlice";

const VerifyOTP = () => {

    const isAllowed = useSelector((state: { verifyOTP : VerifyOTPState }) => state.verifyOTP.isAllowed);

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [timer, setTimer] = useState<number>(29);
    const [showResend, setShowResend] = useState<boolean>(false);
    const error = useSelector((state: { verifyOTP: { error: boolean; }; }) => state.verifyOTP.error);
    const loading = useSelector((state: { verifyOTP: { isLoading: boolean; }; }) => state.verifyOTP.isLoading);
    const contact = useSelector((state: { auth: AuthState }) => state.auth.contact);
    const name = useSelector((state: { auth: AuthState }) => state.auth.name);
    const password = useSelector((state: { auth: AuthState }) => state.auth.password);
    const sendBy = useSelector((state: { verifyOTP: VerifyOTPState }) => state.verifyOTP.sendBy);
    const contactOfForgot = useSelector((state: { forgot: { contact: string; }; }) => state.forgot.contact);

    const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const handleOTPChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < otpRefs.length - 1) {
            otpRefs[index + 1].current?.focus();
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (index === otpRefs.length - 1) {
                handleSubmit(e);
            } else if (index < otpRefs.length - 1) {
                otpRefs[index + 1].current?.focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        dispatch(setOTP(otpValue));
        try {
            if(sendBy === 'forgot'){
                dispatch(verifyForgotOTP({
                    contact: contactOfForgot,
                    otp: otpValue
                })).then((res) => {
                    if (res.type === 'verifyOTP/verifyForgotOTP/fulfilled') {
                        dispatch(setIsAllowed(false));
                        dispatch(setOTP(''));
                        dispatch(setContact(''));
                    }
                });
            } else {
            dispatch(verifyOTP({
                contact,
                otp: otpValue
            })).then((res) => {
                if (res.type === 'verifyOTP/verifyOTP/fulfilled') {
                    const newUserData = {
                        firstName: name.split(' ')[0],
                        lastName: name.split(' ')[1],
                        contact : contact,
                        emailVerified: true
                    }
                    dispatch(setIsAllowed(false));
                    dispatch(setUserData(newUserData));
                    dispatch(setIsAuthenticated(true));
                    dispatch(setToken(res.payload.token));
                    dispatch(setName(''));
                    dispatch(setOTP(''));
                    dispatch(setPassword(''));
                    dispatch(setContact(''));
                }
            });
        }
        } catch (error) {
            console.log(error);
        }
    };

    const handleResend = () => {
        setTimer(29);
        setShowResend(false);
        if(sendBy === 'forgot'){
            dispatch(validateContact(contactOfForgot))
        }
        else {
            dispatch(registerUser({
                name,
                contact,
                password,
            }))
        }
    };

    const footer = (
        <p className="text-lg font-medium -mt-3">
            Didn't receive the code?{" "}
            {showResend ? (
                <button className={`text-lg text-[#2B5A9E] font-medium`} onClick={handleResend}>
                    Resend Code
                </button>
            ) : (
                <span className="text-lg text-[#4b7cc1]">Resend in {timer}s</span>
            )}
        </p>
    );

    useEffect(() => {
        if (!isAllowed) {
            if(sendBy === 'forgot'){
                navigate('/auth/new-password');
            }else {
                navigate('/dashboard');
            }
        }
    }, [isAllowed , navigate, sendBy]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setShowResend(true);
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

    return (
        <>
            <Modal
                backURL={ sendBy === 'forgot' ? '/auth/forgot-password' : '../../auth/register'}
                disabled={loading}
                title="Enter the code"
                subTitlte={`Enter the OTP code we have sent to ${contact}`}
                actionLabel="Verify"
                onSubmit={handleSubmit}
                footer={footer}
            >
                <form className="flex items-center justify-around gap-2" onSubmit={handleSubmit}>
                    {otpRefs.map((ref, index) => (
                        <InputOTP
                            key={index}
                            ref={ref}
                            value={otp[index]}
                            onChange={(value) => handleOTPChange(value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            error={error}
                        />
                    ))}
                </form>
            </Modal>
        </>
    );
};

export default VerifyOTP;