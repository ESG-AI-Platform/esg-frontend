'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { notifyError } from '@/shared/lib/notify-error';
import { storage } from '@/shared/lib/storage';

import { esgAnalyzerService } from '../services';
import { ESGProcessDocumentsStatusResponse } from '../types';

export function Analysis() {
    const searchParams = useSearchParams();
    const reportId = searchParams.get('reportId');
    const [statusData, setStatusData] = useState<ESGProcessDocumentsStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState<number | null>(null);

    const getStoredEstimatedTime = (reportId: string): number | null => {
        const stored = storage.getItem(`estimatedTime_${reportId}`);
        return stored ? parseInt(stored, 10) : null;
    };

    const removeStoredEstimatedTime = (reportId: string): void => {
        storage.removeItem(`estimatedTime_${reportId}`);
    };

    useEffect(() => {
        if (reportId) {
            const storedEstimatedTime = getStoredEstimatedTime(reportId);
            if (storedEstimatedTime) {
                setEstimatedTimeMinutes(storedEstimatedTime);
            }
        }
    }, [reportId]);

    useEffect(() => {
        if (!reportId) {
            toast.error('No report ID provided');
            setHasError(true);
            setIsLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                const response = await esgAnalyzerService.getProcessedReportsStatus(reportId);
                setStatusData(response);
                setHasError(false);

                if (response.status === 'COMPLETE' && reportId) {
                    removeStoredEstimatedTime(reportId);
                    setEstimatedTimeMinutes(null);
                }
            } catch (err) {
                notifyError(err, {
                    context: 'fetchProcessingStatus',
                    userMessage: 'Failed to retrieve analysis status',
                });
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();

        const pollInterval = setInterval(() => {
            if (statusData?.status === 'PROCESSING' || statusData?.status === 'INQUEUE') {
                fetchStatus();
            }
        }, 10000);

        return () => clearInterval(pollInterval);
    }, [reportId, statusData?.status]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600">Loading analysis status...</span>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">Something went wrong.</p>
            </div>
        );
    }

    if (!statusData) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600">No processing data available</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'INQUEUE':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'PROCESSING':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'COMPLETE':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'FAILED':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'CANCELLED':
                return 'text-gray-600 bg-gray-50 border-gray-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'INQUEUE':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'PROCESSING':
                return <LoadingSpinner size="sm" className="text-blue-600" />;
            case 'COMPLETE':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'FAILED':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const progress = statusData.progress || 0;
    const progressBarWidth = `${Math.min(progress, 100)}%`;
    const progressPercentage = Math.round(progress);

    const getCurrentlyAnalyzingFile = () => {
        const totalFiles = statusData.documentInputName?.length || 1;

        for (let i = 0; i < totalFiles; i++) {
            const fileThreshold = ((i + 1) / totalFiles) * 100;
            if (progress < fileThreshold) {
                return {
                    currentFileIndex: i,
                    currentFileName: statusData.documentInputName?.[i] || 'Unknown file'
                };
            }
        }

        return {
            currentFileIndex: totalFiles - 1,
            currentFileName: statusData.documentInputName?.[totalFiles - 1] || 'Unknown file'
        };
    };

    const { currentFileIndex, currentFileName } = getCurrentlyAnalyzingFile();

    const getEstimatedTimeRemaining = () => {
        const estimatedMinutes = statusData.estimatedTimeMinutes || estimatedTimeMinutes;

        if (!estimatedMinutes || statusData.status === 'COMPLETE') {
            return null;
        }

        const totalMinutes = estimatedMinutes;
        const progressPercent = progress / 100;
        const remainingMinutes = Math.max(0, totalMinutes * (1 - progressPercent));

        if (remainingMinutes < 1) {
            return 'Less than 1 minute';
        } else if (remainingMinutes < 60) {
            return `${Math.round(remainingMinutes)} minute${Math.round(remainingMinutes) !== 1 ? 's' : ''}`;
        } else {
            const hours = Math.floor(remainingMinutes / 60);
            const minutes = Math.round(remainingMinutes % 60);
            return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
        }
    };

    const estimatedTimeRemaining = getEstimatedTimeRemaining();

    const getEstimatedCompletionTime = () => {
        const estimatedMinutes = statusData.estimatedTimeMinutes || estimatedTimeMinutes;

        if (!estimatedMinutes || statusData.status === 'COMPLETE') {
            return null;
        }

        const progressPercent = progress / 100;
        const remainingMinutes = Math.max(0, estimatedMinutes * (1 - progressPercent));

        const completionTime = new Date(Date.now() + remainingMinutes * 60 * 1000);
        return completionTime.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const estimatedCompletionTime = getEstimatedCompletionTime();

    return (
        <div className="space-y-6">
            {/* Status Header */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">ESG Analysis Progress</h2>
                    <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor(statusData.status || 'INQUEUE')}`}>
                        {getStatusIcon(statusData.status || 'INQUEUE')}
                        <span className="ml-2 text-sm font-medium">
                            {statusData.status || 'INQUEUE'}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ease-out ${statusData.status === 'COMPLETE' ? 'bg-green-600' : 'bg-blue-600'
                                }`}
                            style={{ width: progressBarWidth }}
                        ></div>
                    </div>
                    {(estimatedTimeRemaining || estimatedCompletionTime) && (
                        <div className="mt-2 space-y-1">
                            {estimatedTimeRemaining && (
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Time remaining:</span> {estimatedTimeRemaining}
                                </div>
                            )}
                            {estimatedCompletionTime && (
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Expected completion:</span> {estimatedCompletionTime}
                                </div>
                            )}
                        </div>
                    )}
                    {statusData.status === 'PROCESSING' && (
                        <div className="mt-2 text-sm text-blue-600">
                            <span className="font-medium">Currently analyzing:</span> {currentFileName}
                        </div>
                    )}
                </div>
            </div>

            {/* Processing Details */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Details</h3>

                {/* Processing Steps */}
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Processing Steps</h4>
                    <div className="space-y-3">
                        {/* Step 1: Document Upload */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-3 text-sm text-gray-700">Document Upload Complete</span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${statusData.status === 'PROCESSING' ? 'bg-blue-100'
                                : statusData.status === 'COMPLETE' ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                {statusData.status === 'PROCESSING' ? (
                                    <LoadingSpinner size="sm" className="text-blue-600" />
                                ) : statusData.status === 'COMPLETE' ? (
                                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                )}
                            </div>
                            <span className="ml-3 text-sm text-gray-700">
                                ESG Analysis {statusData.status === 'COMPLETE' ? 'Complete' : 'In Progress'}
                            </span>
                        </div>

                        {/* Step 3: Report Generation */}
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${statusData.status === 'COMPLETE' ? 'bg-blue-100' : 'bg-gray-100'
                                }`}>
                                {statusData.status === 'COMPLETE' ? (
                                    <LoadingSpinner size="sm" className="text-blue-600" />
                                ) : (
                                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                )}
                            </div>
                            <span className="ml-3 text-sm text-gray-700">
                                Report Generation {statusData.status === 'COMPLETE' ? 'In Progress' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Documents ({statusData.documentInputName?.length || 0})</h4>
                    <div className="space-y-2">
                        {statusData.documentInputName?.map((fileName, index) => {
                            const fileThreshold = ((index + 1) / (statusData.documentInputName?.length || 1)) * 100;
                            const isComplete = progress >= fileThreshold;
                            const isProcessing = statusData.status === 'PROCESSING' &&
                                index === currentFileIndex &&
                                !isComplete;

                            return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-900">{fileName}</span>
                                    </div>
                                    <div className="flex items-center">
                                        {isComplete ? (
                                            <>
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-xs text-gray-500 ml-1">Complete</span>
                                            </>
                                        ) : isProcessing ? (
                                            <>
                                                <LoadingSpinner size="sm" className="text-blue-600" />
                                                <span className="text-xs text-gray-500 ml-1">Processing</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                                <span className="text-xs text-gray-500 ml-1">Pending</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
