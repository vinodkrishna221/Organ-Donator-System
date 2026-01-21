'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HealthHistoryForm } from './HealthHistoryForm';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const recipientSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    age: z.coerce.number().min(0, 'Age must be a positive number'),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    organNeeded: z.enum(['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas']),
    urgency: z.enum(['Low', 'Medium', 'High', 'Critical']),
    healthHistory: z.array(z.object({
        condition: z.string(),
        treatment: z.string(),
        notes: z.string().optional(),
    })).optional(),
});

type RecipientFormValues = z.infer<typeof recipientSchema>;

export function RecipientForm() {
    const router = useRouter();
    const form = useForm<RecipientFormValues>({
        resolver: zodResolver(recipientSchema) as any,
        defaultValues: {
            healthHistory: [],
        },
    });

    async function onSubmit(data: RecipientFormValues) {
        try {
            // API call would go here
            // await api.post('/recipients', data); 
            console.log('Submitting:', data);
            toast.success('Recipient registered successfully (Mock)');
            router.push('/recipients');
        } catch (error) {
            console.error(error);
            toast.error('Failed to register recipient');
        }
    }

    return (
        <FormProvider {...form}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="30" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bloodType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blood Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select blood type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="organNeeded"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organ Needed</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select organ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas'].map((organ) => (
                                                <SelectItem key={organ} value={organ}>{organ}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="urgency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Urgency Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select urgency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                                                <SelectItem key={level} value={level}>{level}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <HealthHistoryForm />

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit">Register Recipient</Button>
                    </div>
                </form>
            </Form>
        </FormProvider>
    );
}
