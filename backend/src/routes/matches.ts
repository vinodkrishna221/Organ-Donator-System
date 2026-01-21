import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/mockAuth.js';
import { UserRole } from '../models/index.js';
import * as matchController from '../controllers/matchController.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Generate matches for a donor (usually triggered automatically)
router.post(
    '/generate',
    requireRole(UserRole.CONSULTING_HOSPITAL, UserRole.NOTTO_ADMIN),
    matchController.generateMatches
);

// Get matches by donor
router.get(
    '/',
    requireRole(UserRole.HOSPITAL_ADMIN, UserRole.CONSULTING_HOSPITAL, UserRole.NOTTO_ADMIN),
    (req, res, next) => {
        if (req.query.donorId) {
            return matchController.getMatchesByDonor(req, res, next);
        }
        if (req.query.recipientId) {
            return matchController.getMatchesByRecipient(req, res, next);
        }
        res.status(400).json({
            success: false,
            error: { message: 'Either donorId or recipientId query parameter is required' },
        });
    }
);

// Get match statistics
router.get(
    '/stats',
    requireRole(UserRole.NOTTO_ADMIN),
    matchController.getMatchStats
);

// Accept a match
router.put(
    '/:id/accept',
    requireRole(UserRole.HOSPITAL_ADMIN),
    matchController.acceptMatch
);

// Reject a match
router.put(
    '/:id/reject',
    requireRole(UserRole.HOSPITAL_ADMIN),
    matchController.rejectMatch
);

export default router;
