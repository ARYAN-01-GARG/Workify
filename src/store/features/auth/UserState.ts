export interface UserState {
    userData :{
        firstName:string;
        lastName:string;
        contact: string;
        emailVerified: boolean;
        role : string;
    },
    token : string | null,
    isAuthenticated: boolean
}