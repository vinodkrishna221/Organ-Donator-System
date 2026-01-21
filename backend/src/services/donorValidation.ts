import { DonationType, LIVING_DONOR_ORGANS, DECEASED_DONOR_ORGANS, OrganType } from '../models/index.js';
import { createError } from '../middleware/errorHandler.js';

/**
 * Donor Validation Service
 * Validates donor data based on donation type
 */

export interface DonorValidationInput {
    donationType: DonationType;
    organsAvailable: string[];
    age: number;
    consentFormUrl?: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Validate donor eligibility based on donation type
 */
export function validateDonorEligibility(input: DonorValidationInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate donation type
    if (!Object.values(DonationType).includes(input.donationType)) {
        errors.push('Invalid donation type. Must be LIVING or DECEASED.');
    }

    // Validate organs based on donation type
    if (input.donationType === DonationType.LIVING) {
        // Living donors can only donate 1 kidney
        const invalidOrgans = input.organsAvailable.filter(
            (o) => !LIVING_DONOR_ORGANS.includes(o as OrganType)
        );

        if (invalidOrgans.length > 0) {
            errors.push(
                `Living donors can only donate: ${LIVING_DONOR_ORGANS.join(', ')}. ` +
                `Invalid organs selected: ${invalidOrgans.join(', ')}`
            );
        }

        if (input.organsAvailable.length > 1) {
            errors.push('Living donors can only donate 1 kidney.');
        }

        // Age restrictions for living donors (typically 18-65)
        if (input.age < 18) {
            errors.push('Living donors must be at least 18 years old.');
        } else if (input.age > 65) {
            warnings.push('Living donors over 65 may face additional medical evaluations.');
        }
    } else if (input.donationType === DonationType.DECEASED) {
        // Deceased donors can donate multiple organs
        const invalidOrgans = input.organsAvailable.filter(
            (o) => !DECEASED_DONOR_ORGANS.includes(o as OrganType)
        );

        if (invalidOrgans.length > 0) {
            errors.push(
                `Invalid organs selected: ${invalidOrgans.join(', ')}. ` +
                `Valid organs: ${DECEASED_DONOR_ORGANS.join(', ')}`
            );
        }
    }

    // Consent form is mandatory
    if (!input.consentFormUrl) {
        warnings.push('Consent form not yet uploaded. Required before matching.');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Get available organs for a donation type
 */
export function getAvailableOrgans(donationType: DonationType): OrganType[] {
    return donationType === DonationType.LIVING
        ? [...LIVING_DONOR_ORGANS]
        : [...DECEASED_DONOR_ORGANS];
}

/**
 * Check if a specific organ is valid for a donation type
 */
export function isOrganValidForDonationType(organ: string, donationType: DonationType): boolean {
    const allowedOrgans = getAvailableOrgans(donationType);
    return allowedOrgans.includes(organ as OrganType);
}
