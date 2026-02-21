"use client";

import { useState } from "react";
import { dataQualitySummary, dataQualityIssues } from "../data/mock-data";

const severityStyles: Record<string, string> = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

const typeLabels: Record<string, string> = {
  duplicate: "Duplicate Entry",
  missing_metadata: "Missing Metadata",
  broken_url: "Broken URL",
  abnormal_size: "Abnormal File Size",
};

const typeIcons: Record<string, string> = {
  duplicate: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
  missing_metadata: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  broken_url: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.858a4.5 4.5 0 00-6.364-6.364L4.5 8.25",
  abnormal_size: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375",
};

export function DataQualityPage() {
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filtered = dataQualityIssues.filter((issue) => {
    const matchType = typeFilter === "ALL" || issue.type === typeFilter;
    const matchSeverity = severityFilter === "ALL" || issue.severity === severityFilter;
    return matchType && matchSeverity;
  });

  const summaryCards = [
    { label: "Total Issues", value: dataQualitySummary.totalIssues, color: "bg-slate-900 text-white", iconColor: "bg-slate-700" },
    { label: "Duplicates", value: dataQualitySummary.duplicates, color: "bg-red-50 text-red-900", iconColor: "bg-red-100" },
    { label: "Missing Metadata", value: dataQualitySummary.missingMetadata, color: "bg-amber-50 text-amber-900", iconColor: "bg-amber-100" },
    { label: "Broken URLs", value: dataQualitySummary.brokenUrls, color: "bg-orange-50 text-orange-900", iconColor: "bg-orange-100" },
    { label: "Abnormal Sizes", value: dataQualitySummary.abnormalSizes, color: "bg-slate-50 text-slate-900", iconColor: "bg-slate-200" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Data Quality Monitoring</h1>
        <p className="mt-1 text-sm text-slate-500">Detect and track quality issues across ESG document records</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <div key={card.label} className={`rounded-xl p-5 ${card.color}`}>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs opacity-80">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Types</option>
          <option value="duplicate">Duplicates</option>
          <option value="missing_metadata">Missing Metadata</option>
          <option value="broken_url">Broken URLs</option>
          <option value="abnormal_size">Abnormal Sizes</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div className="ml-auto text-xs text-slate-500">
          {filtered.length} issue{filtered.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filtered.map((issue) => (
          <div key={issue.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={typeIcons[issue.type] || typeIcons.missing_metadata} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-500">{typeLabels[issue.type]}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles[issue.severity]}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900">{issue.description}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span>Record: {issue.affectedRecord}</span>
                  <span>Detected: {new Date(issue.detectedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center">
            <svg className="mx-auto h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="mt-3 text-sm text-slate-500">No issues found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
