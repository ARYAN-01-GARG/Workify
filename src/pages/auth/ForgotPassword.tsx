import { useEffect, useRef, useState } from "react";
import Input from "../../components/auth/Input";
import Modal from "../../components/auth/Modal"

const ForgotPassword = () => {
    const [contact, setContact] = useState<string>('');
    const contactRef = useRef<HTMLInputElement>(null);
    const PHONE_REGEX = /^[0-9]{10}$/;
    const EMAIL_REGEX = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const [errors, setErrors] = useState<{ contactError: string }>({ contactError: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        contactRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isContactValid = EMAIL_REGEX.test(contact) || PHONE_REGEX.test(contact);
        if (!isContactValid) {
            setErrors({
                ...errors,
                contactError: (!isContactValid) ? /^[0-9]{10}$/.test(contact) ? 'Phone number is invalid!' : 'Email is invalid!' : '',
            })
        }
        if (!contact) {
            setErrors({
                ...errors,
                contactError: !contact ? 'Email or Phone Number is required!' : '',
            })
            return;
        }
        else if (isContactValid) {
            setErrors({
                ...errors,
                contactError: '',
            })
        }
        // Api logic
        setIsLoading(true);
        try {
            await setTimeout(() => {
                console.log('Forgot Password',isLoading);
            }, 2000);
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
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
            onChange={setContact}
            disabled={isLoading}
            type="text"
            errors={errors.contactError}
          />
        </form>
    </Modal>
  )
}

export default ForgotPassword