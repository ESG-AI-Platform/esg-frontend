import { API_ENDPOINTS } from '@/shared/constants/api';
import { ApiClient } from '@/shared/lib/api-client';
import { ESGReportData } from '@/shared/types/esgReport';

import { ESGReportSummary } from '../types';

const REPORTS_PAGE_SIZE = 100;

class ESGReportService {
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient();
    }

    private getMyReportsEndpoint(page: number) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: REPORTS_PAGE_SIZE.toString(),
        });

        return `${API_ENDPOINTS.ESG_REPORTS.MY_REPORTS}?${params.toString()}`;
    }

    private async getMyReportsPage(page: number) {
        return await this.apiClient.get<ESGReportData[]>(this.getMyReportsEndpoint(page));
    }

    async getMyReports(): Promise<ESGReportData[]> {
        const firstPage = await this.getMyReportsPage(1);
        const totalPages = firstPage.pagination?.totalPages ?? 1;

        if (totalPages <= 1) {
            return firstPage.data;
        }

        const remainingPages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) => this.getMyReportsPage(index + 2))
        );

        return [
            ...firstPage.data,
            ...remainingPages.flatMap((response) => response.data),
        ];
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
            console.error('Failed to fetch report:', error);
            return null;
        }
    }
}

export const esgReportService = new ESGReportService();
