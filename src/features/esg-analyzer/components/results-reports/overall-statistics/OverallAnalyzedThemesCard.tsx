'use client';

import { Card } from '@/shared/components/Card';

import { OverallAnalyzedThemesData } from '../../../types';

interface OverallAnalyzedThemesCardProps {
    data: OverallAnalyzedThemesData;
}

export function OverallAnalyzedThemesCard({ data }: OverallAnalyzedThemesCardProps) {
    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                        {data.analyzedThemeCount}
                    </div>
                    <p className="text-sm text-gray-500">Analyzed Theme</p>
                </div>
            </div>
        </Card>
    );
}
