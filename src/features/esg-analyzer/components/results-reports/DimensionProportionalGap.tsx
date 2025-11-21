'use client';

import { DimensionGapData } from '../../types';

import { DimensionGapAnalysisCard } from './dimension/DimensionGapAnalysisCard';
import { DimensionLegend } from './dimension/DimensionLegend';
import { DimensionPieChart } from './dimension/DimensionPieChart';

interface DimensionProportionalGapProps {
    data: DimensionGapData[];
    title?: string;
    description?: string;
}

export function DimensionProportionalGap({
    data,
    title = "ESG Dimensional Breakdown",
    description = "Performance across ESG dimensions"
}: DimensionProportionalGapProps) {
    const colors = [
        '#059669', // green
        '#dc2626', // red
        '#1c53c9ff', // blue
    ];

    return (
        <div className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm sm:text-base text-gray-600 mt-2">{description}</p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
                {/* Left Column - Dimension Cards */}
                <div className="space-y-3 sm:space-y-4">
                    {data.map((dimension, index) => (
                        <DimensionGapAnalysisCard
                            key={`dimension-${index}-${dimension.name}`}
                            data={dimension}
                        />
                    ))}

                    {data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No dimensional data available</p>
                        </div>
                    )}
                </div>

                {/* Right Column - Pie Chart */}
                <div className="flex justify-center order-first lg:order-last">
                    {data.length > 0 && (
                        <div className="w-full max-w-sm lg:max-w-none">
                            <DimensionPieChart data={data} />
                        </div>
                    )}
                </div>
            </div>

            {/* Legend Section */}
            {data.length > 0 && (
                <DimensionLegend data={data} colors={colors} />
            )}
        </div>
    );
}
