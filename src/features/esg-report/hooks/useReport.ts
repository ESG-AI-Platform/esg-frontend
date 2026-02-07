import { useQuery } from '@tanstack/react-query';

import { esgReportService } from '../services';

export const useReport = (id?: string | null) => {
    return useQuery({
        queryKey: ['my-reports'],
        queryFn: () => esgReportService.getMyReports(),
        select: (reports) => reports.find((r) => r.id === id) || null,
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
