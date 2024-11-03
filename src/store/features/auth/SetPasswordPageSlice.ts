import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export interface SetPasswordPageState {
    password: string;
    confirmPassword: string;
    errors: {
        passwordError: string;
        confirmPasswordError: string;
    };
    isLoading: boolean;
}

const initialState = {
    password: '',
    confirmPassword: '',
    errors: {
        passwordError: '',
        confirmPasswordError: ''
    },
    isLoading: false,
} as SetPasswordPageState;

export const changePassword = createAsyncThunk(
    'newPassword/setPassword',
    async ({ contact , otp ,password , confirmPassword }: { contact : string , otp:string , password: string, confirmPassword: string }, { rejectWithValue, dispatch }) => {
    const isPasswordValid = PASSWORD_REGEX.test(password);
    if(!isPasswordValid || password !== confirmPassword){
      dispatch(setErrors({
        passwordError: (!isPasswordValid) ? !password ? 'Password is required!' : 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character' : '',
        confirmPasswordError: !confirmPassword ? 'Confirm password is Required!' : (password !== confirmPassword) ? 'Passwords do not match' : ''
      }));
      return rejectWithValue('Validation errors');
    } else if(isPasswordValid && password === confirmPassword){
      dispatch(setErrors({
        passwordError: '',
        confirmPasswordError: ''
      }));
    }
    // Api logic
    dispatch(setIsLoading(true));
    toast.loading('Setting Password...');
    try {
      const response = await axios.put('https://workify-springboot-1-sinj.onrender.com/api/v1/auth/verify-otp', {
        contact,
        otp,
        newPassword : password,
        confirmPassword
      });
        toast.dismiss();
        toast.success('Password changed successfully');
        return response.data;
    } catch (error) {
        toast.dismiss();
        toast.error('Invalid OTP! Try Again');
        return rejectWithValue('Invalid OTP');
        console.log(error);
    } finally {
        dispatch(setIsLoading(false));
    }
    }
);

const SetPasswordPageSlice = createSlice({
    name: 'setPasswordPage',
    initialState,
    reducers: {
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setConfirmPassword: (state, action) => {
            state.confirmPassword = action.payload;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    }
});

export const { setPassword, setConfirmPassword, setErrors, setIsLoading } = SetPasswordPageSlice.actions;

export default SetPasswordPageSlice.reducer;

