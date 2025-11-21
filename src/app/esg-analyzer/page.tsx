import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

import { ESGAnalyzerPage } from '@/features/esg-analyzer';

export default function ESGAnalyzer() {
    return (
        <ProtectedRoute>
            <ESGAnalyzerPage />
        </ProtectedRoute>
    );
}
