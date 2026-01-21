import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/mockAuth.js';
import { UserRole } from '../models/index.js';
import * as recipientController from '../controllers/recipientController.js';

const router = Router();

// All routes require authentication and HOSPITAL_ADMIN or NOTTO_ADMIN role
router.use(requireAuth);

// Create a new recipient
router.post(
    '/',
    requireRole(UserRole.HOSPITAL_ADMIN),
    recipientController.createRecipient
);

// Get all recipients (filtered by hospital for HOSPITAL_ADMIN)
router.get(
    '/',
    requireRole(UserRole.HOSPITAL_ADMIN, UserRole.NOTTO_ADMIN),
    recipientController.getRecipients
);

// Get a single recipient
router.get(
    '/:id',
    requireRole(UserRole.HOSPITAL_ADMIN, UserRole.NOTTO_ADMIN),
    recipientController.getRecipientById
);

// Update a recipient
router.put(
    '/:id',
    requireRole(UserRole.HOSPITAL_ADMIN),
    recipientController.updateRecipient
);

// Add health history entry
router.post(
    '/:id/health-history',
    requireRole(UserRole.HOSPITAL_ADMIN),
    recipientController.addHealthHistory
);

// Add medical report (file URL comes from upload service)
router.post(
    '/:id/medical-reports',
    requireRole(UserRole.HOSPITAL_ADMIN),
    recipientController.addMedicalReport
);

// Delete a recipient
router.delete(
    '/:id',
    requireRole(UserRole.HOSPITAL_ADMIN),
    recipientController.deleteRecipient
);

export default router;
