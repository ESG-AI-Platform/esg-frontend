'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { storage } from '@/shared/lib/storage';

import { useReport } from '@/features/esg-report/hooks/useReport';

import { ReportProvider } from '../context/ReportContext';
import { useReportStatus } from '../hooks/useAnalyzer';
import { ESGModule, ESGProcessDocumentsResponse } from '../types';

import { Analysis } from './Analysis';
import { DocumentUpload } from './DocumentUpload';
import { ResultsReports } from './ResultsReports';

function ESGAnalyzerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reportId = searchParams.get('reportId');
    const [activeModule, setActiveModule] = useState<ESGModule>('document-upload');
    const { data: reportData, isLoading: isReportLoading, refetch: refetchReport } = useReport(reportId);
    const { data: processingStatus } = useReportStatus(reportId || '', !!reportId);

    useEffect(() => {
        if (processingStatus?.status === 'COMPLETE' && activeModule === 'analysis') {
            setActiveModule('results-reports');
            refetchReport();
        }
    }, [processingStatus, activeModule, refetchReport]);

    const modules = [
        { id: 'document-upload', label: 'Document Upload' },
        { id: 'analysis', label: 'Analysis' },
        { id: 'results-reports', label: 'Results & Reports' }
    ] as const;

    const getAvailableModules = () => {
        if (!reportId) {
            return ['document-upload'];
        }

        if (!processingStatus) {
            const status = reportData?.status;
             if (status === 'COMPLETE') return ['document-upload', 'results-reports'];
            return ['document-upload', 'analysis'];
        }

        switch (processingStatus.status) {
            case 'COMPLETE':
                return ['document-upload', 'results-reports'];
            case 'PROCESSING':
            case 'INQUEUE':
                return ['document-upload', 'analysis'];
            case 'FAILED':
            case 'CANCELLED':
                return ['document-upload'];
            default:
                return ['document-upload'];
        }
    };

    const availableModules = getAvailableModules();

    const handleModuleChange = (moduleId: ESGModule) => {
        if (availableModules.includes(moduleId)) {
            setActiveModule(moduleId);
        }
    };

    const handleProcessingComplete = (newReport: ESGProcessDocumentsResponse) => {
        setActiveModule('analysis');
        if (newReport.estimatedTimeMinutes) {
            storage.setItem(`estimatedTime_${newReport.reportId}`, newReport.estimatedTimeMinutes.toString());
        }

        router.push(`/esg-analyzer?reportId=${newReport.reportId}`);
    };

    const renderActiveModule = () => {
        switch (activeModule) {
            case 'document-upload':
                return <DocumentUpload reportData={reportData || undefined} onProcessingComplete={handleProcessingComplete} />;
            case 'analysis':
                return <Analysis />;
            case 'results-reports':
                return <ResultsReports reportData={reportData} />;
            default:
                return <DocumentUpload reportData={reportData || undefined} onProcessingComplete={handleProcessingComplete} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Navigation */}
            <div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4 sm:py-6">
                        {/* Back to Reports Button */}
                        {reportData && (
                            <div className="mb-4">
                                <button
                                    onClick={() => router.push('/esg-report')}
                                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Reports
                                </button>
                            </div>
                        )}

                        {/* Report Title */}
                        {reportData && (
                            <div className="mb-4">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {reportData.companyName ? `${reportData.companyName} ESG Report` : 'ESG Report'}
                                </h1>
                                <p className="text-gray-600">
                                    {reportData.companyName} {reportData.year && `(${reportData.year})`}
                                </p>
                            </div>
                        )}

                        {/* Navigation Tabs */}
                        <nav className="flex justify-center">
                            <div className="inline-flex bg-gray-200 rounded-lg p-1 w-full max-w-7xl">
                                {modules.map((module) => {
                                    const isAvailable = availableModules.includes(module.id);
                                    return (
                                        <button
                                            key={module.id}
                                            onClick={() => handleModuleChange(module.id)}
                                            disabled={!isAvailable}
                                            className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${activeModule === module.id
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : isAvailable
                                                        ? 'text-gray-700 hover:text-gray-900 cursor-pointer'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <span className="hidden sm:inline">{module.label}</span>
                                            <span className="sm:hidden">
                                                {module.label.split(' ')[0]}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isReportLoading && reportId ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading report...</span>
                    </div>
                ) : (
                    renderActiveModule()
                )}
            </div>
        </div>
    );
}

export function ESGAnalyzerPage() {
    return (
        <ReportProvider>
            <ESGAnalyzerContent />
        </ReportProvider>
    );
}
