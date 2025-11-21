'use client';

import { DimensionGapData } from '../../../types';

interface DimensionPieChartProps {
    data: DimensionGapData[];
}

export function DimensionPieChart({ data }: DimensionPieChartProps) {
    const colors = [
        '#059669',
        '#dc2626',
        '#1c53c9ff',
    ];

    const totalGaps = data.reduce((sum, dimension) => sum + dimension.gapCount, 0);
    const dimensionsWithAngles = data.map((dimension, index) => ({
        ...dimension,
        percentage: totalGaps > 0 ? (dimension.gapCount / totalGaps) * 100 : 0,
        color: colors[index % colors.length],
    }));

    const radius = 60;
    const centerX = 75;
    const centerY = 75;

    let currentAngle = 0;
    const pathData = dimensionsWithAngles.map((dimension) => {
        const angle = (dimension.percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;

        const startX = centerX + radius * Math.cos(startAngleRad);
        const startY = centerY + radius * Math.sin(startAngleRad);
        const endX = centerX + radius * Math.cos(endAngleRad);
        const endY = centerY + radius * Math.sin(endAngleRad);

        const largeArcFlag = angle > 180 ? 1 : 0;
        const path = [
            `M ${centerX} ${centerY}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            'Z'
        ].join(' ');

        return {
            ...dimension,
            path,
            angle,
        };
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gap Distribution</h3>

            <div className="flex-1 flex items-center justify-center">
                {totalGaps > 0 ? (
                    <div className="flex flex-col items-center space-y-4">
                        {/* Pie Chart */}
                        <div className="relative">
                            <svg width="150" height="150" className="transform -rotate-90">
                                {pathData.map((dimension, index) => (
                                    <path
                                        key={`${dimension.name}-${index}`}
                                        d={dimension.path}
                                        fill={dimension.color}
                                        stroke="white"
                                        strokeWidth="2"
                                    />
                                ))}
                            </svg>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{totalGaps}</div>
                            <div className="text-sm text-gray-500">Total Gaps</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{totalGaps}</div>
                        <div className="text-sm text-gray-500">Total Gaps</div>
                    </div>
                )}
            </div>
        </div>
    );
}
