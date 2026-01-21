import mongoose, { Schema, Document } from 'mongoose';

export enum DonationType {
    LIVING = 'LIVING',   // Before death - only 1 kidney allowed
    DECEASED = 'DECEASED', // After death - multiple organs
}

export enum DonorStatus {
    REGISTERED = 'REGISTERED',
    VERIFIED = 'VERIFIED',
    MATCHED = 'MATCHED',
    DONATED = 'DONATED',
    WITHDRAWN = 'WITHDRAWN',
}

export interface IHealthHistoryEntry {
    date: Date;
    condition: string;
    treatment: string;
    hospital: string;
    notes?: string;
}

export interface IDonor extends Document {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    bloodType: string;
    donationType: DonationType;
    organsAvailable: string[];
    healthHistory: IHealthHistoryEntry[];
    consentFormUrl?: string;
    consultingHospitalId: mongoose.Types.ObjectId;
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
    status: DonorStatus;
    createdAt: Date;
    updatedAt: Date;
}

const healthHistoryEntrySchema = new Schema<IHealthHistoryEntry>(
    {
        date: { type: Date, required: true },
        condition: { type: String, required: true },
        treatment: { type: String, required: true },
        hospital: { type: String, required: true },
        notes: String,
    },
    { _id: false }
);

const donorSchema = new Schema<IDonor>(
    {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE', 'OTHER'],
            required: true
        },
        bloodType: {
            type: String,
            required: true,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        donationType: {
            type: String,
            enum: Object.values(DonationType),
            required: true
        },
        organsAvailable: [{ type: String }],
        healthHistory: [healthHistoryEntrySchema],
        consentFormUrl: String,
        consultingHospitalId: {
            type: Schema.Types.ObjectId,
            ref: 'Hospital',
            required: true
        },
        contact: {
            phone: { type: String, required: true },
            email: String,
            emergencyContact: { type: String, required: true },
        },
        address: {
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        status: {
            type: String,
            enum: Object.values(DonorStatus),
            default: DonorStatus.REGISTERED
        },
    },
    { timestamps: true }
);

export const Donor = mongoose.model<IDonor>('Donor', donorSchema);
