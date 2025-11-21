import { API_ENDPOINTS } from "@/shared/constants/api";
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_MINUTES } from "@/shared/constants/auth";
import { apiClient } from "@/shared/lib/api-client";
import { storage } from "@/shared/lib/storage";
import { AuthResponse, LoginCredentials, RegisterData, User } from "@/shared/types";

// Authentication Services
export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

    if (!response.success) {
      throw new Error(response.message || "Login failed");
    }

    const { tokens, user } = response.data;

    storage.setToken(tokens.accessToken, ACCESS_TOKEN_TTL_MINUTES);
    storage.setRefreshToken(tokens.refreshToken, REFRESH_TOKEN_TTL_MINUTES);
    storage.setUser(user);

    return response;
  },

  async register(regis: RegisterData) {
    if (regis.password !== regis.confirmPassword) {
      throw new Error("Password confirmation does not match");
    }

    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, regis);

    if (!response.success) {
      throw new Error(response.message || "Registration failed");
    }

    return response;
  },

  async logout() {
    const response = await apiClient.post<{ success: boolean; message?: string }>(
      API_ENDPOINTS.AUTH.LOGOUT,
    );

    return response;
  },

  async getCurrentUser() {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch current user");
    }

    return response;
  },
};
