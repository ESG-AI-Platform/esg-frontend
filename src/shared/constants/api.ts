export const API_CONFIG_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/v1/auth/register",
    LOGIN: "/v1/auth/login",
    REFRESH: "/v1/auth/refresh",
    LOGOUT: "/v1/auth/logout",
    ME: "/v1/auth/me",
  },
  ESG: {
    METRICS: "/esg/metrics",
    REPORTS: "/esg/reports",
  },
  ESG_ANALYZER: {
    PROCESS_DOCUMENTS: "/v1/esg-reports/process-documents",
    PROCESSED_REPORTS_STATUS: "/v1/esg-reports/processing-status",
  },
  ESG_REPORTS: {
    MY_REPORTS: "/v1/esg-reports/my-reports",
  },
} as const;
