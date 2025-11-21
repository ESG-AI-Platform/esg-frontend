"use client";

import { useMemo } from "react";

import Image from "next/image";

import { userImage } from "@/shared/assets/images";
import { Card } from "@/shared/components/Card";
import { useAuth } from "@/shared/hooks/useAuth";
import type { User } from "@/shared/types";

export const UserProfile = () => {
    const { user, isAuthenticated } = useAuth();

    const profile = useMemo<User | null>(() => {
        if (!user) {
            return null;
        }

        if (typeof (user as { user?: User }).user !== "undefined") {
            return (user as { user?: User }).user ?? null;
        }

        return user;
    }, [user]);

    if (!isAuthenticated) {
        return null;
    }

    if (!profile) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <div className="p-6 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                    <p className="mt-3 text-sm text-slate-600">Loading profile...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto border border-slate-200 shadow-sm">
            <div className="p-6">
                <div className="text-center">
                    <Image
                        src={userImage}
                        alt={profile.name || "User"}
                        width={96}
                        height={96}
                        className="mx-auto mb-4 h-24 w-24 rounded-full border border-slate-200 object-cover"
                    />
                    <h2 className="text-2xl font-semibold text-slate-900">{profile.name || "Unknown name"}</h2>
                    <p className="mt-1 text-sm text-slate-600">{profile.email || "Not provided"}</p>
                </div>

                <dl className="mt-6 space-y-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                        <dt className="font-medium">User ID</dt>
                        <dd className="font-mono text-slate-900">{profile.id || "-"}</dd>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                        <dt className="font-medium">Status</dt>
                        <dd className="text-emerald-600">Active</dd>
                    </div>
                </dl>

                <p className="mt-6 rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-700">
                    Your access is protected with enterprise-grade security controls.
                </p>
            </div>
        </Card>
    );
};
