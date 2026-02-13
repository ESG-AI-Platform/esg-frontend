'use client';

export interface IcbSelection {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
}

interface IcbOption {
    id: string;
    name: string;
}

interface IcbData {
    level1: IcbOption[];
    level2: Record<string, IcbOption[]>;
    level3: Record<string, IcbOption[]>;
}

export const ICB_DATA: IcbData = {
    level1: [
        { id: '0001', name: 'Oil & Gas' },
        { id: '1000', name: 'Basic Materials' },
        { id: '2000', name: 'Industrials' },
        { id: '3000', name: 'Consumer Goods' },
        { id: '4000', name: 'Health Care' },
        { id: '5000', name: 'Consumer Services' },
        { id: '6000', name: 'Telecommunications' },
        { id: '7000', name: 'Utilities' },
        { id: '8000', name: 'Financials' },
        { id: '9000', name: 'Technology' }
    ],
    level2: {
        '0001': [
            { id: '0530', name: 'Oil & Gas Producers' },
            { id: '0570', name: 'Oil Equipment, Services & Distribution' },
            { id: '0580', name: 'Alternative Energy' }
        ],
        '1000': [
            { id: '1350', name: 'Chemicals' },
            { id: '1730', name: 'Forestry & Paper' },
            { id: '1750', name: 'Industrial Metals & Mining' },
            { id: '1770', name: 'Mining' }
        ],
        '2000': [
            { id: '2350', name: 'Construction & Materials' },
            { id: '2710', name: 'Aerospace & Defense' },
            { id: '2720', name: 'General Industrials' },
            { id: '2730', name: 'Electronic & Electrical Equipment' },
            { id: '2750', name: 'Industrial Engineering' },
            { id: '2770', name: 'Industrial Transportation' },
            { id: '2790', name: 'Support Services' }
        ],
        '3000': [
            { id: '3350', name: 'Automobiles & Parts' },
            { id: '3530', name: 'Beverages' },
            { id: '3570', name: 'Food Producers' },
            { id: '3720', name: 'Household Goods & Home Construction' },
            { id: '3740', name: 'Leisure Goods' },
            { id: '3760', name: 'Personal Goods' },
            { id: '3780', name: 'Tobacco' }
        ],
        '4000': [
            { id: '4530', name: 'Health Care Equipment & Services' },
            { id: '4570', name: 'Pharmaceuticals & Biotechnology' }
        ],
        '5000': [
            { id: '5330', name: 'Food & Drug Retailers' },
            { id: '5370', name: 'General Retailers' },
            { id: '5550', name: 'Media' },
            { id: '5750', name: 'Travel & Leisure' }
        ],
        '6000': [
            { id: '6530', name: 'Fixed Line Telecommunications' },
            { id: '6570', name: 'Mobile Telecommunications' }
        ],
        '7000': [
            { id: '7530', name: 'Electricity' },
            { id: '7570', name: 'Gas, Water & Multi-utilities' }
        ],
        '8000': [
            { id: '8350', name: 'Banks' },
            { id: '8530', name: 'Nonlife Insurance' },
            { id: '8570', name: 'Life Insurance' },
            { id: '8630', name: 'Real Estate Investment & Services' },
            { id: '8670', name: 'Real Estate Investment Trusts' },
            { id: '8770', name: 'Financial Services' },
            { id: '8980', name: 'Equity Investment Instruments' },
            { id: '8990', name: 'Nonequity Investment Instruments' }
        ],
        '9000': [
            { id: '9530', name: 'Software & Computer Services' },
            { id: '9570', name: 'Technology Hardware & Equipment' }
        ]
    },
    level3: {
        '0530': [
            { id: '0533', name: 'Exploration & Production' },
            { id: '0537', name: 'Integrated Oil & Gas' }
        ],
        '0570': [
            { id: '0573', name: 'Oil Equipment & Services' },
            { id: '0577', name: 'Pipelines' }
        ],
        '0580': [
            { id: '0583', name: 'Renewable Energy Equipment' },
            { id: '0587', name: 'Alternative Fuels' }
        ],
        '1350': [
            { id: '1353', name: 'Commodity Chemicals' },
            { id: '1357', name: 'Specialty Chemicals' }
        ],
        '1730': [
            { id: '1733', name: 'Forestry' },
            { id: '1737', name: 'Paper' }
        ],
        '1750': [
            { id: '1753', name: 'Aluminum' },
            { id: '1755', name: 'Nonferrous Metals' },
            { id: '1757', name: 'Iron & Steel' }
        ],
        '1770': [
            { id: '1771', name: 'Coal' },
            { id: '1772', name: 'Nuclear Fuel Processors' },
            { id: '1773', name: 'Diamonds & Gemstones' },
            { id: '1774', name: 'Uranium Mining' },
            { id: '1775', name: 'General Mining' },
            { id: '1777', name: 'Gold Mining' },
            { id: '1779', name: 'Platinum & Precious Metals' }
        ],
        '2350': [
            { id: '2353', name: 'Building Materials & Fixtures' },
            { id: '2357', name: 'Heavy Construction' }
        ],
        '2710': [
            { id: '2713', name: 'Aerospace' },
            { id: '2717', name: 'Defense' }
        ],
        '2720': [
            { id: '2723', name: 'Containers & Packaging' },
            { id: '2727', name: 'Diversified Industrials' }
        ],
        '2730': [
            { id: '2733', name: 'Electrical Components & Equipment' },
            { id: '2737', name: 'Electronic Equipment' }
        ],
        '2750': [
            { id: '2753', name: 'Commercial Vehicles & Trucks' },
            { id: '2757', name: 'Industrial Machinery' },
            { id: '2758', name: 'Reactors' }
        ],
        '2770': [
            { id: '2771', name: 'Delivery Services' },
            { id: '2773', name: 'Marine Transportation' },
            { id: '2775', name: 'Railroads' },
            { id: '2777', name: 'Transportation Services' },
            { id: '2779', name: 'Trucking' }
        ],
        '2790': [
            { id: '2791', name: 'Business Support Services' },
            { id: '2793', name: 'Business Training & Employment Agencies' },
            { id: '2795', name: 'Financial Administration' },
            { id: '2797', name: 'Industrial Suppliers' },
            { id: '2798', name: 'Nuclear Fuel Transport & Storage' },
            { id: '2799', name: 'Waste & Disposal Services' }
        ],
        '3350': [
            { id: '3353', name: 'Automobiles' },
            { id: '3355', name: 'Auto Parts' },
            { id: '3357', name: 'Tires' }
        ],
        '3530': [
            { id: '3533', name: 'Brewers' },
            { id: '3535', name: 'Distillers & Vintners' },
            { id: '3537', name: 'Soft Drinks' }
        ],
        '3570': [
            { id: '3573', name: 'Farming, Fishing & Plantations' },
            { id: '3577', name: 'Food Products' },
            { id: '3578', name: 'BMS' }
        ],
        '3720': [
            { id: '3722', name: 'Durable Household Products' },
            { id: '3724', name: 'Nondurable Household Products' },
            { id: '3726', name: 'Furnishings' },
            { id: '3728', name: 'Home Construction' }
        ],
        '3740': [
            { id: '3743', name: 'Consumer Electronics' },
            { id: '3745', name: 'Recreational Products' },
            { id: '3747', name: 'Toys' }
        ],
        '3760': [
            { id: '3763', name: 'Clothing & Accessories' },
            { id: '3765', name: 'Footwear' },
            { id: '3767', name: 'Personal Product' }
        ],
        '3780': [
            { id: '3785', name: 'Tobacco' }
        ],
        '4530': [
            { id: '4533', name: 'Health Care Providers' },
            { id: '4535', name: 'Medical Equipment' },
            { id: '4537', name: 'Medical Supplies' }
        ],
        '4570': [
            { id: '4573', name: 'Biotechnology' },
            { id: '4577', name: 'Pharmaceuticals' }
        ],
        '5330': [
            { id: '5333', name: 'Drug Retailers' },
            { id: '5337', name: 'Food Retailers & Wholesalers' }
        ],
        '5370': [
            { id: '5371', name: 'Apparel Retailers' },
            { id: '5373', name: 'Broadline Retailers' },
            { id: '5375', name: 'Home Improvement Retailers' },
            { id: '5377', name: 'Specialized Consumer Services' },
            { id: '5379', name: 'Specialty Retailers' }
        ],
        '5550': [
            { id: '5553', name: 'Broadcasting & Entertainment' },
            { id: '5555', name: 'Media Agencies' },
            { id: '5557', name: 'Publishing' }
        ],
        '5750': [
            { id: '5751', name: 'Airlines' },
            { id: '5752', name: 'Gambling' },
            { id: '5753', name: 'Hotels' },
            { id: '5755', name: 'Recreational Services' },
            { id: '5757', name: 'Restaurants & Bars' },
            { id: '5759', name: 'Travel & Tourism' }
        ],
        '6530': [
            { id: '6535', name: 'Fixed Line Telecommunications' }
        ],
        '6570': [
            { id: '6575', name: 'Mobile Telecommunications' }
        ],
        '7530': [
            { id: '7535', name: 'Conventional Electricity' },
            { id: '7537', name: 'Alternative Electricity' },
            { id: '7538', name: 'Nuclear Power Generators' }
        ],
        '7570': [
            { id: '7573', name: 'Gas Distribution' },
            { id: '7575', name: 'Multi-utilities' },
            { id: '7577', name: 'Water' }
        ],
        '8350': [
            { id: '8355', name: 'Banks' }
        ],
        '8530': [
            { id: '8532', name: 'Full Line Insurance' },
            { id: '8534', name: 'Insurance Brokers' },
            { id: '8536', name: 'Property & Casualty Insurance' },
            { id: '8538', name: 'Reinsurance' }
        ],
        '8570': [
            { id: '8575', name: 'Life Insurance' }
        ],
        '8630': [
            { id: '8633', name: 'Real Estate Holding & Development' },
            { id: '8637', name: 'Real Estate Services' }
        ],
        '8670': [
            { id: '8671', name: 'Industrial & Office REITs' },
            { id: '8672', name: 'Retail REITs' },
            { id: '8673', name: 'Residential REITs' },
            { id: '8674', name: 'Diversified REITs' },
            { id: '8675', name: 'Specialty REITs' },
            { id: '8676', name: 'Mortgage REITs' },
            { id: '8677', name: 'Hotel & Lodging REITs' }
        ],
        '8770': [
            { id: '8771', name: 'Asset Managers' },
            { id: '8773', name: 'Consumer Finance' },
            { id: '8775', name: 'Specialty Finance' },
            { id: '8777', name: 'Investment Services' },
            { id: '8779', name: 'Mortgage Finance' }
        ],
        '8980': [
            { id: '8985', name: 'Equity Investment Instruments' }
        ],
        '8990': [
            { id: '8995', name: 'Nonequity Investment Instruments' }
        ],
        '9530': [
            { id: '9533', name: 'Computer Services' },
            { id: '9535', name: 'Internet' },
            { id: '9537', name: 'Software' }
        ],
        '9570': [
            { id: '9572', name: 'Computer Hardware' },
            { id: '9574', name: 'Electronic Office Equipment' },
            { id: '9576', name: 'Semiconductors' },
            { id: '9578', name: 'Telecommunications Equipment' }
        ]
    }
};

export const SUBSECTOR_ID_TO_CODE: Record<number, string> = {
    1: '0533', 2: '0537', 3: '0573', 4: '0577', 5: '0583', 6: '0587',
    7: '1353', 8: '1357', 9: '1733', 10: '1737', 11: '1753', 12: '1755',
    13: '1757', 14: '1771', 15: '1773', 16: '1775', 17: '1777', 18: '1779',
    19: '2353', 20: '2357', 21: '2713', 22: '2717', 23: '2723', 24: '2727',
    25: '2733', 26: '2737', 27: '2753', 28: '2757', 29: '2771', 30: '2773',
    31: '2775', 32: '2777', 33: '2779', 34: '2791', 35: '2793', 36: '2795',
    37: '2797', 38: '2799', 39: '3353', 40: '3355', 41: '3357', 42: '3533',
    43: '3535', 44: '3537', 45: '3573', 46: '3577', 47: '3722', 48: '3724',
    49: '3726', 50: '3728', 51: '3743', 52: '3745', 53: '3747', 54: '3763',
    55: '3765', 56: '3767', 57: '3785', 58: '4533', 59: '4535', 60: '4537',
    61: '4573', 62: '4577', 63: '5333', 64: '5337', 65: '5371', 66: '5373',
    67: '5375', 68: '5377', 69: '5379', 70: '5553', 71: '5555', 72: '5557',
    73: '5751', 74: '5752', 75: '5753', 76: '5755', 77: '5757', 78: '5759',
    79: '6535', 80: '6575', 81: '7535', 82: '7537', 83: '7573', 84: '7575',
    85: '7577', 86: '8355', 87: '8532', 88: '8534', 89: '8536', 90: '8538',
    91: '8575', 92: '8633', 93: '8637', 94: '8671', 95: '8672', 96: '8673',
    97: '8674', 98: '8675', 99: '8676', 100: '8677', 101: '8771', 102: '8773',
    103: '8775', 104: '8777', 105: '8779', 106: '8985', 107: '8995',
    108: '9533', 109: '9535', 110: '9537', 111: '9572', 112: '9574',
    113: '9576', 114: '9578', 115: '3578', 116: '7538', 117: '2758',
    118: '1772', 119: '2798', 120: '1774'
};

export function resolveSubsectorCode(subsectorId?: string | number | null): string | null {
    if (subsectorId == null) return null;

    const numericId = typeof subsectorId === 'number' ? subsectorId : parseInt(subsectorId, 10);
    if (!isNaN(numericId) && SUBSECTOR_ID_TO_CODE[numericId]) {
        return SUBSECTOR_ID_TO_CODE[numericId];
    }

    const codeStr = String(subsectorId);
    for (const subsectors of Object.values(ICB_DATA.level3)) {
        if (subsectors.some((s) => s.id === codeStr)) {
            return codeStr;
        }
    }

    return null;
}

export function deriveIcbSelectionFromSubsector(subsectorId?: string | null): IcbSelection | null {
    if (!subsectorId) {
        return null;
    }

    for (const [supersectorId, subsectors] of Object.entries(ICB_DATA.level3)) {
        if (subsectors.some((subsector) => subsector.id === subsectorId)) {
            const industryEntry = ICB_DATA.level1.find((industry) => {
                const supersectors = ICB_DATA.level2[industry.id] || [];
                return supersectors.some((item) => item.id === supersectorId);
            });

            if (!industryEntry) {
                continue;
            }

            return {
                level1: industryEntry.id,
                level2: supersectorId,
                level3: supersectorId,
                level4: subsectorId
            };
        }
    }

    return null;
}
