'use client';

import { useRef } from 'react';

import { Card } from '@/shared/components';

interface FileUploadAreaProps {
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: (files: FileList | null) => void;
}

export function FileUploadArea({
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileSelect
}: FileUploadAreaProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="mb-4 sm:mb-6">
            <Card className="p-4 sm:p-6">
                <div
                    className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${isDragging
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <div className="space-y-3">
                        <div className="mx-auto w-8 h-8 sm:w-12 sm:h-12 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm sm:text-base font-medium text-gray-900">
                                <span className="hidden sm:inline">Drop files here or click to upload</span>
                                <span className="sm:hidden">Tap to upload files</span>
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                <span className="hidden sm:inline">Supports PDF files only, up to 50MB</span>
                                <span className="sm:hidden">PDF up to 50MB</span>
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-3 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Choose Files
                            </button>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        // Only allow selecting PDF files from the file picker
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                            onFileSelect(e.target.files);
                            if (e.target) {
                                // reset so the same file can be picked again if needed
                                e.target.value = '';
                            }
                        }}
                        className="hidden"
                    />
                </div>
            </Card>
        </div>
    );
}
