import { notifyError } from '@/shared/lib/notify-error';

import { ThemeGapData, DimensionGapData, OverallStatisticData, SourceData } from '../types';

import { DIMENSION_THEME_MAPPING } from './csvDataStructure';
import { assertCSVValid } from './csvValidation';
import { validateMetrics } from './metricsValidation';

/** Generic key-value row produced by {@link CSVService.parseCSV}. */
export interface CSVDataRow {
    [key: string]: string;
}

/** Strongly-typed row matching the ESG processing service output columns. */
export interface ESGCSVRow {
    Company?: string;
    Theme: string;
    'Indicator Code': string;
    'Indicator Type': string;
    Indicator: string;
    'Indicator Question Code': string;
    'Indicator Question': string;
    'Applicability Flag'?: string;
    Response: string;
    'Source Text': string;
    PageNumber: string;
    Source_File: string;
}

export class CSVService {
    /**
     * Fetches a CSV file and parses it into row objects.
     *
     * @param url - Absolute URL to the CSV resource.
     * @throws On network errors or non-2xx responses.
     */
    static async fetchCSVData(url: string): Promise<CSVDataRow[]> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const csvText = await response.text();
            return this.parseCSV(csvText);
        } catch (error) {
            notifyError(error, { context: 'fetchCSVData', showToast: false });
            throw error;
        }
    }

    /**
     * Fetches, validates, and processes the merged + detailed CSV pair into
     * structured gap analysis metrics.
     *
     * @param mergedUrl   - URL of the merged (summary) CSV.
     * @param detailedUrl - URL of the detailed (per-source) CSV.
     * @returns Computed overall, dimension, and theme-level metrics.
     * @throws {CSVValidationException} When either CSV fails schema validation.
     */
    static async fetchAndProcessBothCSVs(mergedUrl: string, detailedUrl: string): Promise<{
        overallData: OverallStatisticData;
        dimensionData: DimensionGapData[];
        themeData: ThemeGapData[];
    }> {
        try {
            const [mergedData, detailedData] = await Promise.all([
                this.fetchCSVData(mergedUrl),
                this.fetchCSVData(detailedUrl)
            ]);

            // Validate both CSVs before processing
            assertCSVValid(mergedData, 'Merged CSV');
            assertCSVValid(detailedData, 'Detailed CSV');

            return this.processESGDataWithBothSources(mergedData, detailedData);
        } catch (error) {
            notifyError(error, { context: 'fetchBothCSVs', showToast: false });
            throw error;
        }
    }

    /**
     * Parses raw CSV text into an array of header-keyed row objects.
     *
     * Handles quoted fields containing newlines and commas.
     * Malformed rows (column count mismatch) are padded or truncated with a
     * console warning.
     */
    static parseCSV(csvText: string): CSVDataRow[] {
        let normalizedText = '';
        let inQuotes = false;
        for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            if (char === '"') {
                inQuotes = !inQuotes;
                normalizedText += char;
            } else if (char === '\n' && inQuotes) {
                normalizedText += ' ';
            } else {
                normalizedText += char;
            }
        }

        const lines = normalizedText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return [];

        const headers = this.parseCSVLine(lines[0]);
        const rows: CSVDataRow[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length !== headers.length) {
                console.warn(
                    `[CSV Parse] Row ${i + 1} has ${values.length} columns, expected ${headers.length}. ` +
                    `Row will be padded/truncated.`,
                );
                while (values.length < headers.length) values.push('');
                while (values.length > headers.length) values.pop();
            }
            const row: CSVDataRow = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            rows.push(row);
        }

        return rows;
    }

    /** Splits a single CSV line into field values, respecting quoted commas. */
    private static parseCSVLine(line: string): string[] {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current.trim());
        return values;
    }

    /**
     * Single-CSV processing path (backward compatibility).
     * Runs post-computation metrics validation.
     */
    static processESGData(rawData: CSVDataRow[]): {
        overallData: OverallStatisticData;
        dimensionData: DimensionGapData[];
        themeData: ThemeGapData[];
    } {
        const themeData = this.processThemeDataNewFormat(rawData);
        const dimensionData = this.processDimensionData(rawData, themeData);
        const overallData = this.processOverallData(rawData, themeData);

        const result = { overallData, dimensionData, themeData };

        // Post-computation integrity check
        const validation = validateMetrics(result);
        if (!validation.valid) {
            const errors = validation.issues
                .filter(i => i.severity === 'error')
                .map(i => `[${i.field}] ${i.message}`)
                .join('\n');
            console.error('[Metrics Validation] Output failed validation:\n', errors);
        }

        return result;
    }

    /**
     * Dual-CSV processing path (merged + detailed).
     * Runs post-computation metrics validation.
     */
    static processESGDataWithBothSources(mergedData: CSVDataRow[], detailedData: CSVDataRow[]): {
        overallData: OverallStatisticData;
        dimensionData: DimensionGapData[];
        themeData: ThemeGapData[];
    } {
        const themeData = this.processThemeDataWithBothSources(mergedData, detailedData);
        const dimensionData = this.processDimensionData(mergedData, themeData);
        const overallData = this.processOverallData(mergedData, themeData);

        const result = { overallData, dimensionData, themeData };

        // Post-computation integrity check
        const validation = validateMetrics(result);
        if (!validation.valid) {
            const errors = validation.issues
                .filter(i => i.severity === 'error')
                .map(i => `[${i.field}] ${i.message}`)
                .join('\n');
            console.error('[Metrics Validation] Output failed validation:\n', errors);
        }
        if (validation.issues.some(i => i.severity === 'warning')) {
            console.warn(
                '[Metrics Validation] Warnings:',
                validation.issues.filter(i => i.severity === 'warning').map(i => i.message),
            );
        }

        return result;
    }

    /**
     * Builds theme → indicator → question-code hierarchy from both CSV sources.
     *
     * For non-gap rows, cross-references the detailed CSV to collect all
     * supporting source citations. Falls back to the merged-row source when
     * no detailed matches exist.
     */
    private static processThemeDataWithBothSources(mergedData: CSVDataRow[], detailedData: CSVDataRow[]): ThemeGapData[] {
        const themeMap = new Map<string, ThemeGapData>();

        mergedData.forEach(row => {
            const themeName = row['Theme'] || 'Unknown Theme';
            const indicatorCode = row['Indicator Code'] || '';
            const indicatorName = row['Indicator'] || '';
            const indicatorType = row['Indicator Type'] || '';
            const questionCode = row['Indicator Question Code'] || '';
            const question = row['Indicator Question'] || '';
            const response = row['Response'] || '';
            const sourceText = row['Source Text'] || '';
            const pageNumber = parseInt(row['PageNumber'] || '0');
            const sourceFile = row['Source_File'] || '';

            // Determine if there's a gap:
            //   "yes" (case-insensitive) → no gap
            //   anything else ("no", empty, unknown) → gap
            const normalizedResponse = response.trim().toLowerCase();
            const hasGap = normalizedResponse !== 'yes';

            if (!themeMap.has(themeName)) {
                themeMap.set(themeName, {
                    name: themeName,
                    gapCount: 0,
                    totalGaps: 0,
                    percentage: 0,
                    indicators: []
                });
            }

            const theme = themeMap.get(themeName)!;

            // Find or create indicator
            let indicator = theme.indicators?.find(ind => ind.id === indicatorCode);
            if (!indicator) {
                indicator = {
                    id: indicatorCode,
                    name: indicatorName,
                    description: indicatorType,
                    questionCodes: [],
                    gapCount: 0,
                    totalQuestions: 0,
                    percentage: 0
                };
                theme.indicators = theme.indicators || [];
                theme.indicators.push(indicator);
            }

            // Collect source citations from the detailed CSV for non-gap items.
            let sources: SourceData[] = [];
            if (!hasGap) {
                // Cross-reference the detailed CSV for matching source citations.
                const detailedSources = detailedData.filter(detailRow =>
                    detailRow['Indicator Question Code'] === questionCode &&
                    detailRow['Indicator Question'] === question &&
                    detailRow['Response']?.toLowerCase() === 'yes'
                );

                sources = detailedSources.map(detailRow => ({
                    id: `src_${Date.now()}_${Math.random()}`,
                    source_text: detailRow['Source Text'] || '',
                    page_number: parseInt(detailRow['PageNumber'] || '0'),
                    source_file: detailRow['Source_File'] || ''
                }));

                // Fall back to the merged-row source when detailed data is absent.
                if (sources.length === 0 && sourceText) {
                    sources = [{
                        id: `src_${Date.now()}_${Math.random()}`,
                        source_text: sourceText,
                        page_number: pageNumber,
                        source_file: sourceFile
                    }];
                }
            }

            indicator.questionCodes.push({
                code: questionCode,
                question: question,
                hasGap: hasGap,
                source: sources
            });

            indicator.totalQuestions++;
            if (hasGap) {
                indicator.gapCount++;
            }
        });

        // Derive percentages from accumulated counts.
        const themes = Array.from(themeMap.values());
        themes.forEach(theme => {
            theme.indicators?.forEach(indicator => {
                indicator.percentage = indicator.totalQuestions > 0
                    ? Math.round((indicator.gapCount / indicator.totalQuestions) * 100)
                    : 0;
            });

            const totalQuestions = theme.indicators?.reduce((sum, ind) => sum + ind.totalQuestions, 0) || 0;
            const totalGaps = theme.indicators?.reduce((sum, ind) => sum + ind.gapCount, 0) || 0;

            theme.totalGaps = totalQuestions;
            theme.gapCount = totalGaps;
            theme.percentage = totalQuestions > 0 ? Math.round((totalGaps / totalQuestions) * 100) : 0;
        });

        return themes;
    }

    /**
     * Single-file theme processing fallback.
     * Identical gap logic, but sources come only from the single CSV.
     */
    private static processThemeDataNewFormat(rawData: CSVDataRow[]): ThemeGapData[] {
        const themeMap = new Map<string, ThemeGapData>();

        rawData.forEach(row => {
            const themeName = row['Theme'] || 'Unknown Theme';
            const indicatorCode = row['Indicator Code'] || '';
            const indicatorName = row['Indicator'] || '';
            const indicatorType = row['Indicator Type'] || '';
            const questionCode = row['Indicator Question Code'] || '';
            const question = row['Indicator Question'] || '';
            const response = row['Response'] || '';
            const sourceText = row['Source Text'] || '';
            const pageNumber = parseInt(row['PageNumber'] || '0');
            const sourceFile = row['Source_File'] || '';

            // Gap rule: only an explicit "yes" counts as addressed.
            const normalizedResponse = response.trim().toLowerCase();
            const hasGap = normalizedResponse !== 'yes';

            if (!themeMap.has(themeName)) {
                themeMap.set(themeName, {
                    name: themeName,
                    gapCount: 0,
                    totalGaps: 0,
                    percentage: 0,
                    indicators: []
                });
            }

            const theme = themeMap.get(themeName)!;

            let indicator = theme.indicators?.find(ind => ind.id === indicatorCode);
            if (!indicator) {
                indicator = {
                    id: indicatorCode,
                    name: indicatorName,
                    description: indicatorType,
                    questionCodes: [],
                    gapCount: 0,
                    totalQuestions: 0,
                    percentage: 0
                };
                theme.indicators = theme.indicators || [];
                theme.indicators.push(indicator);
            }

            // Attach inline source when available.
            const sources: SourceData[] = sourceText ? [{
                id: `src_${Date.now()}_${Math.random()}`,
                source_text: sourceText,
                page_number: pageNumber,
                source_file: sourceFile
            }] : [];

            indicator.questionCodes.push({
                code: questionCode,
                question: question,
                hasGap: hasGap,
                source: sources
            });

            indicator.totalQuestions++;
            if (hasGap) {
                indicator.gapCount++;
            }
        });

        // Derive percentages from accumulated counts.
        const themes = Array.from(themeMap.values());
        themes.forEach(theme => {
            theme.indicators?.forEach(indicator => {
                indicator.percentage = indicator.totalQuestions > 0
                    ? Math.round((indicator.gapCount / indicator.totalQuestions) * 100)
                    : 0;
            });

            const totalQuestions = theme.indicators?.reduce((sum, ind) => sum + ind.totalQuestions, 0) || 0;
            const totalGaps = theme.indicators?.reduce((sum, ind) => sum + ind.gapCount, 0) || 0;

            theme.totalGaps = totalQuestions;
            theme.gapCount = totalGaps;
            theme.percentage = totalQuestions > 0 ? Math.round((totalGaps / totalQuestions) * 100) : 0;
        });

        return themes;
    }

    /**
     * Aggregates theme-level gaps into E / S / G dimension buckets.
     *
     * Matches themes by exact name (case-insensitive) using
     * {@link DIMENSION_THEME_MAPPING} to avoid false-positive substring hits.
     */
    private static processDimensionData(_rawData: CSVDataRow[], themeData: ThemeGapData[]): DimensionGapData[] {
        // O(1) lookup by normalised theme name.
        const themeLookup = new Map<string, ThemeGapData>();
        themeData.forEach(t => themeLookup.set(t.name.toLowerCase().trim(), t));

        return Object.entries(DIMENSION_THEME_MAPPING).map(([dimension, themes]) => {
            let gapCount = 0;
            let totalGaps = 0;

            themes.forEach(themeName => {
                const theme = themeLookup.get(themeName.toLowerCase().trim());
                if (theme) {
                    gapCount += theme.gapCount;
                    totalGaps += theme.totalGaps;
                }
            });

            return {
                name: dimension,
                gapCount,
                totalGaps,
                percentage: totalGaps > 0 ? Math.round((gapCount / totalGaps) * 100) : 0,
            };
        });
    }

    /** Computes top-level statistics (total gaps, indicator count, etc.). */
    private static processOverallData(rawData: CSVDataRow[], themeData: ThemeGapData[]): OverallStatisticData {
        const totalGaps = themeData.reduce((sum, theme) => sum + theme.gapCount, 0);
        const uniqueIndicatorCodes = new Set<string>();
        rawData.forEach(row => {
            const indicatorCode = row['Indicator Code'];
            if (indicatorCode) {
                uniqueIndicatorCodes.add(indicatorCode);
            }
        });
        const totalIndicators = uniqueIndicatorCodes.size;
        const totalQuestionCodes = rawData.length;
        const analyzedThemeCount = themeData.length;

        return {
            gapAnalysis: {
                gapCount: totalGaps,
                totalIndicators: totalIndicators,
                totalQuestionCodes: totalQuestionCodes,
                description: "Overall Gap Analysis"
            },
            analyzedThemes: {
                analyzedThemeCount: analyzedThemeCount,
                description: "Analyzed Themes",
                icon: "📊"
            }
        };
    }
}
