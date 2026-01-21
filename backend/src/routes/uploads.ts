import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../middleware/mockAuth.js';
import { UserRole } from '../models/index.js';
import { uploadService } from '../services/uploadService.js';
import { validateFile, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../types/healthHistory.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

// All routes require authentication
router.use(requireAuth);

/**
 * POST /api/uploads/medical-report
 * Upload a medical report file
 */
router.post(
    '/medical-report',
    requireRole(UserRole.HOSPITAL_ADMIN, UserRole.CONSULTING_HOSPITAL),
    upload.single('file'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    error: { message: 'No file uploaded' },
                });
                return;
            }

            const validation = validateFile(req.file);
            if (!validation.valid) {
                res.status(400).json({
                    success: false,
                    error: { message: validation.error },
                });
                return;
            }

            const uploaded = await uploadService.saveFile(req.file, {
                folder: 'medical-reports',
            });

            res.json({
                success: true,
                data: uploaded,
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * POST /api/uploads/consent-form
 * Upload a consent form
 */
router.post(
    '/consent-form',
    requireRole(UserRole.CONSULTING_HOSPITAL),
    upload.single('file'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    error: { message: 'No file uploaded' },
                });
                return;
            }

            const uploaded = await uploadService.saveFile(req.file, {
                folder: 'consent-forms',
            });

            res.json({
                success: true,
                data: uploaded,
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
