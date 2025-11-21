'use client';

import { OverallStatisticData } from '../../types';

import { OverallAnalyzedThemesCard, OverallGapAnalysisCard } from './overall-statistics';

interface OverallStatisticProps {
    data: OverallStatisticData;
}

export function OverallStatistic({ data }: OverallStatisticProps) {
    return (
        <div className="space-y-6">
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OverallGapAnalysisCard data={data.gapAnalysis} />
                    <OverallAnalyzedThemesCard data={data.analyzedThemes} />
                </div>
            </div>
        </div>
    );
}
