import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

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
    const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
    if(!isPasswordValid || password !== confirmPassword){
      dispatch(setErrors({
        passwordError: (password.length < 8) ? 'Password must be at least 8 characters' : '',
        confirmPasswordError: (password !== confirmPassword) ? 'Passwords do not match' : ''
      }))
    }
    if(!password || !confirmPassword){
      dispatch(setErrors({
        passwordError: !password ? 'Password is required!' : '',
        confirmPasswordError: !confirmPassword ? 'Confirm Password is required!' : ''
      }))
    
      return rejectWithValue('Password is required!');
    }
    else if(isPasswordValid && password === confirmPassword){
      dispatch(setErrors({
        passwordError: '',
        confirmPasswordError: ''
      }))
    }
    // Api logic
    setIsLoading(true);
    toast.loading('Setting Password...');
    try {
      const response = await axios.put('https://workify-springboot-1-sinj.onrender.com/api/v1/auth/verify-otp', {
        contact,
        otp,
        password,
        confirmPassword
      })
        toast.dismiss();
        toast.success('Password changed successfully');
        return response.data;
    } catch (error) {
        toast.dismiss();
        toast.error('Invalid OTP! Try Again');
        return rejectWithValue('Invalid OTP');
        console.log(error);
    } finally {
        setIsLoading(false);
    }
    }
)

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

