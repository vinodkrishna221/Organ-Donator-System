'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export function HealthHistoryForm() {
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'healthHistory',
    });

    return (
        <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Health History</CardTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ condition: '', treatment: '', notes: '' })}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="relative grid gap-4 rounded-md border p-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Condition</Label>
                                <Input {...register(`healthHistory.${index}.condition` as const)} placeholder="e.g. Diabetes" />
                            </div>
                            <div className="space-y-2">
                                <Label>Treatment</Label>
                                <Input {...register(`healthHistory.${index}.treatment` as const)} placeholder="e.g. Insulin" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea {...register(`healthHistory.${index}.notes` as const)} placeholder="Additional details..." />
                        </div>
                    </div>
                ))}
                {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No health history records added.</p>
                )}
            </CardContent>
        </Card>
    );
}
