'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { notifyError } from '@/shared/lib/notify-error';
import { ESGReportData } from '@/shared/types/esgReport';

import { useReportCSV } from '../hooks/useAnalyzer';
import { mockThemeDataWithSources } from '../services';
import { DimensionGapData, OverallStatisticData } from '../types';

import { AnalyzedThemesProportionalGap, DetailedAnalysisModal, OverallStatistic } from './results-reports';
import { DimensionProportionalGap } from './results-reports/DimensionProportionalGap';

const mockOverallData: OverallStatisticData = {
    gapAnalysis: {
        gapCount: 15,
        totalIndicators: 35,
        totalQuestionCodes: 120,
        description: "Overall Gap Analysis"
    },
    analyzedThemes: {
        analyzedThemeCount: 12,
        description: "Analyzed Themes",
        icon: "📊"
    }
};

const mockDimensionData: DimensionGapData[] = [
    {
        name: "Environment",
        gapCount: 0,
        totalGaps: 100,
        percentage: 0
    },
    {
        name: "Social",
        gapCount: 80,
        totalGaps: 100,
        percentage: 80
    },
    {
        name: "Governance",
        gapCount: 20,
        totalGaps: 100,
        percentage: 20
    }
];

interface ResultsReportsProps {
    reportData?: ESGReportData | null;
}

const getAdjustedMinioUrl = (url: string) => {
    if (process.env.NODE_ENV === 'development') {
        return url.replace('minio', 'localhost');
    }
    const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL || process.env.MINIO_URL || 'minio.esg-ai.wankaew.com';
    return url.replace('minio:9000', minioUrl);
};

export function ResultsReports({ reportData }: ResultsReportsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: processedData,
        isLoading: isCsvLoading,
        isError,
        error: csvError,
        refetch
    } = useReportCSV(
        reportData?.csvMergedReportUrl,
        reportData?.csvReportUrl
    );

    const overallData = processedData?.overallData || mockOverallData;
    const dimensionData = processedData?.dimensionData || mockDimensionData;
    const themeData = processedData?.themeData || mockThemeDataWithSources;

    const handleDownloadReport = async () => {
        if (!reportData || !reportData.csvMergedReportUrl) {
            toast.error('No report data available for download');
            return;
        }

        try {
            const link = document.createElement('a');
            link.href = getAdjustedMinioUrl(reportData.csvMergedReportUrl);
            link.target = '_blank';
            const companyName = reportData.companyName || 'Unknown_Company';
            link.download = `${companyName.replace(/[^a-z0-9]/gi, '_')}_ESG_Report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            notifyError(error, {
                context: 'downloadReport',
                userMessage: 'Failed to download report. Please try again.',
            });
        }
    };

    const handleDownloadDetailedReport = async () => {
        if (!reportData || !reportData.csvReportUrl) {
            toast.error('No report data available for download');
            return;
        }

        try {
            const link = document.createElement('a');
            link.href = getAdjustedMinioUrl(reportData.csvReportUrl);
            link.target = '_blank';
            const companyName = reportData.companyName || 'Unknown_Company';
            link.download = `${companyName.replace(/[^a-z0-9]/gi, '_')}_ESG_Report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            notifyError(error, {
                context: 'downloadDetailedReport',
                userMessage: 'Failed to download report. Please try again.',
            });
        }
    };

    const handleViewDetailedAnalysis = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (isCsvLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading report data...</span>
            </div>
        );
    }

    if (isError) {
        if (csvError) {
            notifyError(csvError, {
                context: 'loadReportCSV',
                userMessage: 'Failed to load report data.',
            });
        }
        return (
            <div className="py-12 text-center">
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="mb-2 text-gray-600">Could not load report data.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!reportData) {
        return (
            <div className="py-12 text-center">
                <div className="p-6 border border-yellow-200 rounded-lg bg-yellow-50">
                    <h3 className="mb-2 font-medium text-yellow-800">No Report Data Available</h3>
                    <p className="text-yellow-600">Please complete the document upload and analysis steps first.</p>
                </div>
            </div>
        );
    }

    if (reportData && !reportData.csvReportUrl && !reportData.csvMergedReportUrl) {
        return (
            <div className="py-12 text-center">
                <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
                    <h3 className="mb-2 font-medium text-blue-800">Report Processing</h3>
                    <p className="text-blue-600">Your report is being processed. CSV data will be available once processing is complete.</p>
                    <p className="mt-2 text-sm text-blue-500">Status: {reportData.status || 'Processing'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-8 space-y-8">
            {/* Overall Statistic */}
            <OverallStatistic data={overallData} />

            {/* Dimension and Themes Proportional Gap - Side by Side */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                {/* Dimension Proportional Gap */}
                <DimensionProportionalGap data={dimensionData} />

                {/* Analyzed Themes Proportional Gap */}
                <AnalyzedThemesProportionalGap data={themeData} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-4 border-t sm:flex-row">
                <button
                    onClick={handleDownloadReport}
                    disabled={isCsvLoading || !reportData?.csvMergedReportUrl}
                    className="flex items-center justify-center px-6 py-3 space-x-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span>Download Report</span>
                </button>

                <button
                    onClick={handleDownloadDetailedReport}
                    disabled={isCsvLoading || !reportData?.csvReportUrl}
                    className="flex items-center justify-center px-6 py-3 space-x-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span>Download Detailed Report</span>
                </button>

                <button
                    onClick={handleViewDetailedAnalysis}
                    disabled={isCsvLoading}
                    className="flex items-center justify-center px-6 py-3 space-x-2 font-medium text-white transition-colors duration-200 bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>View Detailed Analysis</span>
                </button>
            </div>

            {/* Detailed Analysis Modal */}
            <DetailedAnalysisModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                dimensionData={dimensionData}
                themeData={themeData}
            />
        </div>
    );
}
