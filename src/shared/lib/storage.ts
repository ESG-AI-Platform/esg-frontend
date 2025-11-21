const STORAGE_KEYS = {
  accessToken: "auth.accessToken",
  refreshToken: "auth.refreshToken",
  user: "auth.user",
  legacyAccessToken: "token",
  legacyAccessExpiry: "tokenExpiry",
  legacyRefreshToken: "refreshToken",
  legacyRefreshExpiry: "refreshTokenExpiry",
} as const;

type TokenRecord = {
  token: string;
  expiresAt?: number | null;
};

export type AuthSessionClearReason = "logout" | "expired" | "refresh-failed" | "manual";

export type AuthSessionEventDetail =
  | {
    type: "TOKEN_UPDATED";
    tokenType: "access" | "refresh";
    expiresAt?: number | null;
  }
  | {
    type: "SESSION_CLEARED";
    reason?: AuthSessionClearReason;
  };

export const AUTH_SESSION_EVENT = "auth:session-change";

const minutesToMilliseconds = (minutes: number): number => minutes * 60 * 1000;

const broadcastAuthEvent = (detail: AuthSessionEventDetail): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent<AuthSessionEventDetail>(AUTH_SESSION_EVENT, { detail }));
};

const parseTokenRecord = (value: string | null): TokenRecord | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as TokenRecord;
    if (typeof parsed === "object" && typeof parsed?.token === "string") {
      return {
        token: parsed.token,
        expiresAt:
          typeof parsed.expiresAt === "number"
            ? parsed.expiresAt
            : parsed.expiresAt
              ? Number(parsed.expiresAt)
              : null,
      };
    }
  } catch (error) {
    // Fall back to treating the raw string as the token value
    return { token: value, expiresAt: null };
  }

  return null;
};

const readTokenRecord = (
  key: string,
  legacyKey: string,
  legacyExpiryKey: string,
): TokenRecord | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = parseTokenRecord(localStorage.getItem(key));
  if (stored?.token) {
    if (stored.expiresAt && stored.expiresAt <= Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return stored;
  }

  const legacyToken = localStorage.getItem(legacyKey);
  if (!legacyToken) {
    return null;
  }

  const legacyExpiry = localStorage.getItem(legacyExpiryKey);
  if (legacyExpiry) {
    const expiryTime = Number(legacyExpiry);
    if (Number.isFinite(expiryTime) && expiryTime <= Date.now()) {
      localStorage.removeItem(legacyKey);
      localStorage.removeItem(legacyExpiryKey);
      return null;
    }

    return {
      token: legacyToken,
      expiresAt: Number.isFinite(expiryTime) ? expiryTime : null,
    };
  }

  return { token: legacyToken, expiresAt: null };
};

const writeToken = (
  key: string,
  token: string,
  ttlMinutes: number | undefined,
  tokenType: "access" | "refresh",
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const expiresAt = typeof ttlMinutes === "number"
    ? Date.now() + minutesToMilliseconds(Math.max(ttlMinutes, 0))
    : null;

  const record: TokenRecord = {
    token,
    expiresAt,
  };

  localStorage.setItem(key, JSON.stringify(record));
  broadcastAuthEvent({
    type: "TOKEN_UPDATED",
    tokenType,
    expiresAt,
  });
};

const removeItems = (keys: readonly string[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  keys.forEach(key => localStorage.removeItem(key));
};

// Local Storage utilities
export const storage = {
  setToken: (token: string, ttlMinutes: number = 60) => {
    writeToken(STORAGE_KEYS.accessToken, token, ttlMinutes, "access");
  },

  getToken: (): string | null => {
    return readTokenRecord(
      STORAGE_KEYS.accessToken,
      STORAGE_KEYS.legacyAccessToken,
      STORAGE_KEYS.legacyAccessExpiry,
    )?.token ?? null;
  },

  getTokenInfo: (): TokenRecord | null => {
    return readTokenRecord(
      STORAGE_KEYS.accessToken,
      STORAGE_KEYS.legacyAccessToken,
      STORAGE_KEYS.legacyAccessExpiry,
    );
  },

  removeToken: () => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.accessToken);
    broadcastAuthEvent({ type: "TOKEN_UPDATED", tokenType: "access", expiresAt: null });
  },

  setRefreshToken: (token: string, ttlMinutes: number = 60) => {
    writeToken(STORAGE_KEYS.refreshToken, token, ttlMinutes, "refresh");
  },

  getRefreshToken: (): string | null => {
    return readTokenRecord(
      STORAGE_KEYS.refreshToken,
      STORAGE_KEYS.legacyRefreshToken,
      STORAGE_KEYS.legacyRefreshExpiry,
    )?.token ?? null;
  },

  getRefreshTokenInfo: (): TokenRecord | null => {
    return readTokenRecord(
      STORAGE_KEYS.refreshToken,
      STORAGE_KEYS.legacyRefreshToken,
      STORAGE_KEYS.legacyRefreshExpiry,
    );
  },

  removeRefreshToken: () => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    broadcastAuthEvent({ type: "TOKEN_UPDATED", tokenType: "refresh", expiresAt: null });
  },

  // Clear all auth data
  clearAuth: (reason: AuthSessionClearReason = "manual") => {
    removeItems([
      STORAGE_KEYS.accessToken,
      STORAGE_KEYS.refreshToken,
      STORAGE_KEYS.user,
      STORAGE_KEYS.legacyAccessToken,
      STORAGE_KEYS.legacyAccessExpiry,
      STORAGE_KEYS.legacyRefreshToken,
      STORAGE_KEYS.legacyRefreshExpiry,
    ]);

    broadcastAuthEvent({ type: "SESSION_CLEARED", reason });
  },

  setUser: <T>(user: T) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },

  getUser: <T>(): T | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEYS.user);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.user);
      return null;
    }
  },

  removeUser: () => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.user);
  },

  // Generic storage methods
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },

  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },

  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },

  setObject: <T>(key: string, value: T) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  getObject: <T>(key: string): T | null => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
};
