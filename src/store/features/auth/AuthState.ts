export interface AuthState {
    isLoading: boolean;
    errors: {
        nameError: string;
        contactError: string;
        passwordError: string;
    };
    name: string;
    contact: string;
    password: string;
    showPassword: boolean;
}


