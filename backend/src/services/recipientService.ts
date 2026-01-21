import { Recipient, IRecipient, RecipientStatus, UrgencyLevel } from '../models/index.js';
import { createError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

export interface CreateRecipientInput {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    bloodType: string;
    organNeeded: string;
    urgencyLevel?: UrgencyLevel;
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
    hlaType?: string;
    hospitalId: string;
}

export interface UpdateRecipientInput {
    name?: string;
    age?: number;
    organNeeded?: string;
    urgencyLevel?: UrgencyLevel;
    contact?: Partial<CreateRecipientInput['contact']>;
    address?: Partial<CreateRecipientInput['address']>;
    hlaType?: string;
    status?: RecipientStatus;
}

export interface HealthHistoryInput {
    date: Date;
    condition: string;
    treatment: string;
    hospital: string;
    notes?: string;
}

export interface MedicalReportInput {
    fileName: string;
    fileUrl: string;
    description?: string;
}

export class RecipientService {
    /**
     * Create a new recipient
     */
    async create(input: CreateRecipientInput): Promise<IRecipient> {
        const recipient = new Recipient({
            ...input,
            hospitalId: new mongoose.Types.ObjectId(input.hospitalId),
        });

        await recipient.save();
        return recipient;
    }

    /**
     * Get all recipients for a hospital
     */
    async findByHospital(
        hospitalId: string,
        filters?: {
            organNeeded?: string;
            bloodType?: string;
            urgencyLevel?: UrgencyLevel;
            status?: RecipientStatus;
        }
    ): Promise<IRecipient[]> {
        const query: Record<string, unknown> = {
            hospitalId: new mongoose.Types.ObjectId(hospitalId),
        };

        if (filters?.organNeeded) query.organNeeded = filters.organNeeded;
        if (filters?.bloodType) query.bloodType = filters.bloodType;
        if (filters?.urgencyLevel) query.urgencyLevel = filters.urgencyLevel;
        if (filters?.status) query.status = filters.status;

        return Recipient.find(query)
            .sort({ urgencyLevel: -1, waitingSince: 1 })
            .populate('hospitalId', 'name address');
    }

    /**
     * Get all recipients (for NOTTO admin)
     */
    async findAll(filters?: {
        organNeeded?: string;
        bloodType?: string;
        status?: RecipientStatus;
    }): Promise<IRecipient[]> {
        const query: Record<string, unknown> = {};

        if (filters?.organNeeded) query.organNeeded = filters.organNeeded;
        if (filters?.bloodType) query.bloodType = filters.bloodType;
        if (filters?.status) query.status = filters.status;

        return Recipient.find(query)
            .sort({ urgencyLevel: -1, waitingSince: 1 })
            .populate('hospitalId', 'name address');
    }

    /**
     * Get a single recipient by ID
     */
    async findById(id: string): Promise<IRecipient> {
        const recipient = await Recipient.findById(id)
            .populate('hospitalId', 'name address contact');

        if (!recipient) {
            throw createError('Recipient not found', 404);
        }

        return recipient;
    }

    /**
     * Update a recipient
     */
    async update(id: string, input: UpdateRecipientInput): Promise<IRecipient> {
        const recipient = await Recipient.findByIdAndUpdate(
            id,
            { $set: input },
            { new: true, runValidators: true }
        );

        if (!recipient) {
            throw createError('Recipient not found', 404);
        }

        return recipient;
    }

    /**
     * Add health history entry
     */
    async addHealthHistory(id: string, entry: HealthHistoryInput): Promise<IRecipient> {
        const recipient = await Recipient.findByIdAndUpdate(
            id,
            { $push: { healthHistory: entry } },
            { new: true }
        );

        if (!recipient) {
            throw createError('Recipient not found', 404);
        }

        return recipient;
    }

    /**
     * Add medical report
     */
    async addMedicalReport(id: string, report: MedicalReportInput): Promise<IRecipient> {
        const recipient = await Recipient.findByIdAndUpdate(
            id,
            {
                $push: {
                    medicalReports: {
                        ...report,
                        uploadDate: new Date(),
                    }
                }
            },
            { new: true }
        );

        if (!recipient) {
            throw createError('Recipient not found', 404);
        }

        return recipient;
    }

    /**
     * Delete a recipient
     */
    async delete(id: string): Promise<void> {
        const result = await Recipient.findByIdAndDelete(id);

        if (!result) {
            throw createError('Recipient not found', 404);
        }
    }
}

export const recipientService = new RecipientService();
