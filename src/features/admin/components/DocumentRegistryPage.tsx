"use client";

import { useState, useMemo } from "react";
import { esgDocuments } from "../data/mock-data";

const PAGE_SIZE = 8;

export function DocumentRegistryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const years = useMemo(
    () => [...new Set(esgDocuments.map((d) => d.year))].sort((a, b) => b - a),
    []
  );

  const filtered = useMemo(() => {
    return esgDocuments.filter((doc) => {
      const matchesSearch =
        search === "" ||
        doc.companyName.toLowerCase().includes(search.toLowerCase()) ||
        doc.stockTicker?.toLowerCase().includes(search.toLowerCase()) ||
        doc.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;
      const matchesYear = yearFilter === "ALL" || doc.year === Number(yearFilter);
      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [search, statusFilter, yearFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      COMPLETE: "bg-emerald-50 text-emerald-700",
      PROCESSING: "bg-amber-50 text-amber-700",
      FAILED: "bg-red-50 text-red-700",
      INQUEUE: "bg-blue-50 text-blue-700",
      CANCELLED: "bg-slate-100 text-slate-600",
    };
    return styles[status] || styles.CANCELLED;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      COMPLETE: "Complete",
      PROCESSING: "Processing",
      FAILED: "Failed",
      INQUEUE: "In Queue",
      CANCELLED: "Cancelled",
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ESG Document Registry</h1>
          <p className="mt-1 text-sm text-slate-500">
            {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by company, ticker, or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLETE">Complete</option>
          <option value="PROCESSING">Processing</option>
          <option value="INQUEUE">In Queue</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={yearFilter}
          onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 font-medium text-slate-500">Company</th>
                <th className="px-6 py-3 font-medium text-slate-500">Ticker</th>
                <th className="px-6 py-3 font-medium text-slate-500">Year</th>
                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                <th className="px-6 py-3 font-medium text-slate-500">Files</th>
                <th className="px-6 py-3 font-medium text-slate-500">Submitted By</th>
                <th className="px-6 py-3 font-medium text-slate-500">Date</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{doc.companyName}</p>
                      <p className="text-xs text-slate-400">{doc.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{doc.stockTicker || "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{doc.year}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(doc.status)}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.filesCount}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{doc.submittedBy}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {doc.csvReportUrl && (
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors" title="Download CSV">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </button>
                      )}
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="View details">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">
                    No documents found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    p === page ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
