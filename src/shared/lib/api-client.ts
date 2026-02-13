import { API_CONFIG_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_MINUTES } from "../constants/auth";
import { ApiResponse } from "../types/api";

import { AppError, AuthenticationError, NetworkError } from "./error-handling";
import { notifyError } from "./notify-error";
import { storage } from "./storage";

export class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseURL: string = API_CONFIG_BASE_URL) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return await this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
    return await this.request<T>(endpoint, {
      method: "POST",
      body: body,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
    return await this.request<T>(endpoint, {
      method: "PUT",
      body: body,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return await this.request<T>(endpoint, { method: "DELETE" });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuthRetry = false,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const isRefreshRequest = endpoint === API_ENDPOINTS.AUTH.REFRESH;

    const defaultHeaders: Record<string, string> = {};
    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const providedHeaders: Record<string, string> = options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : Array.isArray(options.headers)
        ? Object.fromEntries(options.headers)
        : (options.headers as Record<string, string> | undefined) ?? {};

    let accessToken = storage.getToken();

    if (!accessToken && !isRefreshRequest && storage.getRefreshToken()) {
      const refreshed = await this.handleTokenRefresh();
      if (refreshed) {
        accessToken = storage.getToken();
      }
    }

    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...providedHeaders,
    };

    if (accessToken && !isRefreshRequest) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (error) {
      throw new NetworkError(
        error instanceof Error ? error.message : "Network error",
        endpoint,
      );
    }

    let parsedPayload: unknown = null;
    let rawPayload = "";

    try {
      rawPayload = await response.text();
      if (rawPayload) {
        parsedPayload = JSON.parse(rawPayload);
      }
    } catch (error) {
      parsedPayload = rawPayload;
    }

    if (!response.ok) {
      if (!skipAuthRetry && !isRefreshRequest && response.status === 401) {
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          return await this.request<T>(endpoint, options, true);
        }

        storage.clearAuth("refresh-failed");

        const message = typeof parsedPayload === "object" && parsedPayload !== null
          ? (parsedPayload as Record<string, unknown>).message as string | undefined
          : undefined;

        throw new AuthenticationError(
          message || "Session expired. Please sign in again.",
          endpoint,
        );
      }

      const payloadObject = typeof parsedPayload === "object" && parsedPayload !== null
        ? parsedPayload as Record<string, unknown>
        : undefined;

      const message =
        typeof parsedPayload === "string"
          ? parsedPayload
          : (payloadObject?.message as string | undefined);

      const code = payloadObject?.code as string | undefined;

      throw new AppError(
        message || `HTTP error! status: ${response.status}`,
        response.status,
        code,
        endpoint,
      );
    }

    if (!rawPayload) {
      return {
        data: undefined as T,
        message: undefined,
        pagination: undefined,
        success: true,
      };
    }

    if (typeof parsedPayload === "string") {
      return {
        data: parsedPayload as unknown as T,
        message: undefined,
        pagination: undefined,
        success: true,
      };
    }

    const payloadObject = (parsedPayload ?? {}) as Record<string, unknown>;
    const hasDataProperty = Object.prototype.hasOwnProperty.call(payloadObject, "data");
    const resultData = (hasDataProperty ? payloadObject.data : payloadObject) as T;
    const pagination = payloadObject.pagination as ApiResponse<T>["pagination"];
    const message = payloadObject.message as string | undefined;
    const success = typeof payloadObject.success === "boolean" ? payloadObject.success : true;

    return {
      data: resultData,
      message,
      pagination,
      success,
    };
  }

  private async handleTokenRefresh(): Promise<boolean> {
    if (this.isRefreshing) {
      await this.refreshPromise;
      return !!storage.getToken();
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      return !!newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    const refreshToken = storage.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const rawPayload = await response.text();
      const parsedPayload = rawPayload ? JSON.parse(rawPayload) : null;

      if (!response.ok) {
        storage.clearAuth("refresh-failed");
        return null;
      }

      const tokens = parsedPayload?.data?.tokens;

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        storage.clearAuth("refresh-failed");
        return null;
      }

      storage.setToken(tokens.accessToken, ACCESS_TOKEN_TTL_MINUTES);
      storage.setRefreshToken(tokens.refreshToken, REFRESH_TOKEN_TTL_MINUTES);

      return tokens.accessToken as string;
    } catch (error) {
      notifyError(error, { context: "auth/token-refresh", showToast: false });
      storage.clearAuth("refresh-failed");
      return null;
    }
  }
}

export const apiClient = new ApiClient();
