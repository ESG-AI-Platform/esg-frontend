"use client";

import { useState } from "react";

import { ftseDimensions } from "../data/mock-data";

const typeColors: Record<string, string> = {
  QUALITATIVE: "bg-blue-50 text-blue-700",
  QUANTITATIVE: "bg-emerald-50 text-emerald-700",
  QUALITATIVE_QUANTITATIVE: "bg-indigo-50 text-indigo-700",
  PERFORMANCE: "bg-amber-50 text-amber-700",
};

const typeLabels: Record<string, string> = {
  QUALITATIVE: "Qualitative",
  QUANTITATIVE: "Quantitative",
  QUALITATIVE_QUANTITATIVE: "Qual/Quant",
  PERFORMANCE: "Performance",
};

const symbolLabels: Record<string, string> = {
  NA: "N/A",
  S: "Subsector",
  P: "Performance",
  G: "Country",
};

const riskColors: Record<string, string> = {
  H: "bg-red-100 text-red-700",
  M: "bg-amber-100 text-amber-700",
  L: "bg-emerald-100 text-emerald-700",
  NA: "bg-slate-100 text-slate-500",
};

const riskLabels: Record<string, string> = {
  H: "High",
  M: "Medium",
  L: "Low",
  NA: "N/A",
};

const dimensionColors: Record<string, { bg: string; text: string; accent: string }> = {
  Environment: { bg: "bg-emerald-50", text: "text-emerald-800", accent: "border-emerald-200" },
  Social: { bg: "bg-blue-50", text: "text-blue-800", accent: "border-blue-200" },
  Governance: { bg: "bg-amber-50", text: "text-amber-800", accent: "border-amber-200" },
};

export function IndicatorsPage() {
  const [expandedDimension, setExpandedDimension] = useState<number | null>(1);
  const [expandedTheme, setExpandedTheme] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const totalIndicators = ftseDimensions.reduce(
    (sum, d) => sum + d.themes.reduce((ts, t) => ts + t.indicators.length, 0),
    0
  );
  const totalThemes = ftseDimensions.reduce((sum, d) => sum + d.themes.length, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FTSE Indicators</h1>
          <p className="mt-1 text-sm text-slate-500">
            {ftseDimensions.length} dimensions &middot; {totalThemes} themes &middot; {totalIndicators} indicators
          </p>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Dimension Accordion */}
      <div className="space-y-4">
        {ftseDimensions.map((dimension) => {
          const colors = dimensionColors[dimension.name] || dimensionColors.Environment;
          const isExpanded = expandedDimension === dimension.id;
          const indicatorCount = dimension.themes.reduce((sum, t) => sum + t.indicators.length, 0);

          return (
            <div key={dimension.id} className={`rounded-xl border ${colors.accent} overflow-hidden shadow-sm`}>
              {/* Dimension Header */}
              <button
                type="button"
                onClick={() => setExpandedDimension(isExpanded ? null : dimension.id)}
                className={`flex w-full items-center justify-between px-6 py-4 ${colors.bg} transition-colors hover:opacity-90`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.text} bg-white/60`}>
                    <DimensionIcon name={dimension.name} />
                  </div>
                  <div className="text-left">
                    <h2 className={`text-base font-semibold ${colors.text}`}>{dimension.name}</h2>
                    <p className="text-xs text-slate-500">
                      {dimension.nameLocal} &middot; {dimension.themes.length} themes &middot; {indicatorCount} indicators
                    </p>
                  </div>
                </div>
                <svg
                  className={`h-5 w-5 ${colors.text} transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Themes */}
              {isExpanded && (
                <div className="divide-y divide-slate-100 bg-white">
                  {dimension.themes.map((theme) => {
                    const isThemeExpanded = expandedTheme === theme.id;

                    // Filter indicators if searching
                    const filteredIndicators = searchQuery
                      ? theme.indicators.filter(
                          (ind) =>
                            ind.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ind.description?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      : theme.indicators;

                    if (searchQuery && filteredIndicators.length === 0) return null;

                    return (
                      <div key={theme.id}>
                        <button
                          type="button"
                          onClick={() => setExpandedTheme(isThemeExpanded ? null : theme.id)}
                          className="flex w-full items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-slate-300" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-slate-900">{theme.name}</p>
                              <p className="text-xs text-slate-500">{theme.nameLocal} &middot; {filteredIndicators.length} indicator(s)</p>
                            </div>
                          </div>
                          <svg
                            className={`h-4 w-4 text-slate-400 transition-transform ${isThemeExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>

                        {/* Indicators Table */}
                        {isThemeExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50/50">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="bg-slate-50">
                                    <th className="px-6 py-2.5 text-xs font-medium text-slate-500">Code</th>
                                    <th className="px-6 py-2.5 text-xs font-medium text-slate-500">Description</th>
                                    <th className="px-6 py-2.5 text-xs font-medium text-slate-500">Type</th>
                                    <th className="px-6 py-2.5 text-xs font-medium text-slate-500">Symbols</th>
                                    <th className="px-6 py-2.5 text-xs font-medium text-slate-500">Risk</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {filteredIndicators.map((indicator) => (
                                    <tr key={indicator.id} className="hover:bg-white transition-colors">
                                      <td className="px-6 py-3">
                                        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
                                          {indicator.code}
                                        </span>
                                      </td>
                                      <td className="px-6 py-3 text-sm text-slate-900">{indicator.description}</td>
                                      <td className="px-6 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[indicator.indicatorType]}`}>
                                          {typeLabels[indicator.indicatorType]}
                                        </span>
                                      </td>
                                      <td className="px-6 py-3">
                                        <div className="flex flex-wrap gap-1">
                                          {indicator.indicatorSymbols.map((s, i) => (
                                            <span
                                              key={i}
                                              className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
                                              title={symbolLabels[s]}
                                            >
                                              {s}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="px-6 py-3">
                                        <div className="flex flex-wrap gap-1">
                                          {indicator.riskLevels.map((r, i) => (
                                            <span
                                              key={i}
                                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${riskColors[r]}`}
                                            >
                                              {riskLabels[r]}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DimensionIcon({ name }: { name: string }) {
  const cls = "h-5 w-5";
  switch (name) {
    case "Environment":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438a2.25 2.25 0 01-1.228 2.446L10.5 21l-.652-.174" />
        </svg>
      );
    case "Social":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    case "Governance":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      );
    default:
      return null;
  }
}
