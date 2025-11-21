"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { LoginForm } from "@/shared/components/LoginForm";
import { useAuth } from "@/shared/hooks/useAuth";

const DEFAULT_REDIRECT_PATH = "/";

const sanitizeRedirectPath = (rawValue: string | null): string | null => {
    if (!rawValue) {
        return null;
    }

    const trimmed = rawValue.trim();

    if (!trimmed) {
        return null;
    }

    if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
        return null;
    }

    const disallowedPaths = new Set(["/not-found", "/404", "/_error"]);
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";

    try {
        const url = new URL(trimmed, base);
        if (disallowedPaths.has(url.pathname) || url.pathname.includes("..")) {
            return null;
        }
        return `${url.pathname}${url.search}${url.hash}`;
    } catch (error) {
        return null;
    }
};

export default function AuthPage() {
    const { isAuthenticated, isLoading, isAuthenticating } = useAuth();

    const router = useRouter();
    const searchParams = useSearchParams();

    const [redirectTarget, setRedirectTarget] = useState<string>(DEFAULT_REDIRECT_PATH);
    const [hasExplicitRedirect, setHasExplicitRedirect] = useState(false);

    const searchParamsSignature = useMemo(() => searchParams.toString(), [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams(searchParamsSignature);
        const redirect = params.get("redirect");
        const sanitizedRedirect = sanitizeRedirectPath(redirect);

        setHasExplicitRedirect(Boolean(redirect) && Boolean(sanitizedRedirect));
        setRedirectTarget(sanitizedRedirect ?? DEFAULT_REDIRECT_PATH);
    }, [searchParamsSignature]);

    useEffect(() => {
        if (isLoading || isAuthenticating || !isAuthenticated) {
            return;
        }

        const destination = hasExplicitRedirect ? redirectTarget : DEFAULT_REDIRECT_PATH;
        router.replace(destination as Parameters<typeof router.replace>[0]);
    }, [hasExplicitRedirect, isAuthenticated, isAuthenticating, isLoading, redirectTarget, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-start justify-center px-4 pt-8 pb-12">
            <LoginForm redirectTo={hasExplicitRedirect ? redirectTarget : undefined} />
        </div>
    );
}
