// Mock data for testing ESG Report functionality
export const mockESGReports = [
    {
        id: 'report-1',
        title: 'Apple Inc. ESG Report 2023',
        companyName: 'Apple Inc.',
        companyWebsite: 'https://apple.com',
        stockTicker: 'AAPL',
        additionalInfo: 'Leading technology company focused on sustainability',
        icbSector: 'Technology',
        icbSubSector: 'Technology Hardware & Equipment',
        uploadedFiles: [
            {
                id: 'file-1',
                name: 'apple-sustainability-report-2023.pdf',
                size: 5242880,
                type: 'application/pdf',
                uploadedAt: '2023-10-15T10:30:00Z'
            },
            {
                id: 'file-2',
                name: 'apple-annual-report-2023.pdf',
                size: 8388608,
                type: 'application/pdf',
                uploadedAt: '2023-10-15T10:35:00Z'
            }
        ],
        createdAt: '2023-10-15T10:30:00Z',
        updatedAt: '2023-10-15T14:20:00Z',
        status: 'completed' as const
    },
    {
        id: 'report-2',
        title: 'Microsoft Corporation ESG Analysis',
        companyName: 'Microsoft Corporation',
        companyWebsite: 'https://microsoft.com',
        stockTicker: 'MSFT',
        additionalInfo: 'Global technology leader with strong sustainability focus',
        icbSector: 'Technology',
        icbSubSector: 'Software & Computer Services',
        uploadedFiles: [
            {
                id: 'file-3',
                name: 'microsoft-sustainability-report-2023.pdf',
                size: 6291456,
                type: 'application/pdf',
                uploadedAt: '2023-10-14T09:15:00Z'
            }
        ],
        createdAt: '2023-10-14T09:15:00Z',
        updatedAt: '2023-10-14T16:45:00Z',
        status: 'analyzing' as const
    },
    {
        id: 'report-3',
        title: 'Tesla Inc. ESG Report Draft',
        companyName: 'Tesla Inc.',
        companyWebsite: 'https://tesla.com',
        stockTicker: 'TSLA',
        additionalInfo: 'Electric vehicle and clean energy company',
        icbSector: 'Consumer Discretionary',
        icbSubSector: 'Automobiles & Parts',
        uploadedFiles: [],
        createdAt: '2023-10-16T08:00:00Z',
        updatedAt: '2023-10-16T08:00:00Z',
        status: 'draft' as const
    }
];

// Function to populate localStorage with mock data
export const populateMockData = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('esg_reports', JSON.stringify(mockESGReports));
    }
};
