'use client';

import { DimensionGapData } from '../../../types';

interface DimensionLegendProps {
    data: DimensionGapData[];
    colors: string[];
}

export function DimensionLegend({ data, colors }: DimensionLegendProps) {
    const getColorByPercentage = (percentage: number) => {
        if (percentage >= 80) return 'text-red-600';
        if (percentage >= 20) return 'text-yellow-600';
        return 'text-green-600';
    };

    const totalGaps = data.reduce((sum, dimension) => sum + dimension.gapCount, 0);

    const dimensionsWithColors = data.map((dimension, index) => ({
        ...dimension,
        percentage: totalGaps > 0 ? (dimension.gapCount / totalGaps) * 100 : 0,
        color: colors[index % colors.length],
    }));

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 sm:justify-center">
                {dimensionsWithColors.map((dimension, index) => (
                    <div key={`legend-${dimension.name}-${index}`} className="flex items-center justify-between sm:justify-start space-x-3 px-3 sm:px-4 py-2 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: dimension.color }}
                            />
                            <span className="text-sm font-medium text-gray-700">{dimension.name}</span>
                        </div>
                        <span className={`text-sm text-gray-500 flex-shrink-0 ${getColorByPercentage(dimension.percentage)}`}>
                            {dimension.gapCount} ({dimension.percentage.toFixed(1)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
