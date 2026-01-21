import mongoose, { Schema, Document } from 'mongoose';
import { IHealthHistoryEntry } from './Donor.js';

export enum RecipientStatus {
    WAITING = 'WAITING',
    MATCHED = 'MATCHED',
    TRANSPLANTED = 'TRANSPLANTED',
    WITHDRAWN = 'WITHDRAWN',
}

export enum UrgencyLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export interface IMedicalReport {
    fileName: string;
    fileUrl: string;
    uploadDate: Date;
    description?: string;
}

export interface IRecipient extends Document {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    bloodType: string;
    organNeeded: string;
    urgencyLevel: UrgencyLevel;
    waitingSince: Date;
    healthHistory: IHealthHistoryEntry[];
    medicalReports: IMedicalReport[];
    hospitalId: mongoose.Types.ObjectId;
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
    hlaType?: string; // For HLA matching
    status: RecipientStatus;
    createdAt: Date;
    updatedAt: Date;
}

const healthHistoryEntrySchema = new Schema(
    {
        date: { type: Date, required: true },
        condition: { type: String, required: true },
        treatment: { type: String, required: true },
        hospital: { type: String, required: true },
        notes: String,
    },
    { _id: false }
);

const medicalReportSchema = new Schema<IMedicalReport>(
    {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        uploadDate: { type: Date, default: Date.now },
        description: String,
    },
    { _id: false }
);

const recipientSchema = new Schema<IRecipient>(
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
        organNeeded: { type: String, required: true },
        urgencyLevel: {
            type: String,
            enum: Object.values(UrgencyLevel),
            default: UrgencyLevel.MEDIUM
        },
        waitingSince: { type: Date, default: Date.now },
        healthHistory: [healthHistoryEntrySchema],
        medicalReports: [medicalReportSchema],
        hospitalId: {
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
        hlaType: String,
        status: {
            type: String,
            enum: Object.values(RecipientStatus),
            default: RecipientStatus.WAITING
        },
    },
    { timestamps: true }
);

export const Recipient = mongoose.model<IRecipient>('Recipient', recipientSchema);
