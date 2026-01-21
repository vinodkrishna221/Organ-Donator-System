import { Router, Request, Response } from 'express';
import { UserRole } from '../models/index.js';

const router = Router();

/**
 * GET /api/auth/roles
 * Returns available roles for mock authentication
 */
router.get('/roles', (req: Request, res: Response) => {
    const roles = Object.values(UserRole).map((role) => ({
        value: role,
        label: role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        description: getRoleDescription(role),
    }));

    res.json({
        success: true,
        data: roles,
    });
});

/**
 * POST /api/auth/select-role
 * Sets user role (mock login)
 */
router.post('/select-role', (req: Request, res: Response) => {
    const { role, hospitalId } = req.body;

    if (!role || !Object.values(UserRole).includes(role)) {
        res.status(400).json({
            success: false,
            error: { message: 'Invalid role. Must be one of: ' + Object.values(UserRole).join(', ') },
        });
        return;
    }

    // Set cookie for frontend persistence
    res.cookie('userRole', role, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
    });

    if (hospitalId) {
        res.cookie('hospitalId', hospitalId, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax',
        });
    }

    res.json({
        success: true,
        data: {
            role,
            hospitalId: hospitalId || null,
            message: `Successfully selected role: ${role}`,
            redirectTo: getRedirectPath(role),
        },
    });
});

/**
 * POST /api/auth/logout
 * Clears role (mock logout)
 */
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('userRole');
    res.clearCookie('hospitalId');

    res.json({
        success: true,
        data: { message: 'Logged out successfully' },
    });
});

/**
 * GET /api/auth/me
 * Returns current user info (from mock session)
 */
router.get('/me', (req: Request, res: Response) => {
    const role = req.cookies?.userRole || req.headers['x-user-role'];
    const hospitalId = req.cookies?.hospitalId || req.headers['x-hospital-id'];

    if (!role) {
        res.status(401).json({
            success: false,
            error: { message: 'Not authenticated' },
        });
        return;
    }

    res.json({
        success: true,
        data: {
            role,
            hospitalId: hospitalId || null,
            permissions: getRolePermissions(role as UserRole),
        },
    });
});

// Helper functions
function getRoleDescription(role: UserRole): string {
    const descriptions: Record<UserRole, string> = {
        [UserRole.HOSPITAL_ADMIN]: 'Manage recipients and view matches for your hospital',
        [UserRole.CONSULTING_HOSPITAL]: 'Register donors and manage organ availability',
        [UserRole.NOTTO_ADMIN]: 'View analytics, manage system, and oversee all operations',
    };
    return descriptions[role];
}

function getRedirectPath(role: UserRole): string {
    const paths: Record<UserRole, string> = {
        [UserRole.HOSPITAL_ADMIN]: '/dashboard/recipients',
        [UserRole.CONSULTING_HOSPITAL]: '/dashboard/donors',
        [UserRole.NOTTO_ADMIN]: '/admin/dashboard',
    };
    return paths[role];
}

function getRolePermissions(role: UserRole): string[] {
    const permissions: Record<UserRole, string[]> = {
        [UserRole.HOSPITAL_ADMIN]: [
            'recipients:create',
            'recipients:read',
            'recipients:update',
            'matches:read',
            'matches:accept',
            'matches:reject',
            'chatbot:use',
        ],
        [UserRole.CONSULTING_HOSPITAL]: [
            'donors:create',
            'donors:read',
            'donors:update',
            'matches:read',
            'chatbot:use',
        ],
        [UserRole.NOTTO_ADMIN]: [
            'analytics:read',
            'users:manage',
            'hospitals:manage',
            'audit:read',
            'chatbot:use',
        ],
    };
    return permissions[role];
}

export default router;
