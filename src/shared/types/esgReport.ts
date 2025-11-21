export interface ESGReportData {
    id: string;
    userId: string;
    
    // Job and status
    jobId?: string;
    status?: 'INQUEUE' | 'PROCESSING' | 'COMPLETE' | 'CANCELLED' | 'FAILED';
    
    // Company information
    year?: number;
    companyName?: string;
    companyUrl?: string;
    stockTicker?: string;
    additionalInfo?: string;
    
    // ICB classification
    industryId?: string;
    supersectorId?: string;
    sectorId?: string;
    subsectorId?: string;
    
    // Document fields
    documentInputName: string[];
    documentInputUrl: string[];
    csvReportUrl?: string;
    csvMergedReportUrl?: string;
    
    // Timestamps
    createdAt: string;
    updatedAt: string;
}