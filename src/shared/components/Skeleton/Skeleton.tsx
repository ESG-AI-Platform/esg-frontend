'use client';

import React from 'react';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

interface SkeletonProps {
    className?: string;
}

/** Animated placeholder bar. Base primitive for all skeleton compositions. */
export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded bg-gray-200 ${className}`}
            aria-hidden="true"
        />
    );
}

/** Circular placeholder used for avatars and chart areas. */
export function SkeletonCircle({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-full bg-gray-200 ${className}`}
            aria-hidden="true"
        />
    );
}

// ---------------------------------------------------------------------------
// Page-level compositions
// ---------------------------------------------------------------------------

/** Placeholder for the two-card `OverallStatistic` section. */
export function OverallStatisticSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Gap Analysis Card */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <Skeleton className="mb-4 h-5 w-40" />
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-44" />
                    </div>
                </div>

                {/* Analyzed Themes Card */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <Skeleton className="mb-4 h-5 w-40" />
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Placeholder for the `DimensionProportionalGap` panel (cards + pie chart). */
export function DimensionSkeleton() {
    return (
        <div className="space-y-6 rounded-lg bg-white p-4 shadow-md sm:p-6">
            <div>
                <Skeleton className="h-7 w-64" />
                <Skeleton className="mt-2 h-4 w-80" />
            </div>

            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
                {/* Dimension cards */}
                <div className="space-y-3 sm:space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="mt-3 h-2 w-full rounded-full" />
                        </div>
                    ))}
                </div>

                {/* Pie chart placeholder */}
                <div className="flex items-center justify-center order-first lg:order-last">
                    <SkeletonCircle className="h-48 w-48" />
                </div>
            </div>
        </div>
    );
}

/** Placeholder for the `AnalyzedThemesProportionalGap` grid. */
export function ThemesSkeleton() {
    return (
        <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
            <div>
                <Skeleton className="h-7 w-56" />
                <Skeleton className="mt-2 h-4 w-72" />
                <Skeleton className="mt-1 h-3 w-44" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-5 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                        <div className="mt-3 flex justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Full-page skeleton for the `ResultsReports` view.
 * Mirrors the statistics + dimension/theme grid + action-button layout.
 */
export function ResultsReportsSkeleton() {
    return (
        <div className="pb-8 space-y-8" role="status" aria-label="Loading report data">
            <span className="sr-only">Loading report data…</span>

            {/* Overall Statistics */}
            <OverallStatisticSkeleton />

            {/* Dimension & Themes side by side */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                <DimensionSkeleton />
                <ThemesSkeleton />
            </div>

            {/* Action button placeholders */}
            <div className="flex flex-col justify-center gap-4 border-t pt-6 sm:flex-row">
                <Skeleton className="h-12 w-48 rounded-lg" />
                <Skeleton className="h-12 w-56 rounded-lg" />
                <Skeleton className="h-12 w-52 rounded-lg" />
            </div>
        </div>
    );
}

/** Full-page skeleton for the ESG report list table. */
export function ReportListSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50" role="status" aria-label="Loading reports">
            <span className="sr-only">Loading reports…</span>

            {/* Header skeleton */}
            <div className="bg-white shadow-sm">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Skeleton className="h-8 w-40" />
                            <Skeleton className="mt-2 h-4 w-64" />
                        </div>
                        <div className="flex space-x-3">
                            <Skeleton className="h-10 w-24 rounded-lg" />
                            <Skeleton className="h-10 w-36 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table skeleton */}
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                    {/* Table header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-12 gap-4">
                            <Skeleton className="col-span-4 h-4" />
                            <Skeleton className="col-span-2 h-4" />
                            <Skeleton className="col-span-2 h-4" />
                            <Skeleton className="col-span-1 h-4" />
                            <Skeleton className="col-span-1 h-4" />
                        </div>
                    </div>

                    {/* Table rows */}
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="px-6 py-4 border-b border-gray-100">
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <Skeleton className="col-span-4 h-4" />
                                <Skeleton className="col-span-2 h-4" />
                                <div className="col-span-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                                <Skeleton className="col-span-1 h-4 w-8" />
                                <Skeleton className="col-span-1 h-8 w-8 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
