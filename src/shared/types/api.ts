export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  pagination?: {
    "page": number;
    "limit": number;
    "total": number;
    "totalPages": number;
  };
  success: boolean;
}
