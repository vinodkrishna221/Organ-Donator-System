'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Mock data (since backend is not ready)
const mockRecipients = [
    { id: 1, name: 'Alice Smith', age: 34, bloodType: 'A+', organ: 'Kidney', urgency: 'High', status: 'Active' },
    { id: 2, name: 'Bob Jones', age: 52, bloodType: 'O-', organ: 'Liver', urgency: 'Critical', status: 'Active' },
    { id: 3, name: 'Charlie Day', age: 28, bloodType: 'AB+', organ: 'Heart', urgency: 'Medium', status: 'Matched' },
];

export default function RecipientsPage() {
    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Recipient Management</h1>
                <Link href="/recipients/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Recipient
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Recipients</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Blood Type</TableHead>
                                <TableHead>Organ Needed</TableHead>
                                <TableHead>Urgency</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockRecipients.map((recipient) => (
                                <TableRow key={recipient.id}>
                                    <TableCell className="font-medium">{recipient.name}</TableCell>
                                    <TableCell>{recipient.age}</TableCell>
                                    <TableCell>{recipient.bloodType}</TableCell>
                                    <TableCell>{recipient.organ}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${recipient.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                                                recipient.urgency === 'High' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {recipient.urgency}
                                        </span>
                                    </TableCell>
                                    <TableCell>{recipient.status}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
