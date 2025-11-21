export interface ESGReportSummary {
    id: string;
    companyName: string;
    status: 'INQUEUE' | 'PROCESSING' | 'COMPLETE' | 'CANCELLED' | 'FAILED';
    createdAt: string;
    updatedAt: string;
    filesCount: number;
    csvReportUrl: string;
}