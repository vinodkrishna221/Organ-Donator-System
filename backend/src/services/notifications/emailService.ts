import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

/**
 * Email Service using Nodemailer
 */
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_PORT === 465,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
            },
        });
    }

    /**
     * Send an email
     */
    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: env.EMAIL_FROM,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.stripHtml(options.html),
            });
            console.log(`Email sent: ${options.subject}`);
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }

    /**
     * Verify transporter connection
     */
    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch {
            return false;
        }
    }

    private stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '');
    }
}

export const emailService = new EmailService();
