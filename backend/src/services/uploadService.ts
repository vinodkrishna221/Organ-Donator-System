import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
}

export interface UploadOptions {
    folder?: string;
    allowedTypes?: string[];
    maxSize?: number;
}

/**
 * Upload Service
 * Handles file uploads to local storage (can be extended to GCS)
 */
export class UploadService {
    private uploadDir: string;
    private baseUrl: string;

    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || './uploads';
        this.baseUrl = process.env.UPLOAD_BASE_URL || 'http://localhost:3001/uploads';

        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    /**
     * Save a file from multer
     */
    async saveFile(
        file: Express.Multer.File,
        options?: UploadOptions
    ): Promise<UploadedFile> {
        const folder = options?.folder || 'general';
        const folderPath = path.join(this.uploadDir, folder);

        // Ensure folder exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Generate unique filename
        const ext = path.extname(file.originalname);
        const fileName = `${uuidv4()}${ext}`;
        const filePath = path.join(folderPath, fileName);

        // Move file from temp to destination
        fs.writeFileSync(filePath, file.buffer);

        return {
            fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: `${this.baseUrl}/${folder}/${fileName}`,
        };
    }

    /**
     * Delete a file
     */
    async deleteFile(filePath: string): Promise<void> {
        const fullPath = path.join(this.uploadDir, filePath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }

    /**
     * Get file info
     */
    getFileUrl(folder: string, fileName: string): string {
        return `${this.baseUrl}/${folder}/${fileName}`;
    }
}

export const uploadService = new UploadService();
