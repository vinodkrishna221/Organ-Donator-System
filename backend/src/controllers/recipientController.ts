import { Request, Response, NextFunction } from 'express';
import { recipientService, CreateRecipientInput, UpdateRecipientInput } from '../services/recipientService.js';

export async function createRecipient(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const input: CreateRecipientInput = {
            ...req.body,
            hospitalId: req.user?.hospitalId || req.body.hospitalId,
        };

        const recipient = await recipientService.create(input);

        res.status(201).json({
            success: true,
            data: recipient,
        });
    } catch (error) {
        next(error);
    }
}

export async function getRecipients(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { hospitalId } = req.user || {};
        const filters = {
            organNeeded: req.query.organNeeded as string,
            bloodType: req.query.bloodType as string,
            urgencyLevel: req.query.urgencyLevel as string,
            status: req.query.status as string,
        };

        let recipients;
        if (hospitalId) {
            recipients = await recipientService.findByHospital(hospitalId, filters as Record<string, unknown>);
        } else {
            // NOTTO admin can see all
            recipients = await recipientService.findAll(filters as Record<string, unknown>);
        }

        res.json({
            success: true,
            data: recipients,
            count: recipients.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function getRecipientById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const recipient = await recipientService.findById(req.params.id);

        res.json({
            success: true,
            data: recipient,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateRecipient(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const input: UpdateRecipientInput = req.body;
        const recipient = await recipientService.update(req.params.id, input);

        res.json({
            success: true,
            data: recipient,
        });
    } catch (error) {
        next(error);
    }
}

export async function addHealthHistory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const recipient = await recipientService.addHealthHistory(req.params.id, req.body);

        res.json({
            success: true,
            data: recipient,
            message: 'Health history entry added',
        });
    } catch (error) {
        next(error);
    }
}

export async function addMedicalReport(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { fileName, fileUrl, description } = req.body;

        const recipient = await recipientService.addMedicalReport(req.params.id, {
            fileName,
            fileUrl,
            description,
        });

        res.json({
            success: true,
            data: recipient,
            message: 'Medical report added',
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteRecipient(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await recipientService.delete(req.params.id);

        res.json({
            success: true,
            message: 'Recipient deleted',
        });
    } catch (error) {
        next(error);
    }
}
