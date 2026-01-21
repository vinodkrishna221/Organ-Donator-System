import mongoose, { Schema, Document } from 'mongoose';

export enum MatchStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
}

export interface IMatchScore {
    bloodCompatibility: number;
    hlaMatching: number;
    urgencyScore: number;
    geographicProximity: number;
    waitingTime: number;
    total: number;
}

export interface IMatch extends Document {
    donorId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;
    organType: string;
    score: IMatchScore;
    status: MatchStatus;
    matchedAt: Date;
    decisionAt?: Date;
    decisionBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const matchScoreSchema = new Schema<IMatchScore>(
    {
        bloodCompatibility: { type: Number, required: true },
        hlaMatching: { type: Number, default: 0, max: 30 },
        urgencyScore: { type: Number, default: 0, max: 30 },
        geographicProximity: { type: Number, default: 0, max: 20 },
        waitingTime: { type: Number, default: 0, max: 20 },
        total: { type: Number, required: true, max: 100 },
    },
    { _id: false }
);

const matchSchema = new Schema<IMatch>(
    {
        donorId: {
            type: Schema.Types.ObjectId,
            ref: 'Donor',
            required: true
        },
        recipientId: {
            type: Schema.Types.ObjectId,
            ref: 'Recipient',
            required: true
        },
        organType: { type: String, required: true },
        score: { type: matchScoreSchema, required: true },
        status: {
            type: String,
            enum: Object.values(MatchStatus),
            default: MatchStatus.PENDING
        },
        matchedAt: { type: Date, default: Date.now },
        decisionAt: Date,
        decisionBy: { type: Schema.Types.ObjectId, ref: 'User' },
        rejectionReason: String,
        notes: String,
    },
    { timestamps: true }
);

// Compound index to prevent duplicate matches
matchSchema.index({ donorId: 1, recipientId: 1, organType: 1 }, { unique: true });

export const Match = mongoose.model<IMatch>('Match', matchSchema);
