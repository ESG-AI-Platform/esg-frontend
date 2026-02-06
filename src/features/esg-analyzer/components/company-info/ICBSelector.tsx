'use client';

import { useFormContext } from 'react-hook-form';

import { ICB_DATA } from '../../constants/icb';
import { type DocumentUploadFormValues } from '../document-upload/schema';

interface ICBSelectorProps {
    readOnly?: boolean;
}

export function ICBSelector({ readOnly = false }: ICBSelectorProps) {
    const { register, watch, setValue, formState: { errors } } = useFormContext<DocumentUploadFormValues>();
    
    const industryId = watch('industryId');
    const supersectorId = watch('supersectorId');
    const sectorId = watch('sectorId');

    // Get filtered options for each level
    const getLevel2Options = () => industryId ? ICB_DATA.level2[industryId] ?? [] : [];
    const getLevel3OptionsAdapted = () => {
        if (!industryId || !supersectorId) {
            return [];
        }
        const supersector = ICB_DATA.level2[industryId]?.find((item) => item.id === supersectorId);
        return supersector ? [{ id: supersector.id, name: supersector.name }] : [];
    };
    
    const getLevel4Options = () => sectorId ? ICB_DATA.level3[sectorId] ?? [] : [];

    const handleLevel1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue('industryId', e.target.value);
        setValue('supersectorId', '');
        setValue('sectorId', '');
        setValue('subsectorCode', '');
    };

    const handleLevel2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue('supersectorId', e.target.value);
        setValue('sectorId', '');
        setValue('subsectorCode', '');
    };

    const handleLevel3Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue('sectorId', e.target.value);
        setValue('subsectorCode', '');
    };

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
                        {...register('industryId')}
                        onChange={handleLevel1Change}
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
                    {errors.industryId && <p className="text-red-500 text-xs mt-1">{errors.industryId.message}</p>}
                </div>

                {/* Level 2 - Supersector */}
                {industryId && (
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Supersector (Level 2)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            {...register('supersectorId')}
                            onChange={handleLevel2Change}
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
                {supersectorId && (
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Sector (Level 3)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            {...register('sectorId')}
                            onChange={handleLevel3Change}
                            disabled={readOnly}
                            className={`w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                        >
                            <option value="">Select Sector...</option>
                            {getLevel3OptionsAdapted().map((item: { id: string; name: string }) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Level 4 - Subsector */}
                {sectorId && (
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Subsector (Level 4)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            {...register('subsectorCode')}
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
