'use client';

import { Card } from '@/shared/components/Card';

import { OverallGapAnalysisData } from '../../../types';

interface OverallGapAnalysisCardProps {
    data: OverallGapAnalysisData;
}

export function OverallGapAnalysisCard({ data }: OverallGapAnalysisCardProps) {
    const gapPercentage = data.totalQuestionCodes > 0
        ? Math.round((data.gapCount / data.totalQuestionCodes) * 100)
        : 0;
    
    const noGapPercentage = 100 - gapPercentage;

    const getNoGapColor = (percentage: number) => {
        if (percentage <= 39) return 'text-red-600';
        if (percentage <= 79) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Gap Analysis</h3>
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${getNoGapColor(noGapPercentage)}`}>
                                {noGapPercentage}%
                            </div>
                            <p className="text-sm text-gray-500">No Gap</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-sm font-medium text-gray-700">Gap Count</p>
                            <p className="text-2xl font-bold text-red-600">{data.gapCount}</p>
                            <p className="text-xs text-gray-500">Questions with gaps</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm font-medium text-gray-700">Analyzed Indicator</p>
                            <p className="text-2xl font-bold text-blue-600">{data.totalIndicators}</p>
                            <p className="text-xs text-gray-500">Unique indicators</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm font-medium text-gray-700">Analyzed Question</p>
                            <p className="text-2xl font-bold text-gray-900">{data.totalQuestionCodes}</p>
                            <p className="text-xs text-gray-500">Total question codes</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
