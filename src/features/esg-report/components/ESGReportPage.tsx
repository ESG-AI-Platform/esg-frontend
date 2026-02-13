'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { ReportListSkeleton } from '@/shared/components/Skeleton';
import { notifyError } from '@/shared/lib/notify-error';
import { normalizeStorageUrl } from '@/shared/lib/storage-url';


import { esgReportService } from '../services';
import { ESGReportSummary } from '../types';

export function ESGReportPage() {
    const router = useRouter();
    const [reports, setReports] = useState<ESGReportSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setLoading(true);
        setLoadFailed(false);
        try {
            const reportsSummary = await esgReportService.getReportsSummary();
            setReports(reportsSummary);
        } catch (error) {
            notifyError(error, {
                context: 'loadReports',
                userMessage: 'Failed to load reports. Please try again.',
            });
            setLoadFailed(true);
        } finally {
            setLoading(false);
        }
    };

    const handleReportClick = (reportId: string) => {
        router.push(`/esg-analyzer?reportId=${reportId}`);
    };

    const handleDownloadReport = (reportId: string, event: React.MouseEvent) => {
        event.stopPropagation();

        try {
            const report = reports.find(r => r.id === reportId);
            if (!report) {
                toast.error('Report not found');
                return;
            }

            if (!report.csvReportUrl) {
                toast.error('CSV report is not available for download');
                return;
            }

            const link = document.createElement('a');
            link.href = normalizeStorageUrl(report.csvReportUrl);
            link.target = '_blank';
            const companyName = report.companyName || 'Unknown_Company';
            link.download = `${companyName.replace(/[^a-z0-9]/gi, '_')}_ESG_Report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            notifyError(error, {
                context: 'downloadReport',
                userMessage: 'Failed to download report',
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETE': return 'bg-green-100 text-green-800';
            case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
            case 'FAILED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'COMPLETE': return 'Complete';
            case 'PROCESSING': return 'Processing';
            case 'FAILED': return 'Failed';
            case 'CANCELLED': return 'Cancelled';
            case 'INQUEUE': return 'In Queue';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return <ReportListSkeleton />;
    }

    if (loadFailed) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="mb-4 text-gray-600">Could not load reports.</p>
                    <button
                        onClick={loadReports}
                        className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">ESG Reports</h1>
                                <p className="mt-1 text-gray-600">
                                    View and manage your ESG analysis reports
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={loadReports}
                                    className="flex items-center px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </button>
                                <button
                                    onClick={() => router.push('/esg-analyzer')}
                                    className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Create New Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {reports.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="mb-4 text-lg text-gray-500">No ESG reports found</div>
                        <p className="mb-8 text-gray-400">
                            Create your first ESG analysis report to get started
                        </p>
                        <button
                            onClick={() => router.push('/esg-analyzer')}
                            className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Create Your First Report
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden overflow-hidden bg-white rounded-lg shadow-sm md:block">
                            {/* Table Header */}
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                                    <div className="col-span-4">Report ID</div>
                                    <div className="col-span-2">Company</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-1">Files</div>
                                    <div className="col-span-1">Download</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="px-6 py-4 transition-colors cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleReportClick(report.id)}
                                    >
                                        <div className="grid items-center grid-cols-12 gap-4">
                                            {/* Report ID */}
                                            <div className="col-span-4">
                                                <h3 className="mb-1 text-sm font-medium text-gray-900">
                                                    {report.id}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    Created: {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Company */}
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-900">
                                                    {report.companyName}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-2">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                    {getStatusText(report.status)}
                                                </span>
                                            </div>

                                            {/* Files Count */}
                                            <div className="col-span-1">
                                                <span className="text-sm text-gray-500">
                                                    {report.filesCount}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex justify-center col-span-1">
                                                <button
                                                    onClick={(e) => handleDownloadReport(report.id, e)}
                                                    className="inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 rounded-full hover:text-white hover:bg-blue-500 group"
                                                    title="Download report"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="space-y-4 md:hidden">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md"
                                    onClick={() => handleReportClick(report.id)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="mb-1 text-base font-medium text-gray-900">
                                                {report.id}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {report.companyName}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDownloadReport(report.id, e)}
                                            className="p-1 ml-2 text-gray-400 transition-colors hover:text-blue-500"
                                            title="Download report"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                            {getStatusText(report.status)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {report.filesCount} file{report.filesCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    <div className="space-y-1 text-xs text-gray-500">
                                        <div>Created: {new Date(report.createdAt).toLocaleDateString()}</div>
                                        <div>Updated: {new Date(report.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
