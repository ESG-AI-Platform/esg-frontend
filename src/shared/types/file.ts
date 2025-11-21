export interface FileInfo {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadResponse {
  url: string;
  id: string;
  name: string;
  size: number;
}
