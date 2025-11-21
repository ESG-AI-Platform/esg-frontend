'use client';

interface UploadProgressProps {
    isUploading: boolean;
}

export function UploadProgress({ isUploading }: UploadProgressProps) {
    if (!isUploading) return null;

    return (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-sm text-blue-700 font-medium">Uploading files...</span>
            </div>
        </div>
    );
}
