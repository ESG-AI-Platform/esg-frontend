import Link from "next/link";

import { Button, Card } from "@/shared/components";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
            ESG Management Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
            Track, manage, and report on your Environmental, Social, and
            Governance metrics
          </p>
        </div>

        {/* Main ESG Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <Card title="ESG Analyzer">
            <p className="text-gray-600 mb-4">
              Analyze your ESG documents and generate comprehensive reports.
            </p>
            <Link href="/esg-analyzer">
              <Button variant="primary" className="w-full sm:w-auto">
                Start Analysis
              </Button>
            </Link>
          </Card>

          <Card title="ESG Reports">
            <p className="text-gray-600 mb-4">
              View and manage your ESG analysis reports with comprehensive insights.
            </p>
            <Link href="/esg-report">
              <Button variant="primary" className="w-full sm:w-auto">
                View Reports
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
