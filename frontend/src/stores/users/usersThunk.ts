import { create } from 'zustand';
import axios from 'axios';
import {axiosApi} from "@/globalConstants";
export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    token: string;
}

interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
}

interface UserResponse {
    user: User;
}

interface ErrorResponse {
    error: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;

    register: (data: RegisterData) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const userThunk = create<AuthState>((set) => ({
    user: null,
    loading: false,
    error: null,

    register: async (data: RegisterData) => {
        set({ loading: true, error: null });
        try {
            const { data: result } = await axiosApi.post<UserResponse>(`/user/register`, data);
            set({ user: result.user, loading: false });
            localStorage.setItem('token', result.user?.token ?? '');
        } catch (err) {
            let message = 'Unknown error';

            if (axios.isAxiosError(err)) {
                const responseData = err.response?.data as ErrorResponse | undefined;
                message = responseData?.error || err.message;
            } else if (err instanceof Error) {
                message = err.message;
            }

            set({ error: message, loading: false });
        }
    },

    login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
            const { data: result } = await axiosApi.post<UserResponse>(`/user/login`, { email, password });
            set({ user: result.user, loading: false });
            localStorage.setItem('token', result.user?.token ?? '');
        } catch (err) {
            let message = 'Unknown error';

            if (axios.isAxiosError(err)) {
                const responseData = err.response?.data as ErrorResponse | undefined;
                message = responseData?.error || err.message;
            } else if (err instanceof Error) {
                message = err.message;
            }

            set({ error: message, loading: false });
        }
    },

    logout: () => {
        set({ user: null });
        localStorage.removeItem('token');
    },
}));
