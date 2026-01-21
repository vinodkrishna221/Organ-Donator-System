import { UrgencyLevel } from '../../models/index.js';

/**
 * Scoring Rules for Organ Matching
 * Total score: 0-100 points
 * 
 * Components:
 * - Blood compatibility: Mandatory filter (0 = exclude)
 * - HLA matching: 0-30 points
 * - Urgency score: 0-30 points
 * - Geographic proximity: 0-20 points
 * - Waiting time: 0-20 points
 */

export interface ScoringWeights {
    hlaMatching: number;
    urgency: number;
    geographic: number;
    waitingTime: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
    hlaMatching: 30,
    urgency: 30,
    geographic: 20,
    waitingTime: 20,
};

/**
 * Calculate HLA matching score (0-30 points)
 * In a real system, this would compare HLA antigens
 * For MVP, we use a simplified scoring
 */
export function calculateHlaScore(
    donorHlaType?: string,
    recipientHlaType?: string
): number {
    if (!donorHlaType || !recipientHlaType) {
        // No HLA data available, give neutral score
        return 15;
    }

    // Simplified: exact match = 30, partial = 15, no match = 5
    if (donorHlaType === recipientHlaType) {
        return 30;
    }

    // In production, compare individual HLA markers
    // For now, give partial score
    return 15;
}

/**
 * Calculate urgency score (0-30 points)
 */
export function calculateUrgencyScore(urgencyLevel: UrgencyLevel): number {
    const scores: Record<UrgencyLevel, number> = {
        [UrgencyLevel.CRITICAL]: 30,
        [UrgencyLevel.HIGH]: 22,
        [UrgencyLevel.MEDIUM]: 14,
        [UrgencyLevel.LOW]: 6,
    };

    return scores[urgencyLevel] || 14;
}

/**
 * Calculate geographic proximity score (0-20 points)
 * Based on same city/state
 */
export function calculateGeographicScore(
    donorState: string,
    donorCity: string,
    recipientState: string,
    recipientCity: string
): number {
    // Same city: 20 points
    if (donorCity.toLowerCase() === recipientCity.toLowerCase() &&
        donorState.toLowerCase() === recipientState.toLowerCase()) {
        return 20;
    }

    // Same state: 14 points
    if (donorState.toLowerCase() === recipientState.toLowerCase()) {
        return 14;
    }

    // Different state: base score
    return 5;
}

/**
 * Calculate waiting time score (0-20 points)
 * More waiting time = higher score
 */
export function calculateWaitingTimeScore(waitingSince: Date): number {
    const now = new Date();
    const waitingDays = Math.floor(
        (now.getTime() - waitingSince.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Score based on waiting days
    // 0-30 days: 5 points
    // 31-90 days: 10 points
    // 91-180 days: 15 points
    // 180+ days: 20 points
    if (waitingDays > 180) return 20;
    if (waitingDays > 90) return 15;
    if (waitingDays > 30) return 10;
    return 5;
}

/**
 * Calculate total match score
 */
export interface MatchScoreInput {
    bloodCompatible: boolean;
    donorHlaType?: string;
    recipientHlaType?: string;
    urgencyLevel: UrgencyLevel;
    donorState: string;
    donorCity: string;
    recipientState: string;
    recipientCity: string;
    waitingSince: Date;
}

export interface MatchScoreResult {
    bloodCompatibility: number;
    hlaMatching: number;
    urgencyScore: number;
    geographicProximity: number;
    waitingTime: number;
    total: number;
}

export function calculateMatchScore(input: MatchScoreInput): MatchScoreResult {
    // Blood compatibility is mandatory
    if (!input.bloodCompatible) {
        return {
            bloodCompatibility: 0,
            hlaMatching: 0,
            urgencyScore: 0,
            geographicProximity: 0,
            waitingTime: 0,
            total: 0,
        };
    }

    const hlaMatching = calculateHlaScore(input.donorHlaType, input.recipientHlaType);
    const urgencyScore = calculateUrgencyScore(input.urgencyLevel);
    const geographicProximity = calculateGeographicScore(
        input.donorState,
        input.donorCity,
        input.recipientState,
        input.recipientCity
    );
    const waitingTime = calculateWaitingTimeScore(input.waitingSince);

    return {
        bloodCompatibility: 100, // Passed filter
        hlaMatching,
        urgencyScore,
        geographicProximity,
        waitingTime,
        total: hlaMatching + urgencyScore + geographicProximity + waitingTime,
    };
}
