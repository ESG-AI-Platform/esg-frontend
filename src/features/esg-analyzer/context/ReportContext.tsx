'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { ESGReportData } from '@/shared/types/esgReport';

import { useReport } from '@/features/esg-report/hooks/useReport';

interface ReportContextType {
    reportId: string | null;
    setReportId: (id: string | null) => void;
    reportData: ESGReportData | null | undefined;
    isLoading: boolean;
    error: unknown;
    refetch: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ 
    children,
    initialReportId = null
}: { 
    children: ReactNode,
    initialReportId?: string | null
}) {
    const [reportId, setReportId] = useState<string | null>(initialReportId);
    
    useEffect(() => {
        if (initialReportId) {
            setReportId(initialReportId);
        }
    }, [initialReportId]);

    const { data: reportData, isLoading, error, refetch } = useReport(reportId);

    return (
        <ReportContext.Provider value={{
            reportId,
            setReportId,
            reportData,
            isLoading,
            error,
            refetch
        }}>
            {children}
        </ReportContext.Provider>
    );
}

export function useReportContext() {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error('useReportContext must be used within a ReportProvider');
    }
    return context;
}
