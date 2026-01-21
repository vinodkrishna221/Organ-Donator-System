import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
    CONSULTING_HOSPITAL = 'CONSULTING_HOSPITAL',
    NOTTO_ADMIN = 'NOTTO_ADMIN',
}

export interface IUser extends Document {
    name: string;
    email: string;
    role: UserRole;
    hospitalId?: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true
        },
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
