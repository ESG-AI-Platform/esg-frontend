'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';

import { notifyError } from '@/shared/lib/notify-error';
import { ESGReportData } from '@/shared/types/esgReport';

import { deriveIcbSelectionFromSubsector } from '../constants/icb';
import { useFileUpload } from '../hooks/useFileUpload';
import { esgAnalyzerService } from '../services';
import { ESGProcessDocumentsResponse } from '../types';

import { CompanyBasicInfo } from './company-info/CompanyBasicInfo';
import { ICBSelector } from './company-info/ICBSelector';
import { FileList, FileUploadArea, UploadProgress } from './document-upload';
import { documentUploadSchema, type DocumentUploadFormValues } from './document-upload/schema';

interface DocumentUploadProps {
    reportData?: ESGReportData;
    onProcessingComplete?: (report: ESGProcessDocumentsResponse) => void;
}

function DocumentUploadContent({ isReadOnly, isProcessing, onSubmit }: { isReadOnly: boolean; isProcessing: boolean; onSubmit: () => void }) {
    const { fields, handleFileSelect, handleRemoveFile } = useFileUpload();

    const [isDragging, setIsDragging] = useState(false);

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
                            <>
                                <FileUploadArea
                                    isDragging={isDragging}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onFileSelect={handleFileSelect}
                                />
                                <UploadProgress isUploading={isProcessing} />

                            </>
                        )}

                        <FileList
                            documents={fields.map(f => ({ ...f, url: f.url || '' }))}
                            onDeleteDocument={isReadOnly ? undefined : handleRemoveFile}
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

                        <CompanyBasicInfo readOnly={isReadOnly} />
                        <ICBSelector readOnly={isReadOnly} />

                        {/* Submit Button - Only show when not in read-only mode */}
                        {!isReadOnly && (
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={onSubmit}
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

export function DocumentUpload({ reportData, onProcessingComplete }: DocumentUploadProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const isReadOnly = !!reportData;

    const getDefaultValues = (): DocumentUploadFormValues => {
        if (!reportData) {
            return {
                documents: [],
                companyName: '',
                companyWebsite: '',
                stockTicker: '',
                year: '',
                additionalInfo: '',
                industryId: '',
                supersectorId: '',
                sectorId: '',
                subsectorCode: ''
            };
        }

        const baseDefaults: DocumentUploadFormValues = {
            documents: [],
            companyName: reportData.companyName || '',
            companyWebsite: reportData.companyUrl || '',
            stockTicker: reportData.stockTicker || '',
            year: reportData.year?.toString() || '',
            additionalInfo: reportData.additionalInfo || '',
            industryId: reportData.industryId || '',
            supersectorId: reportData.supersectorId || '',
            sectorId: reportData.sectorId || '',
            subsectorCode: reportData.subsectorId || ''
        };

        if (reportData.subsectorId) {
            const derived = deriveIcbSelectionFromSubsector(reportData.subsectorId);
            if (derived) {
                baseDefaults.industryId = derived.level1 || baseDefaults.industryId;
                baseDefaults.supersectorId = derived.level2 || baseDefaults.supersectorId;
                baseDefaults.sectorId = derived.level3 || baseDefaults.sectorId;
                baseDefaults.subsectorCode = derived.level4 || baseDefaults.subsectorCode;
            }
        }

        const existingDocs = (reportData.documentInputName || []).map((name, index) => ({
            id: `existing-${index}`,
            name: name || `Document ${index + 1}`,
            url: reportData.documentInputUrl?.[index] || '',
            uploadedAt: reportData.createdAt || new Date().toISOString(),
            size: 0,
            type: 'application/pdf',
            file: undefined
        }));

        baseDefaults.documents = existingDocs;
        return baseDefaults;
    };

    const methods = useForm<DocumentUploadFormValues>({
        resolver: zodResolver(documentUploadSchema),
        defaultValues: getDefaultValues(),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<DocumentUploadFormValues> = async (data) => {
        try {
            setIsProcessing(true);

            const files = data.documents
                .filter(doc => doc.file !== undefined)
                .map(doc => doc.file as File);

            const companyData = {
                companyName: data.companyName,
                companyWebsite: data.companyWebsite || '',
                stockTicker: data.stockTicker || '',
                year: data.year,
                additionalInfo: data.additionalInfo || '',
                subsectorCode: data.subsectorCode || ''
            };

            const processingData = esgAnalyzerService.prepareProcessingData(companyData, files);
            const result = await esgAnalyzerService.processDocuments(processingData);

            if (onProcessingComplete) {
                onProcessingComplete(result);
            }
        } catch (error) {
            notifyError(error, {
                context: 'processDocuments',
                userMessage: 'Document processing failed',
            });

        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <DocumentUploadContent
                isReadOnly={isReadOnly}
                isProcessing={isProcessing}
                onSubmit={methods.handleSubmit(onSubmit)}
            />
        </FormProvider>
    );
}
