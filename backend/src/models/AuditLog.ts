import mongoose, { Schema, Document } from 'mongoose';

export enum AuditAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    MATCH_GENERATED = 'MATCH_GENERATED',
    MATCH_ACCEPTED = 'MATCH_ACCEPTED',
    MATCH_REJECTED = 'MATCH_REJECTED',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    ROLE_SELECTED = 'ROLE_SELECTED',
}

export interface IAuditLog extends Document {
    action: AuditAction;
    entityType: string;
    entityId?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    userRole?: string;
    details: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
    {
        action: {
            type: String,
            enum: Object.values(AuditAction),
            required: true
        },
        entityType: { type: String, required: true },
        entityId: Schema.Types.ObjectId,
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        userRole: String,
        details: { type: Schema.Types.Mixed, default: {} },
        ipAddress: String,
        userAgent: String,
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for querying by action and time
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
