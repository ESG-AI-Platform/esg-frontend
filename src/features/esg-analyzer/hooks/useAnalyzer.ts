import { useQuery } from '@tanstack/react-query';

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
            const getAdjustedMinioUrl = (url: string) => {
                if (process.env.NODE_ENV === 'development') {
                    return url.replace('minio', 'localhost');
                }
                const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL || process.env.MINIO_URL || 'minio.esg-ai.wankaew.com';
                return url.replace('minio:9000', minioUrl);
            };

            const adjustedMergedUrl = mergedUrl ? getAdjustedMinioUrl(mergedUrl) : '';
            const adjustedDetailedUrl = detailedUrl ? getAdjustedMinioUrl(detailedUrl) : '';

            if (adjustedMergedUrl && adjustedDetailedUrl) {
                return await CSVService.fetchAndProcessBothCSVs(adjustedMergedUrl, adjustedDetailedUrl);
            }
            throw new Error('Missing CSV URLs');
        },
        enabled: !!mergedUrl && !!detailedUrl,
        staleTime: Infinity,
    });
};
