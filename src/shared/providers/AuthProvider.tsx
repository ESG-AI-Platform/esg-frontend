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

import { AppError, AuthenticationError, errorHandler } from "@/shared/lib/error-handling";
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

    const initialUser =
        typeof window !== "undefined" ? storage.getUser<User>() : null;

    const hasStoredTokens =
        typeof window !== "undefined" && (storage.getToken() || storage.getRefreshToken());

    const [state, setState] = useState<AuthState>({
        user: initialUser,
        status: hasStoredTokens ? "checking" : initialUser ? "authenticated" : "unauthenticated",
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
                console.error("Auth navigation failed", navigationError);
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

            const appError =
                error instanceof AppError ? error : errorHandler.handleApiError(error, "auth/refresh");
            errorHandler.logError(appError, { scope: "auth-sync" });
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

            if (!accessToken && !refreshToken) {
                if (!cancelled) {
                    setState(prev => ({ ...prev, user: null, status: "unauthenticated", error: null }));
                }
                return;
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

                const appError =
                    error instanceof AppError ? error : errorHandler.handleApiError(error, "auth/bootstrap");
                errorHandler.logError(appError, { scope: "auth-bootstrap" });
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
                setState({
                    user: null,
                    status: "unauthenticated",
                    error:
                        detail.reason === "expired" || detail.reason === "refresh-failed"
                            ? SESSION_EXPIRED_MESSAGE
                            : null,
                });
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
            const appError =
                error instanceof AppError ? error : errorHandler.handleApiError(error, "auth/login");
            errorHandler.logError(appError, { scope: "auth-login" });
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
            const appError =
                error instanceof AppError ? error : errorHandler.handleApiError(error, "auth/logout");
            errorHandler.logError(appError, { scope: "auth-logout" });
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
            const appError =
                error instanceof AppError ? error : errorHandler.handleApiError(error, "auth/register");
            errorHandler.logError(appError, { scope: "auth-register" });
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
