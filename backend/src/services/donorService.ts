import { Donor, IDonor, DonorStatus, DonationType, LIVING_DONOR_ORGANS, OrganType } from '../models/index.js';
import { createError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

export interface CreateDonorInput {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    bloodType: string;
    donationType: DonationType;
    organsAvailable: string[];
    contact: {
        phone: string;
        email?: string;
        emergencyContact: string;
    };
    address: {
        city: string;
        state: string;
        pincode: string;
    };
    consultingHospitalId: string;
}

export interface UpdateDonorInput {
    name?: string;
    age?: number;
    bloodType?: string;
    organsAvailable?: string[];
    contact?: Partial<CreateDonorInput['contact']>;
    address?: Partial<CreateDonorInput['address']>;
    status?: DonorStatus;
}

export interface HealthHistoryInput {
    date: Date;
    condition: string;
    treatment: string;
    hospital: string;
    notes?: string;
}

export class DonorService {
    /**
     * Create a new donor
     */
    async create(input: CreateDonorInput): Promise<IDonor> {
        // Validate organs based on donation type
        this.validateOrgans(input.donationType, input.organsAvailable);

        const donor = new Donor({
            ...input,
            consultingHospitalId: new mongoose.Types.ObjectId(input.consultingHospitalId),
        });

        await donor.save();
        return donor;
    }

    /**
     * Validate organs are allowed for donation type
     */
    private validateOrgans(donationType: DonationType, organs: string[]): void {
        if (donationType === DonationType.LIVING) {
            // Living donors can only donate 1 kidney
            const invalidOrgans = organs.filter(o => !LIVING_DONOR_ORGANS.includes(o as OrganType));

            if (invalidOrgans.length > 0) {
                throw createError(
                    `Living donors can only donate: ${LIVING_DONOR_ORGANS.join(', ')}. Invalid organs: ${invalidOrgans.join(', ')}`,
                    400
                );
            }

            if (organs.length > 1) {
                throw createError('Living donors can only donate 1 kidney', 400);
            }

            if (organs.length === 1 && organs[0] !== OrganType.KIDNEY) {
                throw createError('Living donors can only donate kidney', 400);
            }
        }
    }

    /**
     * Get all donors for a consulting hospital
     */
    async findByHospital(
        hospitalId: string,
        filters?: {
            bloodType?: string;
            donationType?: DonationType;
            status?: DonorStatus;
        }
    ): Promise<IDonor[]> {
        const query: Record<string, unknown> = {
            consultingHospitalId: new mongoose.Types.ObjectId(hospitalId),
        };

        if (filters?.bloodType) query.bloodType = filters.bloodType;
        if (filters?.donationType) query.donationType = filters.donationType;
        if (filters?.status) query.status = filters.status;

        return Donor.find(query)
            .sort({ createdAt: -1 })
            .populate('consultingHospitalId', 'name address');
    }

    /**
     * Get all donors (for NOTTO admin)
     */
    async findAll(filters?: {
        bloodType?: string;
        donationType?: DonationType;
        status?: DonorStatus;
    }): Promise<IDonor[]> {
        const query: Record<string, unknown> = {};

        if (filters?.bloodType) query.bloodType = filters.bloodType;
        if (filters?.donationType) query.donationType = filters.donationType;
        if (filters?.status) query.status = filters.status;

        return Donor.find(query)
            .sort({ createdAt: -1 })
            .populate('consultingHospitalId', 'name address');
    }

    /**
     * Get a single donor by ID
     */
    async findById(id: string): Promise<IDonor> {
        const donor = await Donor.findById(id)
            .populate('consultingHospitalId', 'name address contact');

        if (!donor) {
            throw createError('Donor not found', 404);
        }

        return donor;
    }

    /**
     * Update a donor
     */
    async update(id: string, input: UpdateDonorInput): Promise<IDonor> {
        // If updating organs, validate them
        if (input.organsAvailable) {
            const donor = await Donor.findById(id);
            if (donor) {
                this.validateOrgans(donor.donationType, input.organsAvailable);
            }
        }

        const donor = await Donor.findByIdAndUpdate(
            id,
            { $set: input },
            { new: true, runValidators: true }
        );

        if (!donor) {
            throw createError('Donor not found', 404);
        }

        return donor;
    }

    /**
     * Add health history entry
     */
    async addHealthHistory(id: string, entry: HealthHistoryInput): Promise<IDonor> {
        const donor = await Donor.findByIdAndUpdate(
            id,
            { $push: { healthHistory: entry } },
            { new: true }
        );

        if (!donor) {
            throw createError('Donor not found', 404);
        }

        return donor;
    }

    /**
     * Add consent form URL
     */
    async addConsentForm(id: string, consentFormUrl: string): Promise<IDonor> {
        const donor = await Donor.findByIdAndUpdate(
            id,
            { $set: { consentFormUrl } },
            { new: true }
        );

        if (!donor) {
            throw createError('Donor not found', 404);
        }

        return donor;
    }

    /**
     * Delete a donor
     */
    async delete(id: string): Promise<void> {
        const result = await Donor.findByIdAndDelete(id);

        if (!result) {
            throw createError('Donor not found', 404);
        }
    }
}

export const donorService = new DonorService();
