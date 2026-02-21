"use client";

import {
  yearlyDocumentCounts,
  yearlyCompanyCounts,
  growthRates,
  continuousReporting,
} from "../data/mock-data";

export function AnalyticsPage() {
  const maxDocs = Math.max(...yearlyDocumentCounts.map((d) => d.count));
  const maxCompanies = Math.max(...yearlyCompanyCounts.map((d) => d.totalCompanies));
  const maxGrowth = Math.max(...growthRates.map((d) => Math.abs(d.rate)));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Reporting Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">ESG reporting trends and growth analysis</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Documents per Year */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-slate-900">Documents per Year</h2>
          <p className="mb-6 text-xs text-slate-500">Total ESG documents submitted each year</p>
          <div className="flex items-end gap-3 h-48">
            {yearlyDocumentCounts.map((item) => {
              const height = (item.count / maxDocs) * 100;
              return (
                <div key={item.year} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">{item.count}</span>
                  <div
                    className="w-full rounded-t-md bg-blue-500 hover:bg-blue-600 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-slate-500">{item.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Companies per Year */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-slate-900">Companies per Year</h2>
          <p className="mb-6 text-xs text-slate-500">New and cumulative companies reporting ESG</p>
          <div className="flex items-end gap-3 h-48">
            {yearlyCompanyCounts.map((item) => {
              const totalHeight = (item.totalCompanies / maxCompanies) * 100;
              const newHeight = (item.newCompanies / maxCompanies) * 100;
              return (
                <div key={item.year} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">{item.totalCompanies}</span>
                  <div className="relative w-full" style={{ height: `${totalHeight}%` }}>
                    <div className="absolute bottom-0 w-full rounded-t-md bg-slate-200" style={{ height: "100%" }} />
                    <div
                      className="absolute bottom-0 w-full rounded-t-md bg-emerald-500"
                      style={{ height: `${(newHeight / totalHeight) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{item.year}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              New companies
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-200" />
              Cumulative total
            </div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-slate-900">ESG Reporting Growth Rate</h2>
          <p className="mb-6 text-xs text-slate-500">Year-over-year percentage change in document submissions</p>
          <div className="space-y-3">
            {growthRates.map((item) => {
              const width = (Math.abs(item.rate) / maxGrowth) * 100;
              const isPositive = item.rate >= 0;
              return (
                <div key={item.year} className="flex items-center gap-3">
                  <span className="w-10 text-xs font-medium text-slate-600">{item.year}</span>
                  <div className="flex-1">
                    <div className="relative h-6 w-full rounded bg-slate-100">
                      <div
                        className={`h-6 rounded ${isPositive ? "bg-emerald-500" : "bg-red-400"}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                  <span className={`w-16 text-right text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                    {isPositive ? "+" : ""}{item.rate}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continuous Reporting */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-slate-900">Continuous Reporting</h2>
          <p className="mb-6 text-xs text-slate-500">Companies with consecutive years of ESG reporting</p>
          <div className="space-y-4">
            {continuousReporting.slice(0, 6).map((company, idx) => (
              <div key={company.companyName} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{company.companyName}</p>
                  <p className="text-xs text-slate-500">
                    {company.years[0]} - {company.years[company.years.length - 1]}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1">
                  <span className="text-xs font-bold text-blue-700">{company.consecutiveYears}</span>
                  <span className="text-xs text-blue-600">yrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
