import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/index.js';

// Extend Express Request to include mock user
declare global {
    namespace Express {
        interface Request {
            user?: {
                role: UserRole;
                hospitalId?: string;
            };
        }
    }
}

/**
 * Mock authentication middleware
 * In production, this would validate JWT tokens
 * For MVP, we accept role from header or cookie
 */
export function mockAuth(req: Request, res: Response, next: NextFunction): void {
    // Get role from header (for testing) or cookie (for frontend)
    const roleHeader = req.headers['x-user-role'] as string;
    const roleCookie = req.cookies?.userRole;
    const hospitalIdHeader = req.headers['x-hospital-id'] as string;

    const role = roleHeader || roleCookie;

    if (role && Object.values(UserRole).includes(role as UserRole)) {
        req.user = {
            role: role as UserRole,
            hospitalId: hospitalIdHeader,
        };
    }

    next();
}

/**
 * Require authentication for a route
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: { message: 'Authentication required. Please select a role.' },
        });
        return;
    }
    next();
}

/**
 * Require specific role(s) for a route
 */
export function requireRole(...roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: { message: 'Authentication required' },
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: { message: `Access denied. Required roles: ${roles.join(', ')}` },
            });
            return;
        }

        next();
    };
}
