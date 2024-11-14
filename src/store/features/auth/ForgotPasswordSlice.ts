import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const PHONE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const initialState = {
    contact : '',
    errors : '',
    isLoading : false,
}

export const validateContact = createAsyncThunk(
    'forgotPassword/validateContact',
    async (contact: string, { rejectWithValue , dispatch }) => {
        const isContactValid = EMAIL_REGEX.test(contact) || PHONE_REGEX.test(contact);

        if (!isContactValid) {
            dispatch(setErrors((!isContactValid) ? /^[0-9]{10}$/.test(contact) ? 'Phone number is invalid!' : 'Email is invalid!' : ''))
            return rejectWithValue('Invalid Email or Phone Number');
        }
        if (!contact) {
            dispatch(setErrors('Please enter your email or phone number'));
            return rejectWithValue('Please enter your email or phone number');
        }
        else if (isContactValid) {
            dispatch(setErrors(''));
        }
        // Api logic
        dispatch(setIsLoading(true));
        toast.loading('Sending OTP...');
        try {
            const response = await axios.post('https://naitikjain.me/api/v1/auth/forgot-password', { contact });
            toast.dismiss();
            toast.success('Enter OTP sent to your email/phone');
            return response.data;
        } catch (error) {
            toast.dismiss();
            toast.error('Email Not Registered');
            return rejectWithValue('Error sending OTP');
            console.log(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setContact(contact));
        }
    }
)

const ForgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers: {
        setContact: (state, action) => {
            state.contact = action.payload;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(validateContact.fulfilled, (state) => {
            state.errors = '';
        })
        .addCase(validateContact.rejected, (state) => {
            state.contact = '';
        })

    }
});

export const { setContact, setErrors, setIsLoading } = ForgotPasswordSlice.actions;

export default ForgotPasswordSlice.reducer;