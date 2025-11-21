'use client';

import { Card } from '@/shared/components/Card';

import { ThemeGapData } from '../../../types';

interface ThemeGapAnalysisCardProps {
    data: ThemeGapData;
}

export function ThemeGapAnalysisCard({ data }: ThemeGapAnalysisCardProps) {
    const getColorByPercentage = (percentage: number) => {
        if (percentage >= 80) return 'text-red-600 bg-red-100';
        if (percentage >= 20) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">{data.name}</h4>
                    <p className="text-sm text-gray-500">
                        {data.gapCount} gaps from {data.totalGaps}
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getColorByPercentage(data.percentage)}`}>
                    {data.gapCount}/{data.totalGaps}
                </div>
            </div>
        </Card>
    );
}
