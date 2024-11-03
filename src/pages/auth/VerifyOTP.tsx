import { useState, useRef } from "react";
import Modal from "../../components/auth/Modal";
import InputOTP from "../../components/auth/InputOTP";
import { useSelector, useDispatch } from "react-redux";
import { verifyOTP } from "../../store/features/auth/VerifyOTPSlice";
import { AuthState } from "../../store/features/auth/AuthState";
import { AppDispatch } from "../../store/store";

const VerifyOTP = () => {
    const dispatch: AppDispatch = useDispatch();
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

    const error = useSelector((state: { verifyOTP: { error: boolean; }; }) => state.verifyOTP.error);
    const loading = useSelector((state: { verifyOTP: { isLoading: boolean; }; }) => state.verifyOTP.isLoading);
    const contact = useSelector((state: { auth: AuthState }) => state.auth.contact);

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
        dispatch(verifyOTP({
            contact,
            otp: otpValue
        }));
    };

    const footer = (
        <p className="text-lg font-medium -mt-3">
            Didn't receive the code?{" "}
            <button className={`text-lg text-[#2B5A9E] font-medium`}>
                Resend Code
            </button>
        </p>
    );

    return (
        <Modal
            backURL={'../../auth/register'}
            disabled={loading}
            title="Enter the code"
            subTitlte="Enter the OTP code we have sent to abc@gmail.com"
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
    );
};

export default VerifyOTP;