import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { AuthState } from './AuthState';
import { toast } from 'react-hot-toast';

const NAME_REGEX = /^[a-zA-Z][a-zA-Z ]{3,22}$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const initialState: AuthState = {
    isLoading: false,
    errors: {
        nameError: '',
        contactError: '',
        passwordError: ''
    },
    name: '',
    contact: '',
    password: '',
    showPassword: false,
}

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ name, contact, password }: { name: string, contact: string, password: string }, { rejectWithValue, dispatch }) => {
        const isContactValid = EMAIL_REGEX.test(contact) || PHONE_REGEX.test(contact);
        const isPasswordValid = PASSWORD_REGEX.test(password);
        if (!NAME_REGEX.test(name) || !isContactValid || !isPasswordValid) {
            return rejectWithValue({
                nameError: (name.length < 3) && /[a-zA-Z]/.test(name) ? 'Name is invalid must be between 2 to 22 characters' : !name ? 'Name is required!' : (!NAME_REGEX.test(name)) ? 'Name is invalid!' : '',
                contactError: (!isContactValid) ? /^[0-9]{10}$/.test(contact) ? 'Phone number is invalid!' : !contact ? 'Email or Phone Number is required!' : 'Email is invalid!' : '',
                passwordError: (!isPasswordValid) ? !password ? 'Password is required!' : 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character' : ''
            });
        } else if (NAME_REGEX.test(name) && isContactValid && isPasswordValid) {
            dispatch(setErrors({
                nameError: '',
                contactError: '',
                passwordError: ''
            }));
        }
        toast.loading('Sending OTP...');
        try {
            const response = await axios.post('https://workify-springboot-1-3aou.onrender.com/api/v1/auth/register', {
                firstName: name.split(' ')[0],
                lastName: name.split(' ')[1] || name.split(' ')[0],
                email: EMAIL_REGEX.test(contact) ? contact.toLowerCase() : null,
                mobile: PHONE_REGEX.test(contact) ? `+91${contact}` : null,
                password: password
            });
            toast.dismiss();
            toast.success('OTP sent successfully!');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Registration failed');
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ contact, password }: { contact: string, password: string }, { rejectWithValue, dispatch }) => {
        const isContactValid = EMAIL_REGEX.test(contact) || PHONE_REGEX.test(contact);
        if (!isContactValid || password.length < 8) {
            return rejectWithValue({
                ...initialState.errors,
                contactError: (!isContactValid) ? /^[0-9]{0,10}$/.test(contact) ? 'Phone number is invalid!' : !contact ? 'Email or Phone Number is required!' : 'Email is invalid!' : '',
                passwordError: (password.length < 8) ? !password ? 'Password is required!' : 'Password must be at least 8 characters' : ''
            });
        } else if (isContactValid && password.length >= 8) {
            dispatch(setErrors({
                ...initialState.errors,
                contactError: '',
                passwordError: ''
            }));
        }
        dispatch(setIsLoading(true));
        toast.loading('Please wait...');
        try {
            const response = await axios.post('https://naitikjain.me/api/v1/auth/authenticate', {
                contact: contact.toLowerCase(),
                password
            });
            toast.dismiss();
            toast.success('Login Successfull!');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.dismiss();
            console.log(error.response?.data?.message);
            toast.error((error.response?.data?.message === 'User does not exist') ? /^[0-9]{10}$/.test(contact) ? 'Phone number is not registered!' : 'Email is not registered!' : 'Incorrect password');
            dispatch(setErrors({
                ...initialState.errors,
                contactError: (error.response?.data?.message === 'User does not exist') ? /^[0-9]{10}$/.test(contact) ? 'Phone number is not registered!' : 'Email is not registered!' : '',
                passwordError: (error.response?.data?.message === 'Incorrect password') ? 'Invalid Password!' : ''
            }))
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        } finally{
            dispatch(setIsLoading(false));
        }
    }
);

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoading(state, action){
            state.isLoading = action.payload;
        },
        setErrors(state, action){
            state.errors = action.payload;
        },
        setName(state, action){
            state.name = action.payload;
        },
        setContact(state, action){
            state.contact = action.payload;
        },
        setPassword(state, action){
            state.password = action.payload;
        },
        setShowPassword(state, action){
            state.showPassword = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.showPassword = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.showPassword = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.showPassword = false;
                state.errors = action.payload as {
                    nameError: string;
                    contactError: string;
                    passwordError: string;
                };
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload as {
                    nameError: string;
                    contactError: string;
                    passwordError: string;
                };
            });
    }
});

export const { setIsLoading, setErrors, setName, setContact, setPassword, setShowPassword } = AuthSlice.actions;

export default AuthSlice.reducer;