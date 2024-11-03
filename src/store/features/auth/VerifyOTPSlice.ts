import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { VerifyOTPState } from "./VerifyOTPState";

const initialState: VerifyOTPState = {
    isLoading: false,
    error: false,
    otp: '',
    isAllowed: false
};

export const verifyOTP = createAsyncThunk(
    'verifyOTP/verifyOTP',
    async ({ contact, otp }:{ contact : string , otp : string}, { rejectWithValue, dispatch }) => {
        if (otp.length !== 6) {
            dispatch(setError(true));
            return rejectWithValue('Invalid OTP');
        }
        dispatch(setError(false));
        toast.loading('Verifying OTP...');
        dispatch(setIsLoading(true));
        try {
            const response = await axios.post('https://workify-springboot-1-sinj.onrender.com/api/v1/auth/validate', {
                contact,
                otp
            });
            toast.dismiss();
            toast.success('OTP verified successfully!');
            return response.data;
        } catch (error) {
            toast.dismiss();
            toast.error('Invalid OTP!');
            console.log(error);
        } finally {
            dispatch(setIsLoading(false));
        }
    }
);

const VerifyOTPSlice = createSlice({
    name: 'verifyOTP',
    initialState,
    reducers: {
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<boolean>) {
            state.error = action.payload;
        },
        setOTP(state, action: PayloadAction<string>) {
            state.otp = action.payload;
        },
        setIsAllowed(state, action: PayloadAction<boolean>){
            state.isAllowed = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.otp = action.payload;
            })
            .addCase(verifyOTP.rejected, (state) => {
                state.isLoading = false;
                state.error = true;
            });
    }
});

export const { setIsLoading, setError, setOTP, setIsAllowed } = VerifyOTPSlice.actions;

export default VerifyOTPSlice.reducer;