"use client";

import { useEffect } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { useAuth } from "@/shared/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = "/auth",
}) => {
  const { isAuthenticated, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsSignature = searchParams.toString();

  const isVerifying = status === "checking" || status === "authenticating";
  const isAlreadyAtRedirect = pathname === redirectTo;

  useEffect(() => {
    if (isVerifying || isAuthenticated || isAlreadyAtRedirect) {
      return;
    }

    const redirectPath = searchParamsSignature
      ? `${pathname}?${searchParamsSignature}`
      : pathname;

    const params = new URLSearchParams();
    params.set("redirect", redirectPath);

    router.replace(`${redirectTo}?${params.toString()}` as Parameters<typeof router.replace>[0]);
  }, [
    isAuthenticated,
    isVerifying,
    isAlreadyAtRedirect,
    pathname,
    redirectTo,
    router,
    searchParamsSignature,
  ]);

  // Show loading while checking auth
  if (isVerifying) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};
