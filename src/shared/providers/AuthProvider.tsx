"use client";

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { AuthenticationError, errorHandler } from "@/shared/lib/error-handling";
import { notifyError } from "@/shared/lib/notify-error";
import { AUTH_SESSION_EVENT, storage, type AuthSessionEventDetail } from "@/shared/lib/storage";
import { authService } from "@/shared/services/auth-service";
import type { LoginCredentials, RegisterData, User } from "@/shared/types";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated" | "authenticating";

export interface AuthActionOptions {
    redirectTo?: string;
    replace?: boolean;
}

interface AuthState {
    user: User | null;
    status: AuthStatus;
    error: string | null;
}

export interface AuthContextValue {
    user: User | null;
    error: string | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    isLoading: boolean;
    isAuthenticating: boolean;
    login: (credentials: LoginCredentials, options?: AuthActionOptions) => Promise<User>;
    logout: (options?: AuthActionOptions) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    refresh: () => Promise<User | null>;
    clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const SESSION_EXPIRED_MESSAGE = "Session expired. Please sign in again.";
const DEFAULT_REDIRECT_PATH = "/";

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();

    const [state, setState] = useState<AuthState>({
        user: null,
        status: "unauthenticated",
        error: null,
    });

    const hasBootstrapped = useRef(false);

    const sanitizeRedirectPath = useCallback((target?: string | null): string => {
        if (!target) {
            return DEFAULT_REDIRECT_PATH;
        }

        const trimmed = target.trim();

        if (!trimmed) {
            return DEFAULT_REDIRECT_PATH;
        }

        if (!trimmed.startsWith("/")) {
            return DEFAULT_REDIRECT_PATH;
        }

        if (trimmed.startsWith("//")) {
            return DEFAULT_REDIRECT_PATH;
        }

        const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";

        try {
            const url = new URL(trimmed, base);
            const normalizedPath = `${url.pathname}${url.search}${url.hash}`;

            if (["/not-found", "/404", "/_error"].includes(url.pathname)) {
                return DEFAULT_REDIRECT_PATH;
            }

            if (normalizedPath.includes("..")) {
                return DEFAULT_REDIRECT_PATH;
            }

            return normalizedPath || DEFAULT_REDIRECT_PATH;
        } catch (error) {
            return DEFAULT_REDIRECT_PATH;
        }
    }, []);

    const navigate = useCallback(
        (target?: string | null, replace?: boolean) => {
            const destination = sanitizeRedirectPath(target);

            try {
                const nextPath = destination as Parameters<typeof router.push>[0];
                if (replace) {
                    router.replace(nextPath);
                } else {
                    router.push(nextPath);
                }
            } catch (navigationError) {
                notifyError(navigationError, {
                    context: "auth/navigate",
                    userMessage: "Navigation failed. Please try again.",
                });
            }
        },
        [router, sanitizeRedirectPath],
    );

    const syncCurrentUser = useCallback(async () => {
        try {
            const response = await authService.getCurrentUser();
            const currentUser = response.data;
            storage.setUser(currentUser);
            setState({
                user: currentUser,
                status: "authenticated",
                error: null,
            });
            return currentUser;
        } catch (error) {
            if (error instanceof AuthenticationError) {
                storage.clearAuth("expired");
                setState({ user: null, status: "unauthenticated", error: SESSION_EXPIRED_MESSAGE });
                return null;
            }

            const appError = notifyError(error, {
                context: "auth/refresh",
                userMessage: "Unable to restore your session.",
            });
            setState(prev => ({
                ...prev,
                user: null,
                status: "unauthenticated",
                error: errorHandler.getUserMessage(appError),
            }));
            return null;
        }
    }, []);

    useEffect(() => {
        if (hasBootstrapped.current) {
            return;
        }
        hasBootstrapped.current = true;

        let cancelled = false;

        const bootstrap = async () => {
            const accessToken = storage.getToken();
            const refreshToken = storage.getRefreshToken();
            const storedUser = storage.getUser<User>();

            if (!accessToken && !refreshToken) {
                if (!cancelled) {
                    setState(prev => ({ ...prev, user: null, status: "unauthenticated", error: null }));
                }
                return;
            }

            if (storedUser && !cancelled) {
                setState(prev => ({ ...prev, user: storedUser, status: "authenticated", error: null }));
            } else if (!cancelled) {
                setState(prev => ({ ...prev, status: "checking" }));
            }

            try {
                const response = await authService.getCurrentUser();
                if (cancelled) {
                    return;
                }

                const currentUser = response.data;
                storage.setUser(currentUser);
                setState({ user: currentUser, status: "authenticated", error: null });
            } catch (error) {
                if (cancelled) {
                    return;
                }

                if (error instanceof AuthenticationError) {
                    storage.clearAuth("expired");
                    setState({ user: null, status: "unauthenticated", error: SESSION_EXPIRED_MESSAGE });
                    return;
                }

                const appError = notifyError(error, {
                    context: "auth/bootstrap",
                    showToast: false,
                });
                setState({
                    user: null,
                    status: "unauthenticated",
                    error: errorHandler.getUserMessage(appError),
                });
            }
        };

        void bootstrap();

        return () => {
            cancelled = true;
            hasBootstrapped.current = false;
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const handleSessionEvent = (event: Event) => {
            const customEvent = event as CustomEvent<AuthSessionEventDetail>;
            const detail = customEvent.detail;
            if (!detail) {
                return;
            }

            if (detail.type === "SESSION_CLEARED") {
                const isExpired =
                    detail.reason === "expired" || detail.reason === "refresh-failed";
                setState({
                    user: null,
                    status: "unauthenticated",
                    error: isExpired ? SESSION_EXPIRED_MESSAGE : null,
                });
                if (isExpired) {
                    toast.warning(SESSION_EXPIRED_MESSAGE);
                }
            }
        };

        window.addEventListener(AUTH_SESSION_EVENT, handleSessionEvent);
        return () => {
            window.removeEventListener(AUTH_SESSION_EVENT, handleSessionEvent);
        };
    }, []);

    const login = useCallback<
        AuthContextValue["login"]
    >(async (credentials, options) => {
        setState(prev => ({ ...prev, status: "authenticating", error: null }));

        try {
            const session = await authService.login(credentials);
            const authenticatedUser = session.data.user;
            storage.setUser(authenticatedUser);
            setState({ user: authenticatedUser, status: "authenticated", error: null });
            navigate(options?.redirectTo, options?.replace);
            return authenticatedUser;
        } catch (error) {
            const appError = notifyError(error, {
                context: "auth/login",
                userMessage: "Sign-in failed. Please check your credentials.",
            });
            setState({
                user: null,
                status: "unauthenticated",
                error: errorHandler.getUserMessage(appError),
            });
            throw appError;
        }
    }, [navigate]);

    const logout = useCallback<
        AuthContextValue["logout"]
    >(async (options) => {
        setState(prev => ({ ...prev, status: "authenticating", error: null }));

        try {
            await authService.logout();
        } catch (error) {
            notifyError(error, {
                context: "auth/logout",
                userMessage: "Sign-out encountered an issue, but you have been logged out.",
            });
        } finally {
            storage.clearAuth("logout");
            setState({ user: null, status: "unauthenticated", error: null });
            navigate(options?.redirectTo, options?.replace);
        }
    }, [navigate]);

    const register = useCallback<
        AuthContextValue["register"]
    >(async (data) => {
        setState(prev => ({ ...prev, status: "authenticating", error: null }));
        try {
            await authService.register(data);
            setState(prev => ({ ...prev, status: "unauthenticated", error: null }));
        } catch (error) {
            const appError = notifyError(error, {
                context: "auth/register",
                userMessage: "Registration failed. Please try again.",
            });
            setState(prev => ({
                ...prev,
                status: "unauthenticated",
                error: errorHandler.getUserMessage(appError),
            }));
            throw appError;
        }
    }, []);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    const refresh = useCallback<
        AuthContextValue["refresh"]
    >(async () => {
        return await syncCurrentUser();
    }, [syncCurrentUser]);

    const contextValue = useMemo<AuthContextValue>(() => ({
        user: state.user,
        error: state.error,
        status: state.status,
        isAuthenticated: state.status === "authenticated",
        isLoading: state.status === "checking",
        isAuthenticating: state.status === "authenticating",
        login,
        logout,
        register,
        refresh,
        clearError,
    }), [state, login, logout, register, refresh, clearError]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
