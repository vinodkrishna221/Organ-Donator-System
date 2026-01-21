import mongoose, { Schema, Document } from 'mongoose';

export enum HospitalType {
    RECIPIENT_HOSPITAL = 'RECIPIENT_HOSPITAL',
    CONSULTING_HOSPITAL = 'CONSULTING_HOSPITAL',
}

export interface IHospital extends Document {
    name: string;
    type: HospitalType;
    registrationNumber: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    contact: {
        phone: string;
        email: string;
    };
    coordinates?: {
        lat: number;
        lng: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const hospitalSchema = new Schema<IHospital>(
    {
        name: { type: String, required: true },
        type: {
            type: String,
            enum: Object.values(HospitalType),
            required: true
        },
        registrationNumber: { type: String, required: true, unique: true },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        contact: {
            phone: { type: String, required: true },
            email: { type: String, required: true },
        },
        coordinates: {
            lat: Number,
            lng: Number,
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Hospital = mongoose.model<IHospital>('Hospital', hospitalSchema);
