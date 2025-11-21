import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "@/shared/providers/AuthProvider";

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};

export type { AuthContextValue as UseAuth } from "@/shared/providers/AuthProvider";
