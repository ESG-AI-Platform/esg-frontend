import { useQuery } from '@tanstack/react-query';

import { normalizeStorageUrl } from '@/shared/lib/storage-url';

import { CSVService } from '../services';
import { esgAnalyzerService } from '../services/api';
import { ESGProcessDocumentsStatusResponse } from '../types';

export const useReportStatus = (reportId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['report-status', reportId],
        queryFn: () => esgAnalyzerService.getProcessedReportsStatus(reportId),
        enabled: !!reportId && enabled,
        refetchInterval: (query) => {
            const data = query.state.data as ESGProcessDocumentsStatusResponse | undefined;
            if (data?.status === 'COMPLETE' || data?.status === 'FAILED' || data?.status === 'CANCELLED') {
                return false;
            }
            return 30000;
        },
    });
};

export const useReportCSV = (
    mergedUrl?: string,
    detailedUrl?: string
) => {
    return useQuery({
        queryKey: ['report-csv', mergedUrl, detailedUrl],
        queryFn: async () => {
            const adjustedMergedUrl = mergedUrl ? normalizeStorageUrl(mergedUrl) : '';
            const adjustedDetailedUrl = detailedUrl ? normalizeStorageUrl(detailedUrl) : '';

            if (adjustedMergedUrl && adjustedDetailedUrl) {
                return await CSVService.fetchAndProcessBothCSVs(adjustedMergedUrl, adjustedDetailedUrl);
            }
            throw new Error('Missing CSV URLs');
        },
        enabled: !!mergedUrl && !!detailedUrl,
        staleTime: Infinity,
    });
};
