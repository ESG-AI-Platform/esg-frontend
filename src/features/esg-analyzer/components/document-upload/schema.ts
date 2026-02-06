import { z } from 'zod';

const PDF_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const documentUploadSchema = z.object({
    companyName: z.string().min(1, 'Company Name is required'),
    companyWebsite: z.string().url('Invalid URL').optional().or(z.literal('')),
    stockTicker: z.string().optional(),
    year: z.string().min(1, 'Year Established is required'),
    additionalInfo: z.string().optional(),
    industryId: z.string().min(1, 'Industry (ICB Level 1) is required'),
    supersectorId: z.string().optional(),
    sectorId: z.string().optional(),
    subsectorCode: z.string().optional(),
    documents: z.array(
        z.object({
            id: z.string(),
            file: z.instanceof(File).optional(),
            name: z.string(),
            size: z.number(),
            type: z.string(),
            url: z.string().optional(),
            uploadedAt: z.string()
        })
    )
        .min(1, 'At least one document is required')
        .refine((files) => {
            return files.every((file) => {
                if (!file.file) return true;
                return file.size <= MAX_FILE_SIZE;
            });
        }, 'File size must be less than 50MB')
        .refine((files) => {
            return files.every((file) => {
                if (!file.file) return true;
                const isPdfType = PDF_MIME_TYPES.includes(file.type);
                const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
                return isPdfType || isPdfExt;
            });
        }, 'Only PDF files are allowed'),
});

export type DocumentUploadFormValues = z.infer<typeof documentUploadSchema>;
