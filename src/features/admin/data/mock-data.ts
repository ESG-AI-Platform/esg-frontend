import type {
  DashboardKPI,
  ESGDocumentRecord,
  CompanyProfile,
  YearlyDocumentCount,
  YearlyCompanyCount,
  GrowthRate,
  ContinuousReporting,
  DataQualityIssue,
  DataQualitySummary,
  FTSEDimension,
  Subsector,
} from "../types";

// ===== Dashboard KPIs =====
export const dashboardKPIs: DashboardKPI[] = [
  { label: "Total ESG Documents", value: 1247, change: "+12%", changeType: "positive", icon: "documents" },
  { label: "Total Companies", value: 389, change: "+8%", changeType: "positive", icon: "companies" },
  { label: "Submitted This Year", value: 234, change: "+23%", changeType: "positive", icon: "calendar" },
  { label: "Submitted This Month", value: 42, change: "-5%", changeType: "negative", icon: "chart" },
  { label: "Unique Reporting Years", value: 12, change: "2014-2025", changeType: "neutral", icon: "layers" },
  { label: "Avg Reports / Company", value: "3.2", change: "+0.4", changeType: "positive", icon: "average" },
];

// ===== ESG Document Registry =====
export const esgDocuments: ESGDocumentRecord[] = [
  {
    id: "rpt-001",
    companyName: "PTT Public Company Limited",
    companyUrl: "https://www.pttplc.com",
    stockTicker: "PTT",
    year: 2025,
    status: "COMPLETE",
    filesCount: 3,
    submittedBy: "admin@esg.com",
    createdAt: "2025-12-15T10:30:00Z",
    updatedAt: "2025-12-15T12:45:00Z",
    csvReportUrl: "/reports/ptt-2025.csv",
  },
  {
    id: "rpt-002",
    companyName: "Bangkok Bank Public Company Limited",
    companyUrl: "https://www.bangkokbank.com",
    stockTicker: "BBL",
    year: 2025,
    status: "PROCESSING",
    filesCount: 2,
    submittedBy: "user1@esg.com",
    createdAt: "2025-12-18T08:00:00Z",
    updatedAt: "2025-12-18T08:15:00Z",
  },
  {
    id: "rpt-003",
    companyName: "CP ALL Public Company Limited",
    companyUrl: "https://www.cpall.co.th",
    stockTicker: "CPALL",
    year: 2024,
    status: "COMPLETE",
    filesCount: 4,
    submittedBy: "admin@esg.com",
    createdAt: "2025-11-20T14:00:00Z",
    updatedAt: "2025-11-20T16:30:00Z",
    csvReportUrl: "/reports/cpall-2024.csv",
  },
  {
    id: "rpt-004",
    companyName: "Siam Cement Group",
    companyUrl: "https://www.scg.com",
    stockTicker: "SCC",
    year: 2025,
    status: "COMPLETE",
    filesCount: 5,
    submittedBy: "analyst@esg.com",
    createdAt: "2025-12-10T09:00:00Z",
    updatedAt: "2025-12-10T11:20:00Z",
    csvReportUrl: "/reports/scg-2025.csv",
  },
  {
    id: "rpt-005",
    companyName: "Kasikornbank Public Company Limited",
    companyUrl: "https://www.kasikornbank.com",
    stockTicker: "KBANK",
    year: 2024,
    status: "FAILED",
    filesCount: 1,
    submittedBy: "user2@esg.com",
    createdAt: "2025-12-01T13:00:00Z",
    updatedAt: "2025-12-01T13:45:00Z",
  },
  {
    id: "rpt-006",
    companyName: "Advanced Info Service",
    companyUrl: "https://www.ais.th",
    stockTicker: "ADVANC",
    year: 2025,
    status: "INQUEUE",
    filesCount: 2,
    submittedBy: "user3@esg.com",
    createdAt: "2025-12-20T07:30:00Z",
    updatedAt: "2025-12-20T07:30:00Z",
  },
  {
    id: "rpt-007",
    companyName: "Thai Oil Public Company Limited",
    companyUrl: "https://www.thaioilgroup.com",
    stockTicker: "TOP",
    year: 2023,
    status: "COMPLETE",
    filesCount: 3,
    submittedBy: "admin@esg.com",
    createdAt: "2025-10-05T10:00:00Z",
    updatedAt: "2025-10-05T12:00:00Z",
    csvReportUrl: "/reports/top-2023.csv",
  },
  {
    id: "rpt-008",
    companyName: "Gulf Energy Development",
    companyUrl: "https://www.gulf.co.th",
    stockTicker: "GULF",
    year: 2025,
    status: "PROCESSING",
    filesCount: 2,
    submittedBy: "analyst@esg.com",
    createdAt: "2025-12-19T16:00:00Z",
    updatedAt: "2025-12-19T16:30:00Z",
  },
  {
    id: "rpt-009",
    companyName: "Delta Electronics Thailand",
    companyUrl: "https://www.deltathailand.com",
    stockTicker: "DELTA",
    year: 2024,
    status: "COMPLETE",
    filesCount: 3,
    submittedBy: "user1@esg.com",
    createdAt: "2025-09-12T11:00:00Z",
    updatedAt: "2025-09-12T14:00:00Z",
    csvReportUrl: "/reports/delta-2024.csv",
  },
  {
    id: "rpt-010",
    companyName: "True Corporation",
    companyUrl: "https://www.true.th",
    stockTicker: "TRUE",
    year: 2025,
    status: "CANCELLED",
    filesCount: 1,
    submittedBy: "user2@esg.com",
    createdAt: "2025-12-05T09:00:00Z",
    updatedAt: "2025-12-05T10:00:00Z",
  },
];

// ===== Company Profiles =====
export const companyProfiles: CompanyProfile[] = [
  {
    id: "comp-001",
    name: "PTT Public Company Limited",
    url: "https://www.pttplc.com",
    stockTicker: "PTT",
    totalReports: 8,
    reportingYears: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    reports: esgDocuments.filter((d) => d.stockTicker === "PTT"),
  },
  {
    id: "comp-002",
    name: "Bangkok Bank Public Company Limited",
    url: "https://www.bangkokbank.com",
    stockTicker: "BBL",
    totalReports: 5,
    reportingYears: [2021, 2022, 2023, 2024, 2025],
    reports: esgDocuments.filter((d) => d.stockTicker === "BBL"),
  },
  {
    id: "comp-003",
    name: "CP ALL Public Company Limited",
    url: "https://www.cpall.co.th",
    stockTicker: "CPALL",
    totalReports: 6,
    reportingYears: [2019, 2020, 2021, 2022, 2023, 2024],
    reports: esgDocuments.filter((d) => d.stockTicker === "CPALL"),
  },
  {
    id: "comp-004",
    name: "Siam Cement Group",
    url: "https://www.scg.com",
    stockTicker: "SCC",
    totalReports: 10,
    reportingYears: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    reports: esgDocuments.filter((d) => d.stockTicker === "SCC"),
  },
  {
    id: "comp-005",
    name: "Kasikornbank Public Company Limited",
    url: "https://www.kasikornbank.com",
    stockTicker: "KBANK",
    totalReports: 4,
    reportingYears: [2022, 2023, 2024, 2025],
    reports: esgDocuments.filter((d) => d.stockTicker === "KBANK"),
  },
];

// ===== Analytics: Yearly Document Counts =====
export const yearlyDocumentCounts: YearlyDocumentCount[] = [
  { year: 2018, count: 45 },
  { year: 2019, count: 78 },
  { year: 2020, count: 112 },
  { year: 2021, count: 156 },
  { year: 2022, count: 198 },
  { year: 2023, count: 221 },
  { year: 2024, count: 203 },
  { year: 2025, count: 234 },
];

// ===== Analytics: Yearly Company Counts =====
export const yearlyCompanyCounts: YearlyCompanyCount[] = [
  { year: 2018, newCompanies: 30, totalCompanies: 30 },
  { year: 2019, newCompanies: 42, totalCompanies: 72 },
  { year: 2020, newCompanies: 38, totalCompanies: 110 },
  { year: 2021, newCompanies: 55, totalCompanies: 165 },
  { year: 2022, newCompanies: 67, totalCompanies: 232 },
  { year: 2023, newCompanies: 58, totalCompanies: 290 },
  { year: 2024, newCompanies: 52, totalCompanies: 342 },
  { year: 2025, newCompanies: 47, totalCompanies: 389 },
];

// ===== Analytics: Growth Rate =====
export const growthRates: GrowthRate[] = [
  { year: 2019, rate: 73.3 },
  { year: 2020, rate: 43.6 },
  { year: 2021, rate: 39.3 },
  { year: 2022, rate: 26.9 },
  { year: 2023, rate: 11.6 },
  { year: 2024, rate: -8.1 },
  { year: 2025, rate: 15.3 },
];

// ===== Analytics: Continuous Reporting =====
export const continuousReporting: ContinuousReporting[] = [
  { companyName: "Siam Cement Group", consecutiveYears: 10, years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] },
  { companyName: "PTT Public Company Limited", consecutiveYears: 8, years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] },
  { companyName: "CP ALL Public Company Limited", consecutiveYears: 6, years: [2019, 2020, 2021, 2022, 2023, 2024] },
  { companyName: "Bangkok Bank Public Company Limited", consecutiveYears: 5, years: [2021, 2022, 2023, 2024, 2025] },
  { companyName: "Kasikornbank Public Company Limited", consecutiveYears: 4, years: [2022, 2023, 2024, 2025] },
  { companyName: "Advanced Info Service", consecutiveYears: 4, years: [2022, 2023, 2024, 2025] },
  { companyName: "Thai Oil Public Company Limited", consecutiveYears: 3, years: [2023, 2024, 2025] },
  { companyName: "Delta Electronics Thailand", consecutiveYears: 3, years: [2022, 2023, 2024] },
];

// ===== Data Quality =====
export const dataQualitySummary: DataQualitySummary = {
  totalIssues: 23,
  duplicates: 4,
  missingMetadata: 11,
  brokenUrls: 5,
  abnormalSizes: 3,
};

export const dataQualityIssues: DataQualityIssue[] = [
  { id: "dq-001", type: "duplicate", severity: "high", description: "Duplicate entry for PTT 2024 - same company and year", affectedRecord: "rpt-012", detectedAt: "2025-12-20T08:00:00Z" },
  { id: "dq-002", type: "missing_metadata", severity: "medium", description: "Missing stock ticker for company submission", affectedRecord: "rpt-045", detectedAt: "2025-12-19T14:00:00Z" },
  { id: "dq-003", type: "broken_url", severity: "high", description: "Company website URL returns 404", affectedRecord: "rpt-023", detectedAt: "2025-12-18T10:30:00Z" },
  { id: "dq-004", type: "abnormal_size", severity: "low", description: "CSV report file is unusually large (>50MB)", affectedRecord: "rpt-078", detectedAt: "2025-12-17T16:00:00Z" },
  { id: "dq-005", type: "missing_metadata", severity: "medium", description: "Missing year field for ESG report", affectedRecord: "rpt-091", detectedAt: "2025-12-16T09:15:00Z" },
  { id: "dq-006", type: "duplicate", severity: "high", description: "Duplicate entry for SCG 2023", affectedRecord: "rpt-034", detectedAt: "2025-12-15T11:00:00Z" },
  { id: "dq-007", type: "broken_url", severity: "medium", description: "Company URL redirects to unrelated domain", affectedRecord: "rpt-056", detectedAt: "2025-12-14T13:45:00Z" },
  { id: "dq-008", type: "missing_metadata", severity: "low", description: "Missing additional info field", affectedRecord: "rpt-067", detectedAt: "2025-12-13T08:30:00Z" },
  { id: "dq-009", type: "abnormal_size", severity: "medium", description: "Document file is 0 bytes", affectedRecord: "rpt-089", detectedAt: "2025-12-12T15:00:00Z" },
  { id: "dq-010", type: "missing_metadata", severity: "high", description: "Missing company name for report submission", affectedRecord: "rpt-102", detectedAt: "2025-12-11T10:00:00Z" },
];

// ===== Master Data: FTSE Dimensions with Themes and Indicators =====
export const ftseDimensions: FTSEDimension[] = [
  {
    id: 1,
    name: "Environment",
    nameLocal: "สิ่งแวดล้อม",
    description: "Environmental impact and sustainability practices",
    themes: [
      {
        id: 1,
        name: "Climate Change",
        nameLocal: "การเปลี่ยนแปลงสภาพภูมิอากาศ",
        description: "GHG emissions, carbon footprint, climate strategy",
        dimensionId: 1,
        indicators: [
          { id: 1, code: "CC0101", description: "Climate Change Policy", indicatorType: "QUALITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 1 },
          { id: 2, code: "CC0102", description: "Carbon Emissions (Scope 1)", indicatorType: "QUANTITATIVE", indicatorSymbols: ["P"], riskLevels: ["H"], themeId: 1 },
          { id: 3, code: "CC0103", description: "Carbon Emissions (Scope 2)", indicatorType: "QUANTITATIVE", indicatorSymbols: ["P"], riskLevels: ["H"], themeId: 1 },
          { id: 4, code: "CC0104", description: "Carbon Emissions (Scope 3)", indicatorType: "QUANTITATIVE", indicatorSymbols: ["P"], riskLevels: ["M"], themeId: 1 },
          { id: 5, code: "CC0105", description: "Climate Change Targets", indicatorType: "QUALITATIVE_QUANTITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 1 },
        ],
      },
      {
        id: 2,
        name: "Pollution & Resources",
        nameLocal: "มลพิษและทรัพยากร",
        description: "Waste management, water use, air pollution",
        dimensionId: 1,
        indicators: [
          { id: 6, code: "PR0201", description: "Water Usage Policy", indicatorType: "QUALITATIVE", indicatorSymbols: ["S"], riskLevels: ["M"], themeId: 2 },
          { id: 7, code: "PR0202", description: "Total Water Withdrawal", indicatorType: "QUANTITATIVE", indicatorSymbols: ["P"], riskLevels: ["M"], themeId: 2 },
          { id: 8, code: "PR0203", description: "Waste Generation", indicatorType: "QUANTITATIVE", indicatorSymbols: ["P"], riskLevels: ["M"], themeId: 2 },
          { id: 9, code: "PR0204", description: "Hazardous Waste Disposal", indicatorType: "PERFORMANCE", indicatorSymbols: ["S", "P"], riskLevels: ["H"], themeId: 2 },
        ],
      },
      {
        id: 3,
        name: "Biodiversity",
        nameLocal: "ความหลากหลายทางชีวภาพ",
        description: "Ecosystem protection and biodiversity impact",
        dimensionId: 1,
        indicators: [
          { id: 10, code: "BD0301", description: "Biodiversity Policy", indicatorType: "QUALITATIVE", indicatorSymbols: ["S"], riskLevels: ["L"], themeId: 3 },
          { id: 11, code: "BD0302", description: "Land Use Impact Assessment", indicatorType: "QUALITATIVE_QUANTITATIVE", indicatorSymbols: ["S"], riskLevels: ["M"], themeId: 3 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Social",
    nameLocal: "สังคม",
    description: "Social responsibility and community engagement",
    themes: [
      {
        id: 4,
        name: "Human Rights & Community",
        nameLocal: "สิทธิมนุษยชนและชุมชน",
        description: "Human rights due diligence and community impact",
        dimensionId: 2,
        indicators: [
          { id: 12, code: "HR0401", description: "Human Rights Policy", indicatorType: "QUALITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 4 },
          { id: 13, code: "HR0402", description: "Human Rights Due Diligence", indicatorType: "QUALITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 4 },
          { id: 14, code: "HR0403", description: "Community Engagement Programs", indicatorType: "QUALITATIVE_QUANTITATIVE", indicatorSymbols: ["G"], riskLevels: ["M"], themeId: 4 },
        ],
      },
      {
        id: 5,
        name: "Labour Standards",
        nameLocal: "มาตรฐานแรงงาน",
        description: "Fair labor practices, workplace safety",
        dimensionId: 2,
        indicators: [
          { id: 15, code: "LS0501", description: "Occupational Health & Safety Policy", indicatorType: "QUALITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 5 },
          { id: 16, code: "LS0502", description: "Lost Time Injury Rate", indicatorType: "PERFORMANCE", indicatorSymbols: ["P"], riskLevels: ["H"], themeId: 5 },
          { id: 17, code: "LS0503", description: "Employee Turnover Rate", indicatorType: "QUANTITATIVE", indicatorSymbols: ["P"], riskLevels: ["M"], themeId: 5 },
        ],
      },
      {
        id: 6,
        name: "Health & Safety",
        nameLocal: "สุขภาพและความปลอดภัย",
        description: "Product and consumer safety",
        dimensionId: 2,
        indicators: [
          { id: 18, code: "HS0601", description: "Product Safety Policy", indicatorType: "QUALITATIVE", indicatorSymbols: ["S"], riskLevels: ["M"], themeId: 6 },
          { id: 19, code: "HS0602", description: "Product Recall Incidents", indicatorType: "QUANTITATIVE", indicatorSymbols: ["S", "P"], riskLevels: ["H"], themeId: 6 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Governance",
    nameLocal: "ธรรมาภิบาล",
    description: "Corporate governance, ethics, and transparency",
    themes: [
      {
        id: 7,
        name: "Corporate Governance",
        nameLocal: "การกำกับดูแลกิจการ",
        description: "Board structure, executive compensation, shareholder rights",
        dimensionId: 3,
        indicators: [
          { id: 20, code: "CG0701", description: "Board Independence", indicatorType: "QUANTITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 7 },
          { id: 21, code: "CG0702", description: "Board Diversity", indicatorType: "QUALITATIVE_QUANTITATIVE", indicatorSymbols: ["NA"], riskLevels: ["M"], themeId: 7 },
          { id: 22, code: "CG0703", description: "Executive Compensation Disclosure", indicatorType: "QUALITATIVE", indicatorSymbols: ["NA"], riskLevels: ["M"], themeId: 7 },
        ],
      },
      {
        id: 8,
        name: "Anti-Corruption",
        nameLocal: "การต่อต้านคอร์รัปชัน",
        description: "Anti-bribery and corruption prevention",
        dimensionId: 3,
        indicators: [
          { id: 23, code: "AC0801", description: "Anti-Corruption Policy", indicatorType: "QUALITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 8 },
          { id: 24, code: "AC0802", description: "Whistleblower Mechanism", indicatorType: "QUALITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 8 },
          { id: 25, code: "AC0803", description: "Corruption Risk Assessment", indicatorType: "QUALITATIVE_QUANTITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 8 },
        ],
      },
      {
        id: 9,
        name: "Risk Management",
        nameLocal: "การบริหารความเสี่ยง",
        description: "Enterprise risk management and reporting",
        dimensionId: 3,
        indicators: [
          { id: 26, code: "RM0901", description: "Risk Management Framework", indicatorType: "QUALITATIVE", indicatorSymbols: ["NA"], riskLevels: ["H"], themeId: 9 },
          { id: 27, code: "RM0902", description: "Tax Transparency", indicatorType: "QUALITATIVE_QUANTITATIVE", indicatorSymbols: ["G"], riskLevels: ["M"], themeId: 9 },
        ],
      },
    ],
  },
];

// ===== Subsectors =====
export const subsectors: Subsector[] = [
  { id: 1, code: "5010", name: "Oil & Gas Producers", nameLocal: "ผู้ผลิตน้ำมันและก๊าซ" },
  { id: 2, code: "5020", name: "Oil Equipment & Services", nameLocal: "อุปกรณ์และบริการน้ำมัน" },
  { id: 3, code: "8010", name: "Banks", nameLocal: "ธนาคาร" },
  { id: 4, code: "3010", name: "Food Producers", nameLocal: "ผู้ผลิตอาหาร" },
  { id: 5, code: "2010", name: "Construction & Materials", nameLocal: "ก่อสร้างและวัสดุ" },
  { id: 6, code: "6010", name: "Telecommunications", nameLocal: "โทรคมนาคม" },
  { id: 7, code: "9010", name: "Technology Hardware", nameLocal: "ฮาร์ดแวร์เทคโนโลยี" },
  { id: 8, code: "6510", name: "Electricity", nameLocal: "ไฟฟ้า" },
];
