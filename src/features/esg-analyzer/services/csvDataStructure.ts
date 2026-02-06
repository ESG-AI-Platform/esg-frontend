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

const csvDataStructure = {
    SUPPORTED_COLUMN_NAMES,
    DIMENSION_THEME_MAPPING
};

export default csvDataStructure;
