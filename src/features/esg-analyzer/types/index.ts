import { ESGReportData } from "@/shared/types/esgReport";
import { User } from "@/shared/types/user";

export interface OverallGapAnalysisData {
    gapCount: number;
    totalIndicators: number;
    totalQuestionCodes: number;
    description: string;
}

export interface OverallAnalyzedThemesData {
    analyzedThemeCount: number;
    description: string;
    icon?: string;
}

export interface DimensionGapData {
    name: string;
    gapCount: number;
    totalGaps: number;
    percentage: number;
}

export interface ThemeGapData {
    name: string;
    gapCount: number;
    totalGaps: number;
    percentage: number;
    indicators?: IndicatorData[];
}

export interface IndicatorData {
    id: string;
    name: string;
    description: string;
    questionCodes: IndicatorQuestionCode[];
    gapCount: number;
    totalQuestions: number;
    percentage: number;
}

export interface IndicatorQuestionCode {
    code: string;
    question: string;
    source: SourceData[];
    hasGap: boolean;
}

export interface SourceData {
    id: string;
    source_text: string;
    page_number: number;
    source_file: string;
}

export interface OverallStatisticData {
    gapAnalysis: OverallGapAnalysisData;
    analyzedThemes: OverallAnalyzedThemesData;
}

export interface ESGProcessDocumentsRequest {
    pdfFiles: File[];
    year: number;
    companyName: string;
    companyUrl: string;
    stockTicker: string;
    additionalInfo: string;
    // industryId: string;
    // supersectorId: string;
    // sectorId: string;
    subsectorCode: string;
}

export interface filesProcessed {
    name: string;
    size_mb: number;
}

export interface ESGProcessDocumentsResponse {
    reportId: string,
    jobId: string,
    status: string,
    message: string,
    estimatedTimeMinutes: number,
    filesProcessed: filesProcessed[],
    indicatorsCount: number,
}

export interface ESGProcessDocumentsStatusResponse extends ESGReportData {
    user: User,
    progress: number,
    estimatedTimeMinutes?: number
}

export type ESGModule = 'document-upload' | 'analysis' | 'results-reports';
