import mongoose, { Schema, Document } from 'mongoose';

export enum OrganType {
    KIDNEY = 'KIDNEY',
    LIVER = 'LIVER',
    HEART = 'HEART',
    LUNGS = 'LUNGS',
    PANCREAS = 'PANCREAS',
    CORNEA = 'CORNEA',
    INTESTINES = 'INTESTINES',
    BONE_MARROW = 'BONE_MARROW',
}

export interface IOrgan extends Document {
    type: OrganType;
    donorId: mongoose.Types.ObjectId;
    status: 'AVAILABLE' | 'MATCHED' | 'TRANSPLANTED' | 'EXPIRED';
    harvestDate?: Date;
    expiryTime?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const organSchema = new Schema<IOrgan>(
    {
        type: {
            type: String,
            enum: Object.values(OrganType),
            required: true
        },
        donorId: {
            type: Schema.Types.ObjectId,
            ref: 'Donor',
            required: true
        },
        status: {
            type: String,
            enum: ['AVAILABLE', 'MATCHED', 'TRANSPLANTED', 'EXPIRED'],
            default: 'AVAILABLE'
        },
        harvestDate: Date,
        expiryTime: Date,
        notes: String,
    },
    { timestamps: true }
);

export const Organ = mongoose.model<IOrgan>('Organ', organSchema);

// Living donors can only donate kidney
export const LIVING_DONOR_ORGANS = [OrganType.KIDNEY];

// Deceased donors can donate multiple organs
export const DECEASED_DONOR_ORGANS = [
    OrganType.KIDNEY,
    OrganType.LIVER,
    OrganType.HEART,
    OrganType.LUNGS,
    OrganType.PANCREAS,
    OrganType.CORNEA,
    OrganType.INTESTINES,
    OrganType.BONE_MARROW,
];
