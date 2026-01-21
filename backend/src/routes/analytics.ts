import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/mockAuth.js';
import { UserRole } from '../models/index.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = Router();

// All analytics routes require authentication and NOTTO_ADMIN role
router.use(requireAuth);
router.use(requireRole(UserRole.NOTTO_ADMIN));

/**
 * GET /api/analytics/overview
 * Get overall platform statistics
 */
router.get('/overview', analyticsController.getOverviewStats);

/**
 * GET /api/analytics/by-state
 * Get statistics breakdown by state
 */
router.get('/by-state', analyticsController.getStatsByState);

/**
 * GET /api/analytics/by-organ
 * Get statistics breakdown by organ type
 */
router.get('/by-organ', analyticsController.getStatsByOrgan);

/**
 * GET /api/analytics/recent
 * Get recent activity feed
 */
router.get('/recent', analyticsController.getRecentActivity);

export default router;
