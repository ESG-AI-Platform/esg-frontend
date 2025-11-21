import { API_ENDPOINTS } from '@/shared/constants/api';
import { ApiClient } from '@/shared/lib/api-client';

import { ESGProcessDocumentsRequest, ESGProcessDocumentsResponse, ESGProcessDocumentsStatusResponse } from '../types';

class ESGAnalyzerService {
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient();
    }

    async getProcessedReportsStatus(reportId: string): Promise<ESGProcessDocumentsStatusResponse> {
        const response = await this.apiClient.get<ESGProcessDocumentsStatusResponse>(
            API_ENDPOINTS.ESG_ANALYZER.PROCESSED_REPORTS_STATUS + `/${reportId}`
        );

        return response.data;
    }

    async processDocuments(data: ESGProcessDocumentsRequest): Promise<ESGProcessDocumentsResponse> {
        const formData = new FormData();
       
        data.pdfFiles.forEach((file, _) => {
            formData.append('pdfFiles', file);
        });

        formData.append('year', data.year.toString());
        formData.append('companyName', data.companyName);
        formData.append('companyUrl', data.companyUrl);
        formData.append('stockTicker', data.stockTicker);
        formData.append('additionalInfo', data.additionalInfo);
        // formData.append('industryId', data.industryId);
        // formData.append('supersectorId', data.supersectorId);
        // formData.append('sectorId', data.sectorId);
        formData.append('subsectorCode', data.subsectorCode);

        const response = await this.apiClient.post<ESGProcessDocumentsResponse>(
            API_ENDPOINTS.ESG_ANALYZER.PROCESS_DOCUMENTS, 
            formData
        );
    
        return response.data;
    }

    prepareProcessingData(
        companyData: {
            companyName: string;
            companyWebsite: string;
            stockTicker: string;
            year: string;
            additionalInfo: string;
            // industryId: string;
            // supersectorId: string;
            // sectorId: string;
            subsectorCode: string;
        },
        files: File[]
    ): ESGProcessDocumentsRequest {
        return {
            pdfFiles: files,
            year: parseInt(companyData.year, 10),
            companyName: companyData.companyName,
            companyUrl: companyData.companyWebsite,
            stockTicker: companyData.stockTicker,
            additionalInfo: companyData.additionalInfo,
            // industryId: companyData.industryId,
            // supersectorId: companyData.supersectorId,
            // sectorId: companyData.sectorId,
            subsectorCode: companyData.subsectorCode,
        };
    }
}

export const esgAnalyzerService = new ESGAnalyzerService();
