import { toast } from "sonner";

import { telemetry } from "@/shared/services/telemetry";

import { AppError, errorHandler } from "./error-handling";

export interface NotifyErrorOptions {
    userMessage?: string;
    context?: string;
    meta?: Record<string, unknown>;
    showToast?: boolean;
}

export function notifyError(
    error: unknown,
    options: NotifyErrorOptions = {},
): AppError {
    const { context, meta, showToast = true } = options;

    const appError =
        error instanceof AppError
            ? error
            : errorHandler.handleApiError(error, context);

    errorHandler.logError(appError, { scope: context, ...meta });

    telemetry.trackError(appError, { context, ...meta });

    if (showToast) {
        const message =
            options.userMessage ?? errorHandler.getUserMessage(appError);
        toast.error(message);
    }

    return appError;
}
