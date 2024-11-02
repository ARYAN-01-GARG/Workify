import { useRef, useState } from "react";
import Input from "../../components/auth/Input"
import Modal from "../../components/auth/Modal"



const SetPasswordPage = () => {

  const [password, setPassword] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors , setErrors] = useState<{ passwordError: string, confirmPasswordError: string }>({ passwordError: '', confirmPasswordError: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPasswordValid = password.length >= 6;
    if(!isPasswordValid || password !== confirmPassword){
      setErrors({
        ...errors,
        passwordError: (password.length < 6) ? 'Password must be at least 6 characters' : '',
        confirmPasswordError: (password !== confirmPassword) ? 'Passwords do not match' : ''
      })
    }
    if(!password || !confirmPassword){
      setErrors({
        ...errors,
        passwordError: !password ? 'Password is required!' : '',
        confirmPasswordError: !confirmPassword ? 'Confirm Password is required!' : ''
      })
      return;
    }
    else if(isPasswordValid && password === confirmPassword){
      setErrors({
        ...errors,
        passwordError: '',
        confirmPasswordError: ''
      })
    }
    // Api logic
    setIsLoading(true);
    try {
      await setTimeout(() => {
        console.log('Set Password',isLoading);
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
        backURL="auth/forgot-password"
        title="Forgot Password"
        subTitlte=""
        disabled={isLoading}
        footer={<></>}
        onSubmit={handleSubmit}
        actionLabel="Get OTP"
    >
        <form className="flex flex-col gap-5 w-full mt-3 -mb-5" onSubmit={handleSubmit}>
          <Input
            inputRef={passwordRef}
            label='New Password'
            value={password}
            onChange={setPassword}
            type="password"
            disabled={isLoading}
            errors={errors.passwordError}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <Input
            inputRef={confirmPasswordRef}
            label='Confirm Password'
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            disabled={isLoading}
            errors={errors.confirmPasswordError}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </form>
    </Modal>
  )
}

export default SetPasswordPage