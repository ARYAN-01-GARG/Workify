export interface UserState {
  userData: {
    id: number | null;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string | null;
    status: string | null;
    membership: boolean;
    role: string;
    enabled: boolean;
    authorities: { authority: string }[];
  };
  token: string | null;
  isAuthenticated: boolean;
}