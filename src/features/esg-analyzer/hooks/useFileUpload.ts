import { useCallback } from 'react';

import { useFormContext, useFieldArray } from 'react-hook-form';

import { type DocumentUploadFormValues } from '../components/document-upload/schema';

export function useFileUpload() {
    const { control, setError, clearErrors } = useFormContext<DocumentUploadFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'documents',
    });

    const handleFileSelect = useCallback((fileList: FileList | null) => {
        if (!fileList) return;

        const newFiles = Array.from(fileList);
        const validFiles: File[] = [];
        const errors: string[] = [];

        newFiles.forEach((file) => {
            const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
            if (!isPdf) {
                errors.push(`${file.name}: Not a PDF`);
                return;
            }

            if (file.size > 50 * 1024 * 1024) {
                 errors.push(`${file.name}: File too large`);
                 return;
            }
            
            validFiles.push(file);
        });

        if (errors.length > 0) {
           setError('root', { message: `Some files were rejected: ${errors.join(', ')}` });
        } else {
            clearErrors('root');
        }

        validFiles.forEach((file) => {
            append({
                id: `temp-${Date.now()}-${Math.random()}`,
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString()
            });
        });

    }, [append, setError, clearErrors]);

    const handleRemoveFile = useCallback((index: number) => {
        remove(index);
    }, [remove]);

    return {
        fields,
        handleFileSelect,
        handleRemoveFile
    };
}
