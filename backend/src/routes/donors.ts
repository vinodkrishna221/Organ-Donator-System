import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/mockAuth.js';
import { UserRole } from '../models/index.js';
import * as donorController from '../controllers/donorController.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Create a new donor
router.post(
    '/',
    requireRole(UserRole.CONSULTING_HOSPITAL),
    donorController.createDonor
);

// Get all donors (filtered by hospital for CONSULTING_HOSPITAL)
router.get(
    '/',
    requireRole(UserRole.CONSULTING_HOSPITAL, UserRole.NOTTO_ADMIN),
    donorController.getDonors
);

// Get a single donor
router.get(
    '/:id',
    requireRole(UserRole.CONSULTING_HOSPITAL, UserRole.NOTTO_ADMIN, UserRole.HOSPITAL_ADMIN),
    donorController.getDonorById
);

// Update a donor
router.put(
    '/:id',
    requireRole(UserRole.CONSULTING_HOSPITAL),
    donorController.updateDonor
);

// Add health history entry
router.post(
    '/:id/health-history',
    requireRole(UserRole.CONSULTING_HOSPITAL),
    donorController.addHealthHistory
);

// Add consent form (file URL comes from upload service)
router.post(
    '/:id/consent',
    requireRole(UserRole.CONSULTING_HOSPITAL),
    donorController.addConsentForm
);

// Delete a donor
router.delete(
    '/:id',
    requireRole(UserRole.CONSULTING_HOSPITAL),
    donorController.deleteDonor
);

export default router;
