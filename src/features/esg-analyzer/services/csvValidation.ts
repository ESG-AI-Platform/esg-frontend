/**
 * @module csvValidation
 *
 * Schema validation for ESG CSV inputs. Validates column presence, required
 * cell values, and response domain before data enters the metric pipeline.
 */
import { SUPPORTED_COLUMN_NAMES } from './csvDataStructure';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Structural error that prevents pipeline execution. */
export interface CSVValidationError {
    type: 'missing_column' | 'empty_csv' | 'malformed_row' | 'invalid_response' | 'missing_value';
    message: string;
    row?: number;
    column?: string;
}

/** Aggregated validation outcome for a single CSV file. */
export interface CSVValidationResult {
    valid: boolean;
    errors: CSVValidationError[];
    warnings: CSVValidationWarning[];
    /** Maps logical column names (e.g. `"theme"`) to actual CSV headers. */
    columnMapping: Record<string, string>;
}

/** Non-blocking issue that may indicate data quality problems. */
export interface CSVValidationWarning {
    type: 'column_casing' | 'extra_column' | 'empty_response' | 'unknown_response';
    message: string;
    row?: number;
    column?: string;
}

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

/** Columns required for correct gap analysis computation. */
const REQUIRED_LOGICAL_COLUMNS = [
    'theme',
    'indicatorCode',
    'indicator',
    'indicatorQuestionCode',
    'indicatorQuestion',
    'response',
] as const;

/** Optional columns that enrich source attribution when present. */
const OPTIONAL_LOGICAL_COLUMNS = [
    'company',
    'indicatorType',
    'applicabilityFlag',
    'sourceText',
    'pageNumber',
    'sourceFile',
] as const;

/** Accepted response values (case-insensitive). Others trigger a warning. */
const VALID_RESPONSES = new Set(['yes', 'no']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolves a logical column key to the matching CSV header string.
 *
 * Tries exact match first, then falls back to case-insensitive comparison
 * using the alternate names defined in {@link SUPPORTED_COLUMN_NAMES}.
 *
 * @param headers     - Raw header strings from the parsed CSV.
 * @param logicalName - Key into the `SUPPORTED_COLUMN_NAMES` mapping.
 * @returns The matched header string, or `null` if not found.
 */
function resolveColumn(
    headers: string[],
    logicalName: keyof typeof SUPPORTED_COLUMN_NAMES,
): string | null {
    const candidates = SUPPORTED_COLUMN_NAMES[logicalName];
    if (!candidates) return null;

    // Exact match first
    for (const candidate of candidates) {
        if (headers.includes(candidate)) return candidate;
    }

    // Case-insensitive fallback
    const lowerHeaders = headers.map(h => h.toLowerCase().trim());
    for (const candidate of candidates) {
        const idx = lowerHeaders.indexOf(candidate.toLowerCase());
        if (idx !== -1) return headers[idx];
    }

    return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validates parsed CSV rows against the ESG schema.
 *
 * Checks header presence, required cell values, and response domain.
 * Row-level validation is capped at `options.maxRowErrors` (default 50)
 * to avoid flooding the result on severely malformed files.
 *
 * @param rows    - Parsed CSV rows (each key = header name).
 * @param options - `{ maxRowErrors }` to cap per-row error collection.
 * @returns A {@link CSVValidationResult} describing all issues found.
 */
export function validateCSVSchema(
    rows: Record<string, string>[],
    options: { maxRowErrors?: number } = {},
): CSVValidationResult {
    const errors: CSVValidationError[] = [];
    const warnings: CSVValidationWarning[] = [];
    const columnMapping: Record<string, string> = {};
    const maxRowErrors = options.maxRowErrors ?? 50;

    // ---- Empty CSV ----
    if (!rows || rows.length === 0) {
        errors.push({ type: 'empty_csv', message: 'CSV file is empty or contains no data rows.' });
        return { valid: false, errors, warnings, columnMapping };
    }

    // ---- Header resolution — map logical names to actual CSV headers ----
    const headers = Object.keys(rows[0]);

    for (const logical of REQUIRED_LOGICAL_COLUMNS) {
        const resolved = resolveColumn(headers, logical);
        if (resolved) {
            columnMapping[logical] = resolved;
            // Warn when only a case-insensitive match was found.
            const exactMatch = SUPPORTED_COLUMN_NAMES[logical]?.includes(resolved);
            if (!exactMatch) {
                warnings.push({
                    type: 'column_casing',
                    message: `Column "${resolved}" matched logical column "${logical}" via case-insensitive fallback.`,
                    column: resolved,
                });
            }
        } else {
            errors.push({
                type: 'missing_column',
                message: `Required column "${logical}" (expected one of: ${SUPPORTED_COLUMN_NAMES[logical]?.join(', ')}) was not found in the CSV headers.`,
                column: logical,
            });
        }
    }

    for (const logical of OPTIONAL_LOGICAL_COLUMNS) {
        const resolved = resolveColumn(headers, logical);
        if (resolved) {
            columnMapping[logical] = resolved;
        }
    }

    // Skip row checks when headers themselves are invalid.
    if (errors.length > 0) {
        return { valid: false, errors, warnings, columnMapping };
    }

    // ---- Row-level validation ----
    const responseCol = columnMapping['response'];
    const themeCol = columnMapping['theme'];
    const indicatorCodeCol = columnMapping['indicatorCode'];
    const questionCodeCol = columnMapping['indicatorQuestionCode'];

    let rowErrorCount = 0;

    for (let i = 0; i < rows.length; i++) {
        if (rowErrorCount >= maxRowErrors) {
            warnings.push({
                type: 'extra_column',
                message: `Row-level validation stopped after ${maxRowErrors} errors. Additional rows may also have issues.`,
            });
            break;
        }

        const row = rows[i];
        const rowNum = i + 2; // 1-based, accounting for the header row

        // Required values
        if (!row[themeCol]?.trim()) {
            errors.push({ type: 'missing_value', message: `Row ${rowNum}: Missing required "Theme" value.`, row: rowNum, column: themeCol });
            rowErrorCount++;
        }
        if (!row[indicatorCodeCol]?.trim()) {
            errors.push({ type: 'missing_value', message: `Row ${rowNum}: Missing required "Indicator Code" value.`, row: rowNum, column: indicatorCodeCol });
            rowErrorCount++;
        }
        if (!row[questionCodeCol]?.trim()) {
            errors.push({ type: 'missing_value', message: `Row ${rowNum}: Missing required "Indicator Question Code" value.`, row: rowNum, column: questionCodeCol });
            rowErrorCount++;
        }

        // Response validation
        const rawResponse = row[responseCol]?.trim().toLowerCase();
        if (!rawResponse) {
            warnings.push({ type: 'empty_response', message: `Row ${rowNum}: Empty response — will be treated as a gap.`, row: rowNum, column: responseCol });
        } else if (!VALID_RESPONSES.has(rawResponse)) {
            warnings.push({
                type: 'unknown_response',
                message: `Row ${rowNum}: Unexpected response value "${row[responseCol]?.trim()}" — will be treated as a gap.`,
                row: rowNum,
                column: responseCol,
            });
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        columnMapping,
    };
}

/**
 * Validates CSV rows and throws {@link CSVValidationException} on failure.
 * Warnings are logged to the console even when validation passes.
 *
 * @param rows  - Parsed CSV rows.
 * @param label - Descriptive label for error messages (e.g. `"Merged CSV"`).
 * @throws {CSVValidationException} When required columns or values are missing.
 */
export function assertCSVValid(rows: Record<string, string>[], label: string = 'CSV'): void {
    const result = validateCSVSchema(rows);

    if (!result.valid) {
        const summary = result.errors.map(e => e.message).join('\n');
        throw new CSVValidationException(
            `${label} failed validation with ${result.errors.length} error(s):\n${summary}`,
            result,
        );
    }

    // Surface warnings in dev even when validation passes.
    if (result.warnings.length > 0) {
        console.warn(
            `[CSV Validation] ${label}: ${result.warnings.length} warning(s):`,
            result.warnings.map(w => w.message),
        );
    }
}

/**
 * Error thrown when CSV schema validation fails.
 * Carries the full {@link CSVValidationResult} for programmatic inspection.
 */
export class CSVValidationException extends Error {
    public readonly validationResult: CSVValidationResult;

    constructor(message: string, result: CSVValidationResult) {
        super(message);
        this.name = 'CSVValidationException';
        this.validationResult = result;
    }
}
