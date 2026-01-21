import { Request, Response, NextFunction } from 'express';
import { matchingEngine } from '../services/matching/matchingEngine.js';

export async function generateMatches(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { donorId } = req.body;

        if (!donorId) {
            res.status(400).json({
                success: false,
                error: { message: 'Donor ID is required' },
            });
            return;
        }

        const matches = await matchingEngine.generateMatchesForDonor(donorId);

        res.json({
            success: true,
            data: matches,
            count: matches.length,
            message: `Generated ${matches.length} potential matches`,
        });
    } catch (error) {
        next(error);
    }
}

export async function getMatchesByDonor(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { donorId } = req.query;

        if (!donorId) {
            res.status(400).json({
                success: false,
                error: { message: 'Donor ID is required' },
            });
            return;
        }

        const matches = await matchingEngine.findMatchesForDonor(donorId as string);

        res.json({
            success: true,
            data: matches,
            count: matches.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function getMatchesByRecipient(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { recipientId } = req.query;

        if (!recipientId) {
            res.status(400).json({
                success: false,
                error: { message: 'Recipient ID is required' },
            });
            return;
        }

        const matches = await matchingEngine.findMatchesForRecipient(recipientId as string);

        res.json({
            success: true,
            data: matches,
            count: matches.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function acceptMatch(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user?.hospitalId || 'system';

        const match = await matchingEngine.acceptMatch(id, userId);

        res.json({
            success: true,
            data: match,
            message: 'Match accepted successfully',
        });
    } catch (error) {
        next(error);
    }
}

export async function rejectMatch(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user?.hospitalId || 'system';

        const match = await matchingEngine.rejectMatch(id, userId, reason);

        res.json({
            success: true,
            data: match,
            message: 'Match rejected',
        });
    } catch (error) {
        next(error);
    }
}

export async function getMatchStats(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const stats = await matchingEngine.getMatchStats();

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
}
