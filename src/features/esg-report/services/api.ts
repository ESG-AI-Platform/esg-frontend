import { API_ENDPOINTS } from '@/shared/constants/api';
import { ApiClient } from '@/shared/lib/api-client';
import { notifyError } from '@/shared/lib/notify-error';
import { ESGReportData } from '@/shared/types/esgReport';

import { ESGReportSummary } from '../types';

class ESGReportService {
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient();
    }

    async getMyReports(): Promise<ESGReportData[]> {
        const response = await this.apiClient.get<ESGReportData[]>(API_ENDPOINTS.ESG_REPORTS.MY_REPORTS);
        return response.data;
    }

    async getReportsSummary(): Promise<ESGReportSummary[]> {
        const reports = await this.getMyReports();
        return reports.map(report => ({
            id: report.id,
            companyName: report.companyName || 'Unknown Company',
            status: report.status || 'INQUEUE',
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
            filesCount: report.documentInputName.length,
            csvReportUrl: report.csvMergedReportUrl || ''
        }));
    }

    async getReportById(id: string): Promise<ESGReportData | null> {
        try {
            const reports = await this.getMyReports();
            const report = reports.find(r => r.id === id);
            return report || null;
        } catch (error) {
            notifyError(error, {
                context: 'getReportById',
                showToast: false,
            });
            return null;
        }
    }
}

export const esgReportService = new ESGReportService();
