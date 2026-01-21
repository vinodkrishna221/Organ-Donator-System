import { Request, Response, NextFunction } from 'express';
import { donorService, CreateDonorInput, UpdateDonorInput } from '../services/donorService.js';

export async function createDonor(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const input: CreateDonorInput = {
            ...req.body,
            consultingHospitalId: req.user?.hospitalId || req.body.consultingHospitalId,
        };

        const donor = await donorService.create(input);

        res.status(201).json({
            success: true,
            data: donor,
        });
    } catch (error) {
        next(error);
    }
}

export async function getDonors(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { hospitalId } = req.user || {};
        const filters = {
            bloodType: req.query.bloodType as string,
            donationType: req.query.donationType as string,
            status: req.query.status as string,
        };

        let donors;
        if (hospitalId) {
            donors = await donorService.findByHospital(hospitalId, filters as Record<string, unknown>);
        } else {
            // NOTTO admin can see all
            donors = await donorService.findAll(filters as Record<string, unknown>);
        }

        res.json({
            success: true,
            data: donors,
            count: donors.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function getDonorById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const donor = await donorService.findById(req.params.id);

        res.json({
            success: true,
            data: donor,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateDonor(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const input: UpdateDonorInput = req.body;
        const donor = await donorService.update(req.params.id, input);

        res.json({
            success: true,
            data: donor,
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
        const donor = await donorService.addHealthHistory(req.params.id, req.body);

        res.json({
            success: true,
            data: donor,
            message: 'Health history entry added',
        });
    } catch (error) {
        next(error);
    }
}

export async function addConsentForm(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { consentFormUrl } = req.body;

        if (!consentFormUrl) {
            res.status(400).json({
                success: false,
                error: { message: 'Consent form URL is required' },
            });
            return;
        }

        const donor = await donorService.addConsentForm(req.params.id, consentFormUrl);

        res.json({
            success: true,
            data: donor,
            message: 'Consent form added',
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteDonor(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await donorService.delete(req.params.id);

        res.json({
            success: true,
            message: 'Donor deleted',
        });
    } catch (error) {
        next(error);
    }
}
