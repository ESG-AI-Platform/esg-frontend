'use client';

import { useEffect, useState } from 'react';

import { ESGReportData } from '@/shared/types/esgReport';

import { CSVService, mockThemeDataWithSources } from '../services';
import { DimensionGapData, OverallStatisticData, ThemeGapData } from '../types';

import { AnalyzedThemesProportionalGap, DetailedAnalysisModal, OverallStatistic } from './results-reports';
import { DimensionProportionalGap } from './results-reports/DimensionProportionalGap';

// Mock data for demonstration
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
    reportData?: ESGReportData;
}

export function ResultsReports({ reportData }: ResultsReportsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [overallData, setOverallData] = useState<OverallStatisticData>(mockOverallData);
    const [dimensionData, setDimensionData] = useState<DimensionGapData[]>(mockDimensionData);
    const [themeData, setThemeData] = useState<ThemeGapData[]>(mockThemeDataWithSources);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (reportData?.csvReportUrl || reportData?.csvMergedReportUrl) {
            loadCSVData();
        }
    }, [reportData]);

    const loadCSVData = async () => {
        if (!reportData?.csvReportUrl && !reportData?.csvMergedReportUrl) return;

        setIsLoading(true);
        setError(null);

        try {
            if (reportData.csvMergedReportUrl && reportData.csvReportUrl) {
                let mergedUrl: string;
                let detailedUrl: string;
                if (process.env.NODE_ENV === 'development') {
                    mergedUrl = reportData.csvMergedReportUrl.replace('minio', 'localhost');
                    detailedUrl = reportData.csvReportUrl.replace('minio', 'localhost');
                } else {
                    mergedUrl = reportData.csvMergedReportUrl.replace('minio:9000', process.env.MINIO_URL || 'minio.esg-ai.wankaew.com');
                    detailedUrl = reportData.csvReportUrl.replace('minio:9000', process.env.MINIO_URL || 'minio.esg-ai.wankaew.com');
                }

                const processedData = await CSVService.fetchAndProcessBothCSVs(mergedUrl, detailedUrl);

                setOverallData(processedData.overallData);
                setDimensionData(processedData.dimensionData);
                setThemeData(processedData.themeData);
            }
        } catch (err) {
            console.error('Error loading CSV data:', err);
            setError('Failed to load report data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        if (!reportData) {
            console.error('No report data available for download');
            return;
        }

        if (!reportData.csvMergedReportUrl) {
            alert('CSV report is not available for download');
            return;
        }

        try {
            setIsLoading(true);

            const link = document.createElement('a');
            if (process.env.NODE_ENV === 'development') {
                link.href = reportData.csvMergedReportUrl.replace('minio', 'localhost');
            } else {
                link.href = reportData.csvMergedReportUrl.replace('minio', process.env.MINIO_URL || 'minio.esg-ai.wankaew.com');
            }
            link.target = '_blank';
            const companyName = reportData.companyName || 'Unknown_Company';
            link.download = `${companyName.replace(/[^a-z0-9]/gi, '_')}_ESG_Report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to download report:', error);
            setError('Failed to download report. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadDetailedReport = async () => {
        if (!reportData) {
            console.error('No report data available for download');
            return;
        }

        if (!reportData.csvReportUrl) {
            alert('CSV report is not available for download');
            return;
        }

        try {
            setIsLoading(true);

            const link = document.createElement('a');
            if (process.env.NODE_ENV === 'development') {
                link.href = reportData.csvReportUrl.replace('minio', 'localhost');
            } else {
                link.href = reportData.csvReportUrl.replace('minio', process.env.MINIO_URL || 'minio.esg-ai.wankaew.com');
            }
            link.target = '_blank';
            const companyName = reportData.companyName || 'Unknown_Company';
            link.download = `${companyName.replace(/[^a-z0-9]/gi, '_')}_ESG_Report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to download report:', error);
            setError('Failed to download report. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetailedAnalysis = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading report data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 text-center">
                <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="mb-2 font-medium text-red-800">Error Loading Data</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={loadCSVData}
                        className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
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
                    disabled={isLoading || !reportData?.csvMergedReportUrl}
                    className="flex items-center justify-center px-6 py-3 space-x-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span>Download Report</span>
                </button>

                <button
                    onClick={handleDownloadDetailedReport}
                    disabled={isLoading || !reportData?.csvReportUrl}
                    className="flex items-center justify-center px-6 py-3 space-x-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span>Download Detailed Report</span>
                </button>

                <button
                    onClick={handleViewDetailedAnalysis}
                    disabled={isLoading}
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
