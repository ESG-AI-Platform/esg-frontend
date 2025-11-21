'use client';

import { ThemeGapData } from '../../../types';

import { IndicatorCard } from './IndicatorCard';

interface ThemeCardProps {
    theme: ThemeGapData;
    dimension: string;
    isExpanded: boolean;
    expandedIndicators: string[];
    onToggleTheme: (themeId: string) => void;
    onToggleIndicator: (indicatorId: string) => void;
}

export function ThemeCard({
    theme,
    dimension,
    isExpanded,
    expandedIndicators,
    onToggleTheme,
    onToggleIndicator
}: ThemeCardProps) {
    const themeId = `${dimension}-${theme.name}`;

    return (
        <div className="bg-white rounded border">
            {/* Theme Header */}
            <button
                onClick={() => onToggleTheme(themeId)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-gray-900">{theme.name}</span>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-sm rounded-full ${100 - theme.percentage == 100 ? 'bg-green-100 text-green-800' :
                            100 - theme.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {theme.totalGaps - theme.gapCount}/{theme.totalGaps} No Gaps
                        </span>
                        <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Indicators List */}
            {isExpanded && theme.indicators && (
                <div className="border-t bg-gray-25 p-3">
                    <h5 className="font-medium text-gray-800 mb-2 text-sm">Indicators:</h5>
                    <div className="space-y-2">
                        {theme.indicators.map((indicator) => (
                            <IndicatorCard
                                key={indicator.id}
                                indicator={indicator}
                                isExpanded={expandedIndicators.includes(indicator.id)}
                                onToggle={onToggleIndicator}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
