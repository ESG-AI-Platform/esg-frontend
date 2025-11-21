'use client';

import { IndicatorQuestionCode } from '../../../types';

interface QuestionCodeItemProps {
    questionCode: IndicatorQuestionCode;
}

export function QuestionCodeItem({ questionCode }: QuestionCodeItemProps) {
    return (
        <div className="bg-white rounded border p-2">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="font-medium text-gray-900 text-xs">
                        {questionCode.code}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                        {questionCode.question}
                    </div>
                    {questionCode.hasGap ? (
                        <div className="text-xs text-red-600 mt-1 italic">
                            Gap: Information not found in documents
                        </div>
                    ) : (
                        questionCode.source.length > 0 && (
                            <div className="text-xs text-green-600 mt-1">
                                <span className="font-medium">
                                    Source{questionCode.source.length > 1 ? 's' : ''}:
                                </span>
                                <div className="space-y-1 mt-1">
                                    {questionCode.source.map((src, index) => (
                                        <div key={index} className="pl-2 border-l-2 border-green-200">
                                            <div className="text-xs text-green-700">
                                                {src.source_text}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {src.source_file} (Page {src.page_number})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
                <div className="ml-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${questionCode.hasGap
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {questionCode.hasGap ? 'Gap' : 'OK'}
                    </span>
                </div>
            </div>
        </div>
    );
}
