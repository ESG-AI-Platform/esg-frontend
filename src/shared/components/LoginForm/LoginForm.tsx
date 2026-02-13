"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/shared/components/Button";
import { useAuth } from "@/shared/hooks/useAuth";
import type { User } from "@/shared/types";

interface LoginFormProps {
    redirectTo?: string;
    onSuccess?: (user: User) => void;
}

interface LoginFormState {
    email: string;
    password: string;
}

type FormErrors = Partial<Record<keyof LoginFormState, string>>;

export const LoginForm = ({ redirectTo, onSuccess }: LoginFormProps) => {
    const { login, isAuthenticating, clearError } = useAuth();

    const [formData, setFormData] = useState<LoginFormState>({
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const validate = useCallback(() => {
        const nextErrors: FormErrors = {};

        if (!formData.email.trim()) {
            nextErrors.email = "Please enter your email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
            nextErrors.email = "Please enter a valid email.";
        }

        if (!formData.password.trim()) {
            nextErrors.password = "Please enter your password.";
        }

        setFormErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [formData.email, formData.password]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        clearError();

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (formErrors[name as keyof LoginFormState]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearError();

        if (!validate()) {
            return;
        }

        try {
            const user = await login(formData, redirectTo ? { redirectTo, replace: true } : undefined);
            setFormData({ email: "", password: "" });
            onSuccess?.(user);
        } catch (caughtError) {
            // Error is handled by AuthProvider via notifyError + toast
        }
    };

    const passwordInputType = useMemo(() => (showPassword ? "text" : "password"), [showPassword]);

    return (
        <div className="w-full max-w-md mx-auto rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-lg backdrop-blur">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-slate-900">Sign in</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Enter your email and password to access your ESG workspace.
                </p>
            </div>

            <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={formErrors.email ? "true" : "false"}
                        aria-describedby={formErrors.email ? "email-error" : undefined}
                        className={`w-full rounded-lg border px-3 py-2 text-sm transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? "border-red-400" : "border-slate-300"}`}
                        placeholder="name@example.com"
                        disabled={isAuthenticating}
                    />
                    {formErrors.email && (
                        <p id="email-error" className="mt-2 text-xs text-red-600">
                            {formErrors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <div className={`relative rounded-lg border ${formErrors.password ? "border-red-400" : "border-slate-300"}`}>
                        <input
                            id="password"
                            name="password"
                            type={passwordInputType}
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            aria-invalid={formErrors.password ? "true" : "false"}
                            aria-describedby={formErrors.password ? "password-error" : undefined}
                            className="h-11 w-full rounded-lg border-none px-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            disabled={isAuthenticating}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {formErrors.password && (
                        <p id="password-error" className="mt-2 text-xs text-red-600">
                            {formErrors.password}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full"
                >
                    {isAuthenticating ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Verifying credentials...
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </Button>

                <p className="text-xs text-slate-500">
                    Need help? Contact your administrator for access support.
                </p>
            </form>
        </div>
    );
};
