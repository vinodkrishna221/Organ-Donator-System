'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/context/AuthContext';

export default function LoginPage() {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const { login } = useAuth();

    const handleLogin = () => {
        if (selectedRole) {
            login(selectedRole);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Organ Donation System</CardTitle>
                    <CardDescription>Select your role to access the portal</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={(val: string) => setSelectedRole(val as UserRole)}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HOSPITAL_ADMIN">Hospital Admin (Recipient Mgmt)</SelectItem>
                                    <SelectItem value="CONSULTING_HOSPITAL">Consulting Hospital (Donor Mgmt)</SelectItem>
                                    <SelectItem value="NOTTO_ADMIN">NOTTO Admin (Analytics)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleLogin} disabled={!selectedRole}>
                        Enter System
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
