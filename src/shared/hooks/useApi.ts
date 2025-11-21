"use client";

import { useCallback, useState } from "react";

import { apiClient } from "@/shared/lib/api-client";

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiActions<T> {
  execute: (url: string, options?: RequestInit) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = unknown>(): UseApiState<T> & UseApiActions<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (url: string, options?: RequestInit): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (options?.method === "POST") {
          response = await apiClient.post<T>(
            url,
            options.body ? JSON.parse(options.body as string) : undefined,
          );
        } else if (options?.method === "PUT") {
          response = await apiClient.put<T>(
            url,
            options.body ? JSON.parse(options.body as string) : undefined,
          );
        } else if (options?.method === "DELETE") {
          response = await apiClient.delete<T>(url);
        } else {
          response = await apiClient.get<T>(url);
        }

        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
