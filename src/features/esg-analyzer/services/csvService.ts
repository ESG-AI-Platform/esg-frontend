import { notifyError } from '@/shared/lib/notify-error';

import { ThemeGapData, DimensionGapData, OverallStatisticData, SourceData } from '../types';

import { DIMENSION_THEME_MAPPING } from './csvDataStructure';

export interface CSVDataRow {
    [key: string]: string;
}

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
     * Fetches CSV data from a URL and parses it into an array of objects
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
     * Fetches and processes both CSV files to get complete ESG data
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

            return this.processESGDataWithBothSources(mergedData, detailedData);
        } catch (error) {
            notifyError(error, { context: 'fetchBothCSVs', showToast: false });
            throw error;
        }
    }

    /**
     * Parses CSV text into an array of objects
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
                console.warn(`Row ${i} has ${values.length} values, expected ${headers.length}: ${values.join('|')}`);
                // Optionally pad or skip malformed rows
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

    /**
     * Parses a single CSV line, handling quotes and commas correctly
     */
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
     * Processes raw CSV data into structured ESG analysis data (backward compatibility)
     */
    static processESGData(rawData: CSVDataRow[]): {
        overallData: OverallStatisticData;
        dimensionData: DimensionGapData[];
        themeData: ThemeGapData[];
    } {
        // Process the data based on expected CSV structure
        const themeData = this.processThemeDataNewFormat(rawData);
        const dimensionData = this.processDimensionData(rawData, themeData);
        const overallData = this.processOverallData(rawData, themeData);

        return {
            overallData,
            dimensionData,
            themeData
        };
    }

    /**
     * Processes ESG data using both merged and detailed CSV sources
     */
    static processESGDataWithBothSources(mergedData: CSVDataRow[], detailedData: CSVDataRow[]): {
        overallData: OverallStatisticData;
        dimensionData: DimensionGapData[];
        themeData: ThemeGapData[];
    } {
        const themeData = this.processThemeDataWithBothSources(mergedData, detailedData);
        const dimensionData = this.processDimensionData(mergedData, themeData);
        const overallData = this.processOverallData(mergedData, themeData);

        return {
            overallData,
            dimensionData,
            themeData
        };
    }

    /**
     * Processes theme data using both merged and detailed CSV sources
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

            // Determine if there's a gap (No = gap, Yes = no gap)
            const hasGap = response.toLowerCase() === 'no';

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

            // Get all related sources from detailed data if no gap
            let sources: SourceData[] = [];
            if (!hasGap) {
                // Find all matching records in detailed data
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

                // If no detailed sources found, use the merged source
                if (sources.length === 0 && sourceText) {
                    sources = [{
                        id: `src_${Date.now()}_${Math.random()}`,
                        source_text: sourceText,
                        page_number: pageNumber,
                        source_file: sourceFile
                    }];
                }
            }

            // Add question code
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

        // Calculate percentages
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
     * Processes theme data using new CSV format (fallback for single file)
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

            // Determine if there's a gap (No = gap, Yes = no gap)
            const hasGap = response.toLowerCase() === 'no';

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

            // Add source if available
            const sources: SourceData[] = sourceText ? [{
                id: `src_${Date.now()}_${Math.random()}`,
                source_text: sourceText,
                page_number: pageNumber,
                source_file: sourceFile
            }] : [];

            // Add question code
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

        // Calculate percentages
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
     * Processes dimension data from themes
     */
    private static processDimensionData(rawData: CSVDataRow[], themeData: ThemeGapData[]): DimensionGapData[] {
        const dimensionMap = new Map<string, { themes: string[], gapCount: number, totalGaps: number }>();

        Object.entries(DIMENSION_THEME_MAPPING).forEach(([dimension, themes]) => {
            let gapCount = 0;
            let totalGaps = 0;

            themes.forEach(themeName => {
                const theme = themeData.find(t => t.name === themeName || t.name.toLowerCase().includes(themeName.toLowerCase()));
                if (theme) {
                    gapCount += theme.gapCount;
                    totalGaps += theme.totalGaps;
                }
            });

            dimensionMap.set(dimension, { themes, gapCount, totalGaps });
        });

        return Array.from(dimensionMap.entries()).map(([name, data]) => ({
            name,
            gapCount: data.gapCount,
            totalGaps: data.totalGaps,
            percentage: data.totalGaps > 0 ? Math.round((data.gapCount / data.totalGaps) * 100) : 0
        }));
    }

    /**
     * Processes overall statistics
     */
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
