'use client';

import { IndicatorData } from '../../../types';

import { QuestionCodeItem } from './QuestionCodeItem';

interface IndicatorCardProps {
    indicator: IndicatorData;
    isExpanded: boolean;
    onToggle: (indicatorId: string) => void;
}

export function IndicatorCard({ indicator, isExpanded, onToggle }: IndicatorCardProps) {
    return (
        <div className="bg-white rounded border">
            {/* Indicator Header */}
            <button
                onClick={() => onToggle(indicator.id)}
                className="w-full p-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 text-sm">
                        {indicator.id} - {indicator.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                        {indicator.description}
                    </div>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${100 - indicator.percentage == 100 ? 'bg-green-100 text-green-800' :
                        100 - indicator.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {indicator.totalQuestions - indicator.gapCount}/{indicator.totalQuestions} No Gaps
                    </span>
                    <svg
                        className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Question Codes List */}
            {isExpanded && (
                <div className="border-t bg-gray-50 p-2">
                    <h6 className="font-medium text-gray-800 mb-2 text-xs">Question Codes:</h6>
                    <div className="space-y-1">
                        {indicator.questionCodes.map((questionCode) => (
                            <QuestionCodeItem
                                key={questionCode.code}
                                questionCode={questionCode}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
