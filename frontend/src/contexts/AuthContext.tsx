
import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

import * as authApi from "../api/auth";
import type { User, LoginRequest, RegisterRequest } from "../types/auth";
import { useEffect } from "react";
import axios from "axios";

type AuthContextType = {
    user: User | null;

    loading: boolean;

    isInitializing: boolean;

    login: (data: LoginRequest) => Promise<void>;

    register: (data: RegisterRequest) => Promise<void>;

    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {

    const [user, setUser] = useState<User | null>(null);

    const [isInitializing, setIsInitializing] = useState(true);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        async function initialiseAuth() {

            try {

                const response = await authApi.getCurrentUser();

                setUser(response.data);
            }
            catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {

                    // Expected.
                    // User simply isn't logged in.
                    setUser(null);

                } else {

                    console.error(error);

                }
            } finally {

                setIsInitializing(false);
            }
        }

        initialiseAuth();
    }, []);

    async function register(data: RegisterRequest) {

        setLoading(true);

        try {

            const response = await authApi.register(data);


            setUser(response.data);

        } finally {

            setLoading(false);

        }
    }

    async function login(data: LoginRequest) {

        setLoading(true);

        try {

            const response = await authApi.login(data);

            setUser(response.data);

        } finally {

            setLoading(false);

        }
    }

    async function logout() {

        setLoading(true);

        try {

            await authApi.logout();

            setUser(null);

        }
        catch(error) {
            console.error(error);
        }
         finally {

            setLoading(false);

        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isInitializing,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuthContext must be used inside AuthProvider"
        );

    }

    return context;
}