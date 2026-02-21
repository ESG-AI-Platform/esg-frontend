// ===== KPI / Dashboard =====
export interface DashboardKPI {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: "documents" | "companies" | "calendar" | "chart" | "layers" | "average";
}

// ===== ESG Document Registry =====
export interface ESGDocumentRecord {
  id: string;
  companyName: string;
  companyUrl?: string;
  stockTicker?: string;
  year: number;
  status: "INQUEUE" | "PROCESSING" | "COMPLETE" | "CANCELLED" | "FAILED";
  filesCount: number;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
  csvReportUrl?: string;
}

// ===== Company Profile =====
export interface CompanyProfile {
  id: string;
  name: string;
  url?: string;
  stockTicker?: string;
  totalReports: number;
  reportingYears: number[];
  reports: ESGDocumentRecord[];
}

// ===== Analytics =====
export interface YearlyDocumentCount {
  year: number;
  count: number;
}

export interface YearlyCompanyCount {
  year: number;
  newCompanies: number;
  totalCompanies: number;
}

export interface GrowthRate {
  year: number;
  rate: number;
}

export interface ContinuousReporting {
  companyName: string;
  consecutiveYears: number;
  years: number[];
}

// ===== Data Quality =====
export interface DataQualityIssue {
  id: string;
  type: "duplicate" | "missing_metadata" | "broken_url" | "abnormal_size";
  severity: "high" | "medium" | "low";
  description: string;
  affectedRecord: string;
  detectedAt: string;
}

export interface DataQualitySummary {
  totalIssues: number;
  duplicates: number;
  missingMetadata: number;
  brokenUrls: number;
  abnormalSizes: number;
}

// ===== Master Data: Indicators =====
export interface FTSEDimension {
  id: number;
  name: string;
  nameLocal?: string;
  description?: string;
  themes: FTSETheme[];
}

export interface FTSETheme {
  id: number;
  name: string;
  nameLocal?: string;
  description?: string;
  dimensionId: number;
  indicators: FTSEIndicator[];
}

export interface FTSEIndicator {
  id: number;
  code: string;
  description?: string;
  subDescription1?: string;
  subDescription2?: string;
  subDescription3?: string;
  keywords_a?: string;
  keywords_b?: string;
  keywords_c?: string;
  indicatorType: "QUALITATIVE" | "QUANTITATIVE" | "QUALITATIVE_QUANTITATIVE" | "PERFORMANCE";
  indicatorSymbols: ("NA" | "S" | "P" | "G")[];
  riskLevels: ("NA" | "H" | "M" | "L")[];
  themeId: number;
}

export interface Subsector {
  id: number;
  code: string;
  name: string;
  nameLocal?: string;
  description?: string;
}

// ===== Sidebar Navigation =====
export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
