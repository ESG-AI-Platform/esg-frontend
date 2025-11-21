'use client';

import { useState } from 'react';

import { ThemeGapData } from '../../types';

import { ThemeGapAnalysisCard } from './theme/ThemeGapAnalysisCard';

interface AnalyzedThemesProportionalGapProps {
    data: ThemeGapData[];
    title?: string;
    description?: string;
}

export function AnalyzedThemesProportionalGap({
    data,
    title = "ESG Analyzed Themes",
    description = "Detailed breakdown of all analyzed themes"
}: AnalyzedThemesProportionalGapProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 3 แถว x 2 การ์ดต่อแถว = 6 การ์ดต่อหน้า

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-600 mt-2">{description}</p>
                {data.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                        Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} themes
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentData.map((theme, index) => (
                    <ThemeGapAnalysisCard
                        key={`theme-${startIndex + index}-${theme.name}`}
                        data={theme}
                    />
                ))}
            </div>

            {data.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No theme data available</p>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>

                    <div className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            )}
        </div>
    );
}
