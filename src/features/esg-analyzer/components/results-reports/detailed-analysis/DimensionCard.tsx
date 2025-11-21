'use client';

import { DimensionGapData, ThemeGapData } from '../../../types';

import { ThemeCard } from './ThemeCard';

interface DimensionCardProps {
    dimension: string;
    themes: ThemeGapData[];
    dimensionData?: DimensionGapData;
    isExpanded: boolean;
    expandedThemes: string[];
    expandedIndicators: string[];
    onToggleDimension: (dimension: string) => void;
    onToggleTheme: (themeId: string) => void;
    onToggleIndicator: (indicatorId: string) => void;
}

export function DimensionCard({
    dimension,
    themes,
    dimensionData,
    isExpanded,
    expandedThemes,
    expandedIndicators,
    onToggleDimension,
    onToggleTheme,
    onToggleIndicator
}: DimensionCardProps) {
    return (
        <div className="border rounded-lg">
            {/* Dimension Header */}
            <button
                onClick={() => onToggleDimension(dimension)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center space-x-4">
                    <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">{dimension}</h3>
                        {dimensionData && (
                            <p className={`text-sm ${100 - dimensionData.percentage == 100 ? 'text-green-800' : 
                                100 - dimensionData.percentage >= 40 ? 'text-yellow-800' : 'text-red-800'}`}>
                                {dimensionData.totalGaps - dimensionData.gapCount} no gaps out of {dimensionData.totalGaps} total
                            </p>
                        )}
                    </div>
                </div>
                <svg
                    className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Themes List */}
            {isExpanded && (
                <div className="border-t bg-gray-50 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Themes in {dimension}:</h4>
                    <div className="space-y-3">
                        {themes.map((theme) => (
                            <ThemeCard
                                key={theme.name}
                                theme={theme}
                                dimension={dimension}
                                isExpanded={expandedThemes.includes(`${dimension}-${theme.name}`)}
                                expandedIndicators={expandedIndicators}
                                onToggleTheme={onToggleTheme}
                                onToggleIndicator={onToggleIndicator}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
