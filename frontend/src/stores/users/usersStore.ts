import {create} from 'zustand';
import axios from 'axios';
import {axiosApi} from "@/globalConstants";
import {createJSONStorage, persist} from 'zustand/middleware';

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    token: string;
    role?: string;
}

interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: string;
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

export const usersStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,

            async register(data) {
                set({loading: true, error: null});
                try {
                    const {data: result} = await axiosApi.post<UserResponse>('/user/register', data);
                    set({user: result.user, loading: false});
                } catch (err) {
                    set({error: parseErr(err), loading: false});
                }
            },

            async login(email, password) {
                set({loading: true, error: null});
                try {
                    const {data: result} = await axiosApi.post<UserResponse>('/user/login', {email, password});
                    localStorage.setItem('token', result.user.token);
                    set({user: result.user, loading: false});
                } catch (err) {
                    set({error: parseErr(err), loading: false});
                }
            },

            logout() {
                localStorage.removeItem('token');
                set({user: null});
            },
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({user: state.user}),
        },
    ),
);

function parseErr(err: unknown): string {
    if (axios.isAxiosError(err)) {
        return (err.response?.data as ErrorResponse | undefined)?.error || err.message;
    }
    return err instanceof Error ? err.message : 'Unknown error';
}
