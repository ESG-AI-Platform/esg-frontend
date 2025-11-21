"use client";

import { useMemo, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/shared/components/Button";
import { useAuth } from "@/shared/hooks/useAuth";

export function NavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout, isAuthenticating } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userInitials = useMemo(() => {
        const source = user?.name || user?.email || "";
        if (!source) {
            return "";
        }

        return source
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part[0]?.toUpperCase())
            .join("");
    }, [user?.email, user?.name]);

    const navLinks = [
        { href: "/" as const, label: "Home" },
        { href: "/esg-report" as const, label: "ESG Reports" },
        { href: "/esg-analyzer" as const, label: "ESG Analyzer" },
    ];

    const isActive = (path: string) => pathname === path;

    const handleLogout = async () => {
        await logout({ redirectTo: "/auth", replace: true });
    };

    const handleLoginNavigation = () => {
        setIsMobileMenuOpen(false);
        router.push("/auth" as Parameters<typeof router.push>[0]);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <span className="text-lg font-bold">E</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">ESG Platform</span>
                        </Link>
                    </div>

                    <div className="hidden items-center gap-8 md:flex">
                        <div className="flex items-center gap-2">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive(link.href)
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                                            {userInitials || "U"}
                                        </span>
                                        <span className="hidden md:inline">{user?.name || user?.email || "User"}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                        disabled={isAuthenticating}
                                    >
                                        {isAuthenticating ? "Signing out..." : "Sign out"}
                                    </Button>
                                </>
                            ) : (
                                <Button size="sm" onClick={handleLoginNavigation}>
                                    Sign in
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                            className="text-slate-700 transition-colors hover:text-blue-600"
                            aria-label="Toggle navigation menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="space-y-1 pb-3 pt-2 md:hidden">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${isActive(link.href)
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-slate-200 pt-3">
                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setIsMobileMenuOpen(false);
                                        await handleLogout();
                                    }}
                                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                                    disabled={isAuthenticating}
                                >
                                    {isAuthenticating ? "Signing out..." : "Sign out"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleLoginNavigation}
                                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
