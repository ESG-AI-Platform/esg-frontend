'use client';

import { useEffect, useState } from 'react';

import { ESGReportData } from '@/shared/types/esgReport';
import type { FileInfo } from '@/shared/types/file';

import { deriveIcbSelectionFromSubsector, type IcbSelection } from '../constants/icb';
import { esgAnalyzerService } from '../services';
import { ESGProcessDocumentsResponse } from '../types';

import { CompanyBasicInfo, ICBSelector } from './company-info';
import { FileList, FileUploadArea } from './document-upload';

interface FileInfoWithFile extends FileInfo {
    file?: File;
}

interface DocumentUploadProps {
    reportData?: ESGReportData;
    onProcessingComplete?: (report: ESGProcessDocumentsResponse) => void;
}

export function DocumentUpload({ reportData, onProcessingComplete }: DocumentUploadProps) {
    const [documents, setDocuments] = useState<FileInfoWithFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const isReadOnly = !!reportData;

    // Company Info states
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [stockTicker, setStockTicker] = useState('');
    const [year, setYear] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [selectedICB, setSelectedICB] = useState<IcbSelection>({
        level1: '',
        level2: '',
        level3: '',
        level4: ''
    });

    // Load data from reportData when component mounts
    useEffect(() => {
        if (reportData) {
            setCompanyName(reportData.companyName || '');
            setCompanyWebsite(reportData.companyUrl || '');
            setStockTicker(reportData.stockTicker || '');
            setYear(reportData.year?.toString() || '');
            setAdditionalInfo(reportData.additionalInfo || '');
            const baseSelection: IcbSelection = {
                level1: reportData.industryId || '',
                level2: reportData.supersectorId || '',
                level3: reportData.sectorId || '',
                level4: reportData.subsectorId || ''
            };

            const derivedSelection = reportData.subsectorId
                ? deriveIcbSelectionFromSubsector(reportData.subsectorId)
                : null;

            const finalSelection: IcbSelection = derivedSelection
                ? {
                    level1: derivedSelection.level1 || baseSelection.level1,
                    level2: derivedSelection.level2 || baseSelection.level2,
                    level3: derivedSelection.level3 || baseSelection.level3,
                    level4: baseSelection.level4 || derivedSelection.level4
                }
                : baseSelection;

            setSelectedICB(finalSelection);

            let convertedDocuments: FileInfoWithFile[] = [];
            if (reportData.documentInputName && reportData.documentInputName.length > 0) {
                convertedDocuments = reportData.documentInputName.map((name: string, index: number) => ({
                    id: `existing-${index}`,
                    name: name || `Document ${index + 1}`,
                    url: reportData.documentInputUrl[index] || '',
                    uploadedAt: reportData.createdAt || new Date().toISOString(),
                    size: 0,
                    type: 'application/pdf'
                }));
            }

            setDocuments(convertedDocuments);
        } else {
            setSelectedICB({
                level1: '',
                level2: '',
                level3: '',
                level4: ''
            });
        }
    }, [reportData]);

    const handleFileSelect = (files: FileList | null) => {
        if (isReadOnly) return;

        if (!files || files.length === 0) return;

        const MAX_SIZE = 50 * 1024 * 1024; // 50MB
        const fileArray: File[] = Array.from(files);
        const accepted: File[] = [];
        const rejected: { name: string; reason: string }[] = [];

        fileArray.forEach((file: File) => {
            const name = file.name || 'Unknown';
            const isPdf = (file.type && file.type === 'application/pdf') || name.toLowerCase().endsWith('.pdf');

            if (!isPdf) {
                rejected.push({ name, reason: 'Not a PDF' });
                return;
            }

            if (file.size > MAX_SIZE) {
                rejected.push({ name, reason: 'File too large (max 50MB)' });
                return;
            }

            accepted.push(file);
        });

        if (rejected.length > 0) {
            const msgs = rejected.map(r => `${r.name}: ${r.reason}`);
            alert('Some files were not accepted:\n' + msgs.join('\n'));
        }

        accepted.forEach((file: File) => addFile(file));
    };

    const addFile = (file: File) => {
        if (isReadOnly) return;

        const uniqueId = `temp-${Date.now()}-${Math.random()}`;
        const fileInfoWithFile: FileInfoWithFile = {
            id: uniqueId,
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
        };

        setDocuments(prev => [...prev, fileInfoWithFile]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (isReadOnly) return;

        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        if (isReadOnly) return;

        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (isReadOnly) return;

        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDeleteDocument = async (id: string) => {
        if (isReadOnly) return;

        try {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const getUploadableFiles = (): File[] => {
        return documents.filter(doc => doc.file).map(doc => doc.file!);
    };

    // ICB Selection handlers
    const handleICBChange = (level: 'level1' | 'level2' | 'level3' | 'level4', value: string) => {
        if (isReadOnly) return;

        setSelectedICB(prev => {
            const newSelection = { ...prev };
            newSelection[level] = value;

            // Reset lower levels when upper level changes
            if (level === 'level1') {
                newSelection.level2 = '';
                newSelection.level3 = '';
                newSelection.level4 = '';
            } else if (level === 'level2') {
                newSelection.level3 = '';
                newSelection.level4 = '';
            } else if (level === 'level3') {
                newSelection.level4 = '';
            }

            return newSelection;
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* Input Files Container */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {isReadOnly ? 'Documents' : 'Upload Documents'}
                            {!isReadOnly && <span className="text-red-500 ml-1">*</span>}
                        </h2>
                    </div>
                    <div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                            {isReadOnly
                                ? 'Documents used for ESG analysis'
                                : 'Upload ESG-related documents for analysis (Annual reports, sustainability reports, etc.)'
                            }
                        </p>

                        {!isReadOnly && (
                            <FileUploadArea
                                isDragging={isDragging}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onFileSelect={handleFileSelect}
                            />
                        )}

                        <FileList
                            documents={documents}
                            onDeleteDocument={isReadOnly ? undefined : handleDeleteDocument}
                        />
                    </div>
                </div>

                {/* Input CompanyInfo Container */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Company Information</h2>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                        <p className="text-sm sm:text-base text-gray-600">Provide company details for comprehensive analysis</p>

                        <CompanyBasicInfo
                            companyName={companyName}
                            setCompanyName={isReadOnly ? () => { } : setCompanyName}
                            companyWebsite={companyWebsite}
                            setCompanyWebsite={isReadOnly ? () => { } : setCompanyWebsite}
                            stockTicker={stockTicker}
                            setStockTicker={isReadOnly ? () => { } : setStockTicker}
                            year={year}
                            setYear={isReadOnly ? () => { } : setYear}
                            additionalInfo={additionalInfo}
                            setAdditionalInfo={isReadOnly ? () => { } : setAdditionalInfo}
                            readOnly={isReadOnly}
                        />

                        <ICBSelector
                            selectedICB={selectedICB}
                            onICBChange={handleICBChange}
                            readOnly={isReadOnly}
                        />

                        {/* Submit Button - Only show when not in read-only mode */}
                        {!isReadOnly && (
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={async () => {
                                        const errors = [];

                                        if (!companyName.trim()) {
                                            errors.push('Company Name is required');
                                        }

                                        if (!year.trim()) {
                                            errors.push('Year Established is required');
                                        }

                                        if (!selectedICB.level1) {
                                            errors.push('Industry (ICB Level 1) is required');
                                        }

                                        if (getUploadableFiles().length === 0) {
                                            errors.push('At least one document is required');
                                        }

                                        if (errors.length > 0) {
                                            alert('Please fill in all required fields:\n' + errors.join('\n'));
                                            return;
                                        }

                                        const companyData = {
                                            companyName,
                                            companyWebsite,
                                            stockTicker,
                                            year,
                                            additionalInfo,
                                            // industryId: selectedICB.level1,
                                            // supersectorId: selectedICB.level2,
                                            // sectorId: selectedICB.level3,
                                            subsectorCode: selectedICB.level4
                                        };

                                        try {
                                            setIsProcessing(true);

                                            const fileArray = getUploadableFiles();
                                            const processingData = esgAnalyzerService.prepareProcessingData(companyData, fileArray);
                                            const result = await esgAnalyzerService.processDocuments(processingData);

                                            if (onProcessingComplete) {
                                                onProcessingComplete(result);
                                            }
                                        } catch (error) {
                                            console.error('Processing failed:', error);
                                            alert('Failed to process documents. Please try again.');
                                        } finally {
                                            setIsProcessing(false);
                                        }
                                    }}
                                    disabled={isProcessing}
                                    className="w-full px-4 py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Processing Documents...' : 'Process Documents'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
