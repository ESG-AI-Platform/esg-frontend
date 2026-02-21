"use client";

import { useState } from "react";

import { companyProfiles } from "../data/mock-data";

export function CompanyProfilePage() {
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const filtered = companyProfiles.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.stockTicker?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedCompany
    ? companyProfiles.find((c) => c.id === selectedCompany)
    : null;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Company Profiles</h1>
        <p className="mt-1 text-sm text-slate-500">
          View company information and ESG reporting timelines
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Company List */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filtered.map((company) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => setSelectedCompany(company.id)}
                  className={`w-full px-4 py-3.5 text-left transition-colors ${
                    selectedCompany === company.id
                      ? "bg-blue-50 border-l-2 border-l-blue-600"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${selectedCompany === company.id ? "text-blue-700" : "text-slate-900"}`}>
                        {company.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {company.stockTicker} &middot; {company.totalReports} reports
                      </p>
                    </div>
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-slate-400">
                  No companies found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Company Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <span className="text-lg font-bold">{selected.stockTicker?.slice(0, 2) || "CO"}</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
                      <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                        <span className="font-mono">{selected.stockTicker}</span>
                        {selected.url && (
                          <a
                            href={selected.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {selected.url.replace(/https?:\/\//, "")}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-slate-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900">{selected.totalReports}</p>
                    <p className="text-xs text-slate-500">Total Reports</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900">{selected.reportingYears.length}</p>
                    <p className="text-xs text-slate-500">Reporting Years</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {selected.reportingYears[0]}-{selected.reportingYears[selected.reportingYears.length - 1]}
                    </p>
                    <p className="text-xs text-slate-500">Year Range</p>
                  </div>
                </div>
              </div>

              {/* Reporting Timeline */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-slate-900">Reporting Timeline</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 12 }, (_, i) => 2014 + i).map((year) => {
                    const hasReport = selected.reportingYears.includes(year);
                    return (
                      <div
                        key={year}
                        className={`flex h-10 w-16 items-center justify-center rounded-lg text-xs font-medium ${
                          hasReport
                            ? "bg-blue-600 text-white"
                            : "border border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                      >
                        {year}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Report History */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h3 className="text-base font-semibold text-slate-900">Report History</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {selected.reports.length > 0 ? (
                    selected.reports.map((r) => (
                      <div key={r.id} className="flex items-center justify-between px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-xs font-medium text-slate-600">
                            {r.year}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{r.id}</p>
                            <p className="text-xs text-slate-500">{r.filesCount} file(s) &middot; {new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={r.status} />
                          {r.csvReportUrl && (
                            <button className="rounded p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Download">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-sm text-slate-400">
                      No report records in mock data for this company.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                <p className="mt-3 text-sm text-slate-500">Select a company to view details</p>
              </div>
            </div>
          )}
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
