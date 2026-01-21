/**
 * Blood Type Compatibility Matrix for Organ Donation
 */

// Blood type compatibility (donor -> recipient)
const BLOOD_COMPATIBILITY: Record<string, string[]> = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'], // Universal recipient can only receive AB+
};

/**
 * Check if blood types are compatible for transplant
 * @param donorBloodType Donor's blood type
 * @param recipientBloodType Recipient's blood type
 * @returns true if compatible
 */
export function isBloodCompatible(
    donorBloodType: string,
    recipientBloodType: string
): boolean {
    const compatibleRecipients = BLOOD_COMPATIBILITY[donorBloodType];
    if (!compatibleRecipients) {
        return false;
    }
    return compatibleRecipients.includes(recipientBloodType);
}

/**
 * Get all compatible recipient blood types for a donor
 */
export function getCompatibleRecipientTypes(donorBloodType: string): string[] {
    return BLOOD_COMPATIBILITY[donorBloodType] || [];
}

/**
 * Get all compatible donor blood types for a recipient
 */
export function getCompatibleDonorTypes(recipientBloodType: string): string[] {
    const compatibleDonors: string[] = [];

    for (const [donorType, recipients] of Object.entries(BLOOD_COMPATIBILITY)) {
        if (recipients.includes(recipientBloodType)) {
            compatibleDonors.push(donorType);
        }
    }

    return compatibleDonors;
}

/**
 * Calculate blood compatibility score (for matching)
 * - Exact match: 100
 * - Compatible: 80
 * - Incompatible: 0
 */
export function getBloodCompatibilityScore(
    donorBloodType: string,
    recipientBloodType: string
): number {
    if (donorBloodType === recipientBloodType) {
        return 100;
    }

    if (isBloodCompatible(donorBloodType, recipientBloodType)) {
        return 80;
    }

    return 0;
}
