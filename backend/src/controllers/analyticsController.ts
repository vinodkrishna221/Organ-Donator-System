import { Request, Response, NextFunction } from 'express';
import { Donor, Recipient, Match, Hospital, MatchStatus, DonorStatus, RecipientStatus } from '../models/index.js';

export async function getOverviewStats(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const [
            totalDonors,
            totalRecipients,
            totalMatches,
            acceptedMatches,
            pendingMatches,
            totalHospitals,
        ] = await Promise.all([
            Donor.countDocuments(),
            Recipient.countDocuments(),
            Match.countDocuments(),
            Match.countDocuments({ status: MatchStatus.ACCEPTED }),
            Match.countDocuments({ status: MatchStatus.PENDING }),
            Hospital.countDocuments(),
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalDonors,
                    totalRecipients,
                    totalMatches,
                    acceptedMatches,
                    pendingMatches,
                    totalHospitals,
                    successRate: totalMatches > 0
                        ? ((acceptedMatches / totalMatches) * 100).toFixed(1) + '%'
                        : '0%',
                },
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getStatsByState(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const donorsByState = await Donor.aggregate([
            { $group: { _id: '$address.state', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const recipientsByState = await Recipient.aggregate([
            { $group: { _id: '$address.state', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Merge data by state
        const stateMap = new Map<string, { donors: number; recipients: number }>();

        for (const d of donorsByState) {
            stateMap.set(d._id, { donors: d.count, recipients: 0 });
        }

        for (const r of recipientsByState) {
            const existing = stateMap.get(r._id) || { donors: 0, recipients: 0 };
            existing.recipients = r.count;
            stateMap.set(r._id, existing);
        }

        const byState = Array.from(stateMap.entries()).map(([state, data]) => ({
            state,
            ...data,
        }));

        res.json({
            success: true,
            data: { byState },
        });
    } catch (error) {
        next(error);
    }
}

export async function getStatsByOrgan(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const donorsByOrgan = await Donor.aggregate([
            { $unwind: '$organsAvailable' },
            { $group: { _id: '$organsAvailable', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const recipientsByOrgan = await Recipient.aggregate([
            { $group: { _id: '$organNeeded', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const matchesByOrgan = await Match.aggregate([
            { $match: { status: MatchStatus.ACCEPTED } },
            { $group: { _id: '$organType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        res.json({
            success: true,
            data: {
                donorsByOrgan: donorsByOrgan.map(d => ({ organ: d._id, count: d.count })),
                recipientsByOrgan: recipientsByOrgan.map(r => ({ organ: r._id, count: r.count })),
                transplantsByOrgan: matchesByOrgan.map(m => ({ organ: m._id, count: m.count })),
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getRecentActivity(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const limit = parseInt(req.query.limit as string) || 10;

        const recentDonors = await Donor.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('name donationType status address.state createdAt');

        const recentRecipients = await Recipient.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('name organNeeded urgencyLevel status createdAt');

        const recentMatches = await Match.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('organType status score.total matchedAt');

        res.json({
            success: true,
            data: {
                recentDonors,
                recentRecipients,
                recentMatches,
            },
        });
    } catch (error) {
        next(error);
    }
}
