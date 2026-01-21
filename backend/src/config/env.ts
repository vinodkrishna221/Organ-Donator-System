import dotenv from 'dotenv';
dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/organ-donation',

    // GCP / Vertex AI
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID || '',
    VERTEX_AI_LOCATION: process.env.VERTEX_AI_LOCATION || 'us-central1',

    // Email (Nodemailer)
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@organdonation.in',
};
