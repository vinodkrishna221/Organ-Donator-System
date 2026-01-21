import { Donor, Recipient, Match, IMatch, MatchStatus, IDonor, IRecipient } from '../../models/index.js';
import { isBloodCompatible } from './bloodCompatibility.js';
import { calculateMatchScore, MatchScoreResult } from './scoringRules.js';
import mongoose from 'mongoose';

export interface MatchCandidate {
    recipient: IRecipient;
    score: MatchScoreResult;
}

/**
 * Matching Engine
 * Generates and ranks matches between donors and recipients
 */
export class MatchingEngine {
    /**
     * Generate matches for a donor
     * Called when a new donor is registered
     */
    async generateMatchesForDonor(donorId: string): Promise<IMatch[]> {
        const donor = await Donor.findById(donorId);
        if (!donor) {
            throw new Error('Donor not found');
        }

        // Get all waiting recipients who need organs the donor has
        const recipients = await Recipient.find({
            status: 'WAITING',
            organNeeded: { $in: donor.organsAvailable },
        }).populate('hospitalId');

        const matches: IMatch[] = [];

        for (const recipient of recipients) {
            // Check blood compatibility first
            if (!isBloodCompatible(donor.bloodType, recipient.bloodType)) {
                continue;
            }

            // Calculate match score
            const score = calculateMatchScore({
                bloodCompatible: true,
                donorHlaType: undefined, // Would come from donor record
                recipientHlaType: recipient.hlaType,
                urgencyLevel: recipient.urgencyLevel,
                donorState: donor.address.state,
                donorCity: donor.address.city,
                recipientState: recipient.address.state,
                recipientCity: recipient.address.city,
                waitingSince: recipient.waitingSince,
            });

            // Create match record for each organ
            for (const organ of donor.organsAvailable) {
                if (organ === recipient.organNeeded) {
                    try {
                        const match = new Match({
                            donorId: new mongoose.Types.ObjectId(donorId),
                            recipientId: recipient._id,
                            organType: organ,
                            score,
                            status: MatchStatus.PENDING,
                            matchedAt: new Date(),
                        });

                        await match.save();
                        matches.push(match);
                    } catch (error: unknown) {
                        // Handle duplicate match (already exists)
                        const err = error as { code?: number };
                        if (err.code === 11000) {
                            console.log(`Match already exists for donor ${donorId} and recipient ${recipient._id}`);
                        } else {
                            throw error;
                        }
                    }
                }
            }
        }

        // Sort matches by score (highest first)
        matches.sort((a, b) => b.score.total - a.score.total);

        return matches;
    }

    /**
     * Find best matches for a recipient
     */
    async findMatchesForRecipient(recipientId: string): Promise<IMatch[]> {
        return Match.find({
            recipientId: new mongoose.Types.ObjectId(recipientId),
            status: MatchStatus.PENDING,
        })
            .sort({ 'score.total': -1 })
            .populate('donorId')
            .populate('recipientId');
    }

    /**
     * Find all matches for a donor
     */
    async findMatchesForDonor(donorId: string): Promise<IMatch[]> {
        return Match.find({
            donorId: new mongoose.Types.ObjectId(donorId),
        })
            .sort({ 'score.total': -1 })
            .populate('donorId')
            .populate('recipientId');
    }

    /**
     * Accept a match
     */
    async acceptMatch(matchId: string, userId: string): Promise<IMatch> {
        const match = await Match.findByIdAndUpdate(
            matchId,
            {
                status: MatchStatus.ACCEPTED,
                decisionAt: new Date(),
                decisionBy: new mongoose.Types.ObjectId(userId),
            },
            { new: true }
        );

        if (!match) {
            throw new Error('Match not found');
        }

        // Update recipient and donor status
        await Recipient.findByIdAndUpdate(match.recipientId, { status: 'MATCHED' });
        await Donor.findByIdAndUpdate(match.donorId, { status: 'MATCHED' });

        // Reject other pending matches for this donor-organ pair
        await Match.updateMany(
            {
                _id: { $ne: match._id },
                donorId: match.donorId,
                organType: match.organType,
                status: MatchStatus.PENDING,
            },
            { status: MatchStatus.EXPIRED }
        );

        return match;
    }

    /**
     * Reject a match
     */
    async rejectMatch(matchId: string, userId: string, reason?: string): Promise<IMatch> {
        const match = await Match.findByIdAndUpdate(
            matchId,
            {
                status: MatchStatus.REJECTED,
                decisionAt: new Date(),
                decisionBy: new mongoose.Types.ObjectId(userId),
                rejectionReason: reason,
            },
            { new: true }
        );

        if (!match) {
            throw new Error('Match not found');
        }

        return match;
    }

    /**
     * Get match statistics
     */
    async getMatchStats(): Promise<{
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
    }> {
        const [total, pending, accepted, rejected] = await Promise.all([
            Match.countDocuments(),
            Match.countDocuments({ status: MatchStatus.PENDING }),
            Match.countDocuments({ status: MatchStatus.ACCEPTED }),
            Match.countDocuments({ status: MatchStatus.REJECTED }),
        ]);

        return { total, pending, accepted, rejected };
    }
}

export const matchingEngine = new MatchingEngine();
