'use client';

import { RecipientForm } from '@/components/recipients/RecipientForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewRecipientPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Register New Recipient</h1>
                <p className="text-muted-foreground">Enter patient details and medical history.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Patient Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <RecipientForm />
                </CardContent>
            </Card>
        </div>
    );
}
