import { ThemeGapData } from '../types';

export const mockThemeDataWithSources: ThemeGapData[] = [
    {
        name: "Carbon Emissions",
        gapCount: 3,
        totalGaps: 15,
        percentage: 20,
        indicators: [
            {
                id: "CE001",
                name: "GHG Emissions Scope 1",
                description: "Direct greenhouse gas emissions from owned or controlled sources",
                questionCodes: [
                    {
                        code: "CE001.1",
                        question: "Does the company report Scope 1 emissions?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "CE001.2",
                        question: "Are Scope 1 emissions verified by third party?",
                        hasGap: false,
                        source: [
                            {
                                id: "src002",
                                source_text: "Our Scope 1 emissions are verified annually by EY Environmental Services.",
                                page_number: 32,
                                source_file: "Sustainability_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "CE001.3",
                        question: "Are reduction targets set for Scope 1 emissions?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 2,
                totalQuestions: 3,
                percentage: 67
            },
            {
                id: "CE002",
                name: "GHG Emissions Scope 2",
                description: "Indirect greenhouse gas emissions from purchased energy",
                questionCodes: [
                    {
                        code: "CE002.1",
                        question: "Does the company report Scope 2 emissions?",
                        hasGap: false,
                        source: [
                            {
                                id: "src004",
                                source_text: "Scope 2 emissions totaled 45,000 tCO2e in 2023, representing a 5% decrease from 2022.",
                                page_number: 28,
                                source_file: "Sustainability_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "CE002.2",
                        question: "Are Scope 2 emissions calculated using both location and market-based methods?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 1,
                totalQuestions: 2,
                percentage: 50
            }
        ]
    },
    {
        name: "Water Management",
        gapCount: 2,
        totalGaps: 15,
        percentage: 13,
        indicators: [
            {
                id: "WM001",
                name: "Water Consumption",
                description: "Total water consumption and sources",
                questionCodes: [
                    {
                        code: "WM001.1",
                        question: "Does the company report total water consumption?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "WM001.2",
                        question: "Are water sources identified and disclosed?",
                        hasGap: false,
                        source: [
                            {
                                id: "src007",
                                source_text: "Water is sourced from municipal supplies (60%) and groundwater (40%).",
                                page_number: 36,
                                source_file: "Sustainability_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "WM001.3",
                        question: "Are water conservation targets set?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 2,
                totalQuestions: 3,
                percentage: 67
            }
        ]
    },
    {
        name: "Employee Safety",
        gapCount: 2,
        totalGaps: 15,
        percentage: 13,
        indicators: [
            {
                id: "ES001",
                name: "Workplace Safety",
                description: "Workplace safety incidents and prevention measures",
                questionCodes: [
                    {
                        code: "ES001.1",
                        question: "Are workplace injury rates reported?",
                        hasGap: false,
                        source: [
                            {
                                id: "src009",
                                source_text: "Total recordable injury rate was 0.45 per 200,000 hours worked in 2023.",
                                page_number: 42,
                                source_file: "Annual_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "ES001.2",
                        question: "Are safety training programs documented?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "ES001.3",
                        question: "Are safety performance targets set?",
                        hasGap: false,
                        source: [
                            {
                                id: "src011",
                                source_text: "Target of zero fatalities and 10% reduction in injury rates by 2025.",
                                page_number: 44,
                                source_file: "Sustainability_Report_2023.pdf"
                            }
                        ]
                    }
                ],
                gapCount: 1,
                totalQuestions: 3,
                percentage: 33
            }
        ]
    },
    {
        name: "Waste Management",
        gapCount: 4,
        totalGaps: 15,
        percentage: 27,
        indicators: [
            {
                id: "WS001",
                name: "Waste Generation",
                description: "Total waste generation and disposal methods",
                questionCodes: [
                    {
                        code: "WS001.1",
                        question: "Does the company track total waste generation?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "WS001.2",
                        question: "Are waste disposal methods documented?",
                        hasGap: false,
                        source: [
                            {
                                id: "src012",
                                source_text: "Waste is disposed through licensed contractors with 65% recycling rate.",
                                page_number: 38,
                                source_file: "Sustainability_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "WS001.3",
                        question: "Are waste reduction targets established?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 2,
                totalQuestions: 3,
                percentage: 67
            }
        ]
    },
    {
        name: "Energy Management",
        gapCount: 3,
        totalGaps: 15,
        percentage: 20,
        indicators: [
            {
                id: "EM001",
                name: "Energy Consumption",
                description: "Total energy consumption and renewable energy usage",
                questionCodes: [
                    {
                        code: "EM001.1",
                        question: "Does the company report total energy consumption?",
                        hasGap: false,
                        source: [
                            {
                                id: "src013",
                                source_text: "Total energy consumption was 125,000 MWh in 2023.",
                                page_number: 30,
                                source_file: "Sustainability_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "EM001.2",
                        question: "Is renewable energy percentage disclosed?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "EM001.3",
                        question: "Are energy efficiency targets set?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 2,
                totalQuestions: 3,
                percentage: 67
            }
        ]
    },
    {
        name: "Diversity & Inclusion",
        gapCount: 2,
        totalGaps: 15,
        percentage: 13,
        indicators: [
            {
                id: "DI001",
                name: "Workforce Diversity",
                description: "Diversity metrics and inclusion initiatives",
                questionCodes: [
                    {
                        code: "DI001.1",
                        question: "Are diversity metrics reported by gender?",
                        hasGap: false,
                        source: [
                            {
                                id: "src014",
                                source_text: "Female representation: 42% overall workforce, 35% management positions.",
                                page_number: 48,
                                source_file: "Annual_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "DI001.2",
                        question: "Are diversity and inclusion programs documented?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "DI001.3",
                        question: "Are diversity targets established?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 2,
                totalQuestions: 3,
                percentage: 67
            }
        ]
    },
    {
        name: "Community Impact",
        gapCount: 1,
        totalGaps: 15,
        percentage: 7,
        indicators: [
            {
                id: "CI001",
                name: "Community Investment",
                description: "Community development and social investment programs",
                questionCodes: [
                    {
                        code: "CI001.1",
                        question: "Are community investment amounts disclosed?",
                        hasGap: false,
                        source: [
                            {
                                id: "src015",
                                source_text: "Invested $2.5 million in local community development projects in 2023.",
                                page_number: 52,
                                source_file: "Sustainability_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "CI001.2",
                        question: "Are community impact assessments conducted?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 1,
                totalQuestions: 2,
                percentage: 50
            }
        ]
    },
    {
        name: "Supply Chain Management",
        gapCount: 3,
        totalGaps: 15,
        percentage: 20,
        indicators: [
            {
                id: "SC001",
                name: "Supplier Assessment",
                description: "Supplier ESG assessment and monitoring",
                questionCodes: [
                    {
                        code: "SC001.1",
                        question: "Are suppliers assessed for ESG risks?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "SC001.2",
                        question: "Is supplier code of conduct established?",
                        hasGap: false,
                        source: [
                            {
                                id: "src016",
                                source_text: "All suppliers must comply with our Supplier Code of Conduct covering labor, environment, and ethics.",
                                page_number: 56,
                                source_file: "Annual_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "SC001.3",
                        question: "Are supplier audits conducted regularly?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 2,
                totalQuestions: 3,
                percentage: 67
            }
        ]
    },
    {
        name: "Data Privacy & Security",
        gapCount: 2,
        totalGaps: 15,
        percentage: 13,
        indicators: [
            {
                id: "DP001",
                name: "Data Protection",
                description: "Data privacy policies and security measures",
                questionCodes: [
                    {
                        code: "DP001.1",
                        question: "Are data privacy policies documented?",
                        hasGap: false,
                        source: [
                            {
                                id: "src017",
                                source_text: "Comprehensive data privacy policy compliant with GDPR and local regulations.",
                                page_number: 62,
                                source_file: "Annual_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "DP001.2",
                        question: "Are data security incidents reported?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "DP001.3",
                        question: "Are data protection training programs implemented?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 2,
                totalQuestions: 3,
                percentage: 67
            }
        ]
    },
    {
        name: "Corporate Governance",
        gapCount: 1,
        totalGaps: 15,
        percentage: 7,
        indicators: [
            {
                id: "CG001",
                name: "Board Composition",
                description: "Board structure, independence, and diversity",
                questionCodes: [
                    {
                        code: "CG001.1",
                        question: "Is board composition and independence disclosed?",
                        hasGap: false,
                        source: [
                            {
                                id: "src018",
                                source_text: "Board consists of 9 directors, 67% independent, 33% female representation.",
                                page_number: 8,
                                source_file: "Annual_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "CG001.2",
                        question: "Are board meeting attendance rates disclosed?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 1,
                totalQuestions: 2,
                percentage: 50
            }
        ]
    },
    {
        name: "Risk Management",
        gapCount: 2,
        totalGaps: 15,
        percentage: 13,
        indicators: [
            {
                id: "RM001",
                name: "ESG Risk Assessment",
                description: "ESG risk identification and management processes",
                questionCodes: [
                    {
                        code: "RM001.1",
                        question: "Are ESG risks formally identified and assessed?",
                        hasGap: true,
                        source: []
                    },
                    {
                        code: "RM001.2",
                        question: "Is climate risk assessment conducted?",
                        hasGap: false,
                        source: [
                            {
                                id: "src019",
                                source_text: "Climate risk assessment conducted using TCFD framework covering physical and transition risks.",
                                page_number: 18,
                                source_file: "Sustainability_Report_2023.pdf"
                            }
                        ]
                    },
                    {
                        code: "RM001.3",
                        question: "Are risk mitigation strategies documented?",
                        hasGap: true,
                        source: []
                    }
                ],
                gapCount: 2,
                totalQuestions: 3,
                percentage: 67
            }
        ]
    }
];
