export interface ApiUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  image: string;
  gender: string;
  birthDate?: string;
  address?: { address: string };
  company?: { address?: { address: string } };
}

export interface UserData extends ApiUserData {
  name: string;
  avatar: string;
  dob: string;
  companyAddress: string;
  homeAddress: string;
}

export interface AuthState {
  userData: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginLoading: boolean;
  loginError: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  [key: string]: unknown;
}
