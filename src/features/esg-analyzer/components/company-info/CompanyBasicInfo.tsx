'use client';

import { useState } from 'react';

interface CompanyBasicInfoProps {
    companyName: string;
    setCompanyName: (value: string) => void;
    companyWebsite: string;
    setCompanyWebsite: (value: string) => void;
    stockTicker: string;
    setStockTicker: (value: string) => void;
    year: string;
    setYear: (value: string) => void;
    additionalInfo: string;
    setAdditionalInfo: (value: string) => void;
    readOnly?: boolean;
}

export function CompanyBasicInfo({
    companyName,
    setCompanyName,
    companyWebsite,
    setCompanyWebsite,
    stockTicker,
    setStockTicker,
    year,
    setYear,
    additionalInfo,
    setAdditionalInfo,
    readOnly = false
}: CompanyBasicInfoProps) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (field: string, value: string) => {
        const newErrors = { ...errors };

        switch (field) {
            case 'companyName':
                if (!value.trim()) {
                    newErrors[field] = 'Company name is required';
                } else {
                    delete newErrors[field];
                }
                break;
            case 'companyWebsite':
                if (value && !value.match(/^https?:\/\/.+/)) {
                    newErrors[field] = 'Please enter a valid URL';
                } else {
                    delete newErrors[field];
                }
                break;
            case 'year':
                const currentYear = new Date().getFullYear();
                const yearNum = parseInt(value);
                if (value && (isNaN(yearNum) || yearNum < 1800 || yearNum > currentYear)) {
                    newErrors[field] = `Please enter a valid year between 1800 and ${currentYear}`;
                } else {
                    delete newErrors[field];
                }
                break;
        }

        setErrors(newErrors);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name Input */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => {
                                if (!readOnly) {
                                    setCompanyName(e.target.value);
                                    validateField('companyName', e.target.value);
                                }
                            }}
                            readOnly={readOnly}
                            className={`w-full pl-10 pr-3 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'} ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                                }`}
                            placeholder="Enter company name..."
                        />
                    </div>
                    {errors.companyName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.companyName}
                        </p>
                    )}
                </div>

                {/* Company Website URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Website
                        <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                        </div>
                        <input
                            type="url"
                            value={companyWebsite}
                            onChange={(e) => {
                                if (!readOnly) {
                                    setCompanyWebsite(e.target.value);
                                    validateField('companyWebsite', e.target.value);
                                }
                            }}
                            readOnly={readOnly}
                            className={`w-full pl-10 pr-3 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.companyWebsite ? 'border-red-300 bg-red-50' : 'border-gray-300'} ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                            placeholder="https://company.com"
                        />
                    </div>
                    {errors.companyWebsite && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.companyWebsite}
                        </p>
                    )}
                </div>

                {/* Stock Ticker */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Ticker
                        <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={stockTicker}
                            onChange={(e) => {
                                if (!readOnly) {
                                    setStockTicker(e.target.value.toUpperCase());
                                }
                            }}
                            readOnly={readOnly}
                            className={`w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                            placeholder="e.g., AAPL, MSFT"
                            maxLength={10}
                        />
                    </div>
                </div>

                {/* Year */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={year}
                            onChange={(e) => {
                                if (!readOnly) {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setYear(value);
                                    validateField('year', value);
                                }
                            }}
                            readOnly={readOnly}
                            className={`w-full pl-10 pr-3 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.year ? 'border-red-300 bg-red-50' : 'border-gray-300'} ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                            placeholder="YYYY"
                            maxLength={4}
                        />
                    </div>
                    {errors.year && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.year}
                        </p>
                    )}
                </div>

                {/* Additional Information */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Information
                        <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <textarea
                            value={additionalInfo}
                            onChange={(e) => {
                                if (!readOnly) {
                                    setAdditionalInfo(e.target.value);
                                }
                            }}
                            readOnly={readOnly}
                            rows={4}
                            className={`w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                            placeholder="Any specific ESG focus areas, sustainability initiatives, or additional context about your company..."
                        />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        {additionalInfo.length}/500 characters
                    </div>
                </div>
            </div>
        </div>
    );
}
