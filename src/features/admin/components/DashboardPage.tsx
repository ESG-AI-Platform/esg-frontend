"use client";

import { dashboardKPIs, esgDocuments, yearlyDocumentCounts, dataQualitySummary } from "../data/mock-data";

function KPIIcon({ name }: { name: string }) {
  const cls = "h-6 w-6";
  switch (name) {
    case "documents":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case "companies":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      );
    case "chart":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      );
    case "layers":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25-9.75 5.25-9.75-5.25 4.179-2.25" />
        </svg>
      );
    case "average":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      );
    default:
      return null;
  }
}

function getChangeColor(type?: string) {
  switch (type) {
    case "positive": return "text-emerald-600 bg-emerald-50";
    case "negative": return "text-red-600 bg-red-50";
    default: return "text-slate-600 bg-slate-100";
  }
}

function getIconBg(type?: string) {
  switch (type) {
    case "positive": return "bg-emerald-100 text-emerald-600";
    case "negative": return "bg-red-100 text-red-600";
    default: return "bg-blue-100 text-blue-600";
  }
}

export function DashboardPage() {
  const recentDocs = esgDocuments.slice(0, 5);
  const statusCounts = {
    complete: esgDocuments.filter((d) => d.status === "COMPLETE").length,
    processing: esgDocuments.filter((d) => d.status === "PROCESSING").length,
    failed: esgDocuments.filter((d) => d.status === "FAILED").length,
    queued: esgDocuments.filter((d) => d.status === "INQUEUE").length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">ESG Document Monitoring Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {dashboardKPIs.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getIconBg(kpi.changeType)}`}>
                <KPIIcon name={kpi.icon} />
              </div>
              {kpi.change && (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getChangeColor(kpi.changeType)}`}>
                  {kpi.change}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="mt-1 text-xs text-slate-500">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Documents */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Documents</h2>
            <a href="/admin/documents" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </a>
          </div>
          <div className="divide-y divide-slate-100">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{doc.companyName}</p>
                    <p className="text-xs text-slate-500">{doc.stockTicker} &middot; {doc.year}</p>
                  </div>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Status Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Status Breakdown</h2>
            <div className="space-y-3">
              <StatusBar label="Complete" count={statusCounts.complete} total={esgDocuments.length} color="bg-emerald-500" />
              <StatusBar label="Processing" count={statusCounts.processing} total={esgDocuments.length} color="bg-amber-500" />
              <StatusBar label="Failed" count={statusCounts.failed} total={esgDocuments.length} color="bg-red-500" />
              <StatusBar label="In Queue" count={statusCounts.queued} total={esgDocuments.length} color="bg-blue-500" />
            </div>
          </div>

          {/* Data Quality Quick View */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Data Quality</h2>
              <a href="/admin/data-quality" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Details
              </a>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <span className="text-lg font-bold text-amber-700">{dataQualitySummary.totalIssues}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Total Issues</p>
                <p className="text-xs text-slate-500">Detected across all records</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <QualityMini label="Duplicates" value={dataQualitySummary.duplicates} color="text-red-600" />
              <QualityMini label="Missing Data" value={dataQualitySummary.missingMetadata} color="text-amber-600" />
              <QualityMini label="Broken URLs" value={dataQualitySummary.brokenUrls} color="text-orange-600" />
              <QualityMini label="Abnormal Size" value={dataQualitySummary.abnormalSizes} color="text-slate-600" />
            </div>
          </div>

          {/* Yearly Trend Mini */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Yearly Submissions</h2>
            <div className="flex items-end gap-1.5 h-24">
              {yearlyDocumentCounts.map((item) => {
                const max = Math.max(...yearlyDocumentCounts.map((d) => d.count));
                const height = (item.count / max) * 100;
                return (
                  <div key={item.year} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                      title={`${item.year}: ${item.count}`}
                    />
                    <span className="text-[10px] text-slate-400">{String(item.year).slice(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETE: "bg-emerald-50 text-emerald-700",
    PROCESSING: "bg-amber-50 text-amber-700",
    FAILED: "bg-red-50 text-red-700",
    INQUEUE: "bg-blue-50 text-blue-700",
    CANCELLED: "bg-slate-100 text-slate-600",
  };
  const labels: Record<string, string> = {
    COMPLETE: "Complete",
    PROCESSING: "Processing",
    FAILED: "Failed",
    INQUEUE: "In Queue",
    CANCELLED: "Cancelled",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.CANCELLED}`}>
      {labels[status] || status}
    </span>
  );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-medium text-slate-900">{count}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function QualityMini({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
