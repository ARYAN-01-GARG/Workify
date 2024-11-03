export interface UserState {
    userData :{
        firstName:string;
        lastName:string;
        contact: string;
        emailVerified: boolean;
    },
    token : string | null,
    isAuthenticated: boolean
}