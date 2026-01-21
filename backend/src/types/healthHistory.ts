export interface HealthHistoryInput {
    date: Date;
    condition: string;
    treatment: string;
    hospital: string;
    notes?: string;
}

export interface HealthHistoryEntry {
    date: Date;
    condition: string;
    treatment: string;
    hospital: string;
    notes?: string;
}

/**
 * Validate health history entry
 */
export function validateHealthHistoryEntry(entry: unknown): entry is HealthHistoryInput {
    if (typeof entry !== 'object' || entry === null) return false;

    const e = entry as Record<string, unknown>;

    return (
        e.date !== undefined &&
        typeof e.condition === 'string' &&
        typeof e.treatment === 'string' &&
        typeof e.hospital === 'string'
    );
}

/**
 * Get allowed file types for medical reports
 */
export const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Maximum file size (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validate file for upload
 */
export function validateFile(file: { mimetype: string; size: number }): { valid: boolean; error?: string } {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: PDF, JPEG, PNG, GIF, DOC, DOCX`,
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }

    return { valid: true };
}
