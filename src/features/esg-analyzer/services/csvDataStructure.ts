// Expected CSV data structure for ESG analysis
// This is for reference and documentation purposes

/**
 * Expected CSV structure for ESG data processing:
 * 
 * Both csvMergedReportUrl and csvReportUrl should contain the following columns:
 * - Company: Company name (optional - not used in analysis)
 * - Theme: The ESG theme name (e.g., "Carbon Emissions", "Water Management")
 * - Indicator Code: Unique identifier for the indicator (e.g., "CE001", "WM001")
 * - Indicator Type: Type/category of the indicator
 * - Indicator: Display name for the indicator
 * - Indicator Question Code: Unique code for each question (e.g., "CE001.1", "CE001.2")
 * - Indicator Question: The actual question text
 * - Applicability Flag: Flag indicating applicability (optional - not used in analysis)
 * - Response: The response value ("Yes" = no gap, "No" = gap exists)
 * - Source Text: The source text evidence
 * - PageNumber: Page number in the source document
 * - Source_File: Name of the source file
 * 
 * Example CSV content:
 * ```
 * Company,Theme,Indicator Code,Indicator Type,Indicator,Indicator Question Code,Indicator Question,Applicability Flag,Response,Source Text,PageNumber,Source_File
 * Example Corp,Carbon Emissions,CE001,Environmental,GHG Emissions Scope 1,CE001.1,Does the company report Scope 1 emissions?,Yes,No,,0,
 * Example Corp,Carbon Emissions,CE001,Environmental,GHG Emissions Scope 1,CE001.2,Are Scope 1 emissions verified by third party?,Yes,Yes,Our Scope 1 emissions are verified annually by EY Environmental Services.,32,Sustainability_Report_2023.pdf
 * ```
 * 
 * Key Logic:
 * - Response = "No" means there IS a gap
 * - Response = "Yes" means there is NO gap
 * - csvMergedReportUrl contains the primary analysis with one source per question
 * - csvReportUrl contains detailed data with potentially multiple sources per question
 * - When no gap exists, the system searches csvReportUrl for all related sources
 */

// Alternative column names that are also supported:
export const SUPPORTED_COLUMN_NAMES = {
    company: ['Company', 'company'],
    theme: ['Theme', 'theme'],
    indicatorCode: ['Indicator Code', 'indicator_code'],
    indicatorType: ['Indicator Type', 'indicator_type'],
    indicator: ['Indicator', 'indicator'],
    indicatorQuestionCode: ['Indicator Question Code', 'indicator_question_code'],
    indicatorQuestion: ['Indicator Question', 'indicator_question'],
    applicabilityFlag: ['Applicability Flag', 'applicability_flag'],
    response: ['Response', 'response'],
    sourceText: ['Source Text', 'source_text'],
    pageNumber: ['PageNumber', 'page_number', 'Page Number'],
    sourceFile: ['Source_File', 'source_file', 'Source File']
};

export const DIMENSION_THEME_MAPPING = {
    'Environmental': [
        'Biodiversity',
        'Climate Change', 
        'Pollution & Resources',
        'Water Security',
        'Supply Chain: Environmental'
    ],
    'Social': [
        'Labour Standards',
        'Human Rights & Community',
        'Health & Safety',
        'Customer Responsibility',
        'Supply Chain: Social'
    ],
    'Governance': [
        'Anti-Corruption',
        'Corporate Governance',
        'Risk Management',
        'Tax Transparency'
    ]
};

export default {
    SUPPORTED_COLUMN_NAMES,
    DIMENSION_THEME_MAPPING
};
