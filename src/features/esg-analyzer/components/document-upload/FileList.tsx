'use client';

import type { FileInfo } from '@/shared/types/file';

interface FileListProps {
    documents: FileInfo[];
    onDeleteDocument?: (id: string) => void;
}

export function FileList({ documents, onDeleteDocument }: FileListProps) {
    if (documents.length === 0) return null; return (
        <div className="mt-4 sm:mt-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Uploaded Files ({documents.length})
            </h3>
            <div className="space-y-2">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                                    {doc.url && doc.url.startsWith('http') ? (
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-600 hover:underline"
                                            title="Open document"
                                        >
                                            {doc.name}
                                        </a>
                                    ) : (
                                        doc.name
                                    )}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {doc.size > 0 ? `${(doc.size / 1024 / 1024).toFixed(1)} MB` : 'Size unknown'}
                                    <span className="hidden sm:inline"> • {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            {/* View/Open button for existing documents */}
                            {doc.url && doc.url.startsWith('http') && (
                                <button
                                    onClick={() => window.open(doc.url, '_blank')}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                                    title="Open document"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </button>
                            )}
                            {onDeleteDocument && (
                                <button
                                    onClick={() => onDeleteDocument(doc.id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200"
                                    title="Delete file"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
