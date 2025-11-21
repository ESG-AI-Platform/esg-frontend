'use client';

import { ICB_DATA, type IcbSelection } from '../../constants/icb';

interface ICBSelectorProps {
    selectedICB: IcbSelection;
    onICBChange: (level: 'level1' | 'level2' | 'level3' | 'level4', value: string) => void;
    readOnly?: boolean;
}

export function ICBSelector({ selectedICB, onICBChange, readOnly = false }: ICBSelectorProps) {
    // Get filtered options for each level
    const getLevel2Options = () => selectedICB.level1 ? ICB_DATA.level2[selectedICB.level1] ?? [] : [];
    const getLevel3Options = () => {
        if (!selectedICB.level1 || !selectedICB.level2) {
            return [];
        }

        const supersector = ICB_DATA.level2[selectedICB.level1]?.find((item) => item.id === selectedICB.level2);
        return supersector ? [{ id: supersector.id, name: supersector.name }] : [];
    };
    const getLevel4Options = () => selectedICB.level3 ? ICB_DATA.level3[selectedICB.level3] ?? [] : [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Industry Classification (ICB)</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Level 1 - Industry */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Industry (Level 1)
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        value={selectedICB.level1}
                        onChange={(e) => !readOnly && onICBChange('level1', e.target.value)}
                        disabled={readOnly}
                        className={`w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                    >
                        <option value="">Select Industry...</option>
                        {ICB_DATA.level1.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Level 2 - Supersector */}
                {selectedICB.level1 && (
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Supersector (Level 2)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={selectedICB.level2}
                            onChange={(e) => !readOnly && onICBChange('level2', e.target.value)}
                            disabled={readOnly}
                            className={`w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                        >
                            <option value="">Select Supersector...</option>
                            {getLevel2Options().map((item: { id: string; name: string }) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Level 3 - Sector */}
                {selectedICB.level2 && (
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Sector (Level 3)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={selectedICB.level3}
                            onChange={(e) => !readOnly && onICBChange('level3', e.target.value)}
                            disabled={readOnly}
                            className={`w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                        >
                            <option value="">Select Sector...</option>
                            {getLevel3Options().map((item: { id: string; name: string }) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Level 4 - Subsector */}
                {selectedICB.level3 && (
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Subsector (Level 4)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={selectedICB.level4}
                            onChange={(e) => !readOnly && onICBChange('level4', e.target.value)}
                            disabled={readOnly}
                            className={`w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                        >
                            <option value="">Select Subsector...</option>
                            {getLevel4Options().map((item: { id: string; name: string }) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}
