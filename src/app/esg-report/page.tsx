'use client';

import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

import { ESGReportPage } from '@/features/esg-report/components';

export default function ESGReportPageRoute() {
    return (
        <ProtectedRoute>
            <ESGReportPage />
        </ProtectedRoute>
    );
}
