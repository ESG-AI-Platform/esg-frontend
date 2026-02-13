/**
 * @module metricsValidation
 *
 * Post-computation integrity checks for the ESG gap analysis pipeline output.
 * Catches NaN percentages, negative counts, and cross-field inconsistencies
 * before data reaches the rendering layer.
 */

import {
    DimensionGapData,
    OverallStatisticData,
    ThemeGapData,
} from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single validation finding — `error` blocks rendering, `warning` does not. */
export interface MetricsValidationIssue {
    severity: 'error' | 'warning';
    field: string;
    message: string;
}

/** Aggregated result: `valid` is `true` when no errors (warnings allowed). */
export interface MetricsValidationResult {
    valid: boolean;
    issues: MetricsValidationIssue[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Type-guard: returns `true` for finite numeric values. */
function isFiniteNumber(v: unknown): v is number {
    return typeof v === 'number' && Number.isFinite(v);
}

/** Pushes an error if `value` is non-finite, or a warning if outside [0, 100]. */
function checkPercentage(value: number, fieldPath: string, issues: MetricsValidationIssue[]): void {
    if (!isFiniteNumber(value)) {
        issues.push({ severity: 'error', field: fieldPath, message: `Expected a finite number but got ${value}.` });
    } else if (value < 0 || value > 100) {
        issues.push({ severity: 'warning', field: fieldPath, message: `Percentage ${value}% is outside the 0-100 range.` });
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validates the full pipeline output for numeric integrity and cross-field
 * consistency (e.g. sum of theme gaps must equal overall gap count).
 *
 * @param data - The computed metrics from {@link CSVService}.
 * @returns A {@link MetricsValidationResult}; `valid` is `false` only when
 *          errors (not warnings) are present.
 */
export function validateMetrics(data: {
    overallData: OverallStatisticData;
    dimensionData: DimensionGapData[];
    themeData: ThemeGapData[];
}): MetricsValidationResult {
    const issues: MetricsValidationIssue[] = [];

    // --- Overall statistics ---
    const { overallData, dimensionData, themeData } = data;

    if (!overallData) {
        issues.push({ severity: 'error', field: 'overallData', message: 'Overall data is missing.' });
    } else {
        const gap = overallData.gapAnalysis;
        if (!isFiniteNumber(gap.gapCount)) {
            issues.push({ severity: 'error', field: 'overallData.gapAnalysis.gapCount', message: `gapCount is not a finite number: ${gap.gapCount}` });
        }
        if (!isFiniteNumber(gap.totalIndicators) || gap.totalIndicators < 0) {
            issues.push({ severity: 'error', field: 'overallData.gapAnalysis.totalIndicators', message: `totalIndicators is invalid: ${gap.totalIndicators}` });
        }
        if (!isFiniteNumber(gap.totalQuestionCodes) || gap.totalQuestionCodes < 0) {
            issues.push({ severity: 'error', field: 'overallData.gapAnalysis.totalQuestionCodes', message: `totalQuestionCodes is invalid: ${gap.totalQuestionCodes}` });
        }
        if (!isFiniteNumber(overallData.analyzedThemes.analyzedThemeCount) || overallData.analyzedThemes.analyzedThemeCount < 0) {
            issues.push({ severity: 'error', field: 'overallData.analyzedThemes.analyzedThemeCount', message: `analyzedThemeCount is invalid: ${overallData.analyzedThemes.analyzedThemeCount}` });
        }
    }

    // --- Per-theme & per-indicator checks ---
    if (!Array.isArray(themeData) || themeData.length === 0) {
        issues.push({ severity: 'warning', field: 'themeData', message: 'Theme data array is empty.' });
    } else {
        themeData.forEach((theme, ti) => {
            const prefix = `themeData[${ti}]`;
            if (!theme.name?.trim()) {
                issues.push({ severity: 'error', field: `${prefix}.name`, message: 'Theme name is empty.' });
            }

            checkPercentage(theme.percentage, `${prefix}.percentage`, issues);

            if (!isFiniteNumber(theme.gapCount) || theme.gapCount < 0) {
                issues.push({ severity: 'error', field: `${prefix}.gapCount`, message: `Invalid gapCount: ${theme.gapCount}` });
            }
            if (!isFiniteNumber(theme.totalGaps) || theme.totalGaps < 0) {
                issues.push({ severity: 'error', field: `${prefix}.totalGaps`, message: `Invalid totalGaps: ${theme.totalGaps}` });
            }
            if (theme.gapCount > theme.totalGaps) {
                issues.push({ severity: 'warning', field: `${prefix}`, message: `gapCount (${theme.gapCount}) exceeds totalGaps (${theme.totalGaps}).` });
            }

            // Indicator-level checks
            theme.indicators?.forEach((ind, ii) => {
                const iPrefix = `${prefix}.indicators[${ii}]`;
                if (!ind.id?.trim()) {
                    issues.push({ severity: 'error', field: `${iPrefix}.id`, message: 'Indicator id is empty.' });
                }
                checkPercentage(ind.percentage, `${iPrefix}.percentage`, issues);

                if (ind.gapCount > ind.totalQuestions) {
                    issues.push({ severity: 'warning', field: iPrefix, message: `Indicator gapCount (${ind.gapCount}) exceeds totalQuestions (${ind.totalQuestions}).` });
                }
            });
        });
    }

    // --- Per-dimension checks ---
    if (!Array.isArray(dimensionData) || dimensionData.length === 0) {
        issues.push({ severity: 'warning', field: 'dimensionData', message: 'Dimension data array is empty.' });
    } else {
        dimensionData.forEach((dim, di) => {
            const prefix = `dimensionData[${di}]`;
            if (!dim.name?.trim()) {
                issues.push({ severity: 'error', field: `${prefix}.name`, message: 'Dimension name is empty.' });
            }
            checkPercentage(dim.percentage, `${prefix}.percentage`, issues);

            if (dim.gapCount > dim.totalGaps) {
                issues.push({ severity: 'warning', field: prefix, message: `gapCount (${dim.gapCount}) exceeds totalGaps (${dim.totalGaps}).` });
            }
        });
    }

    // --- Cross-field consistency ---
    if (overallData && Array.isArray(themeData) && themeData.length > 0) {
        const summedGaps = themeData.reduce((s, t) => s + t.gapCount, 0);
        if (summedGaps !== overallData.gapAnalysis.gapCount) {
            issues.push({
                severity: 'warning',
                field: 'overallData.gapAnalysis.gapCount',
                message: `Overall gapCount (${overallData.gapAnalysis.gapCount}) does not match sum of theme gapCounts (${summedGaps}).`,
            });
        }

        if (overallData.analyzedThemes.analyzedThemeCount !== themeData.length) {
            issues.push({
                severity: 'warning',
                field: 'overallData.analyzedThemes.analyzedThemeCount',
                message: `analyzedThemeCount (${overallData.analyzedThemes.analyzedThemeCount}) does not match themeData length (${themeData.length}).`,
            });
        }
    }

    return {
        valid: issues.filter(i => i.severity === 'error').length === 0,
        issues,
    };
}
