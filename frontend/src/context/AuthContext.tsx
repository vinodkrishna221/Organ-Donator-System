'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'HOSPITAL_ADMIN' | 'CONSULTING_HOSPITAL' | 'NOTTO_ADMIN';

interface AuthContextType {
    role: UserRole | null;
    login: (role: UserRole) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole') as UserRole;
        if (storedRole) {
            setRole(storedRole);
        }
        setIsLoading(false);
    }, []);

    const login = (newRole: UserRole) => {
        localStorage.setItem('userRole', newRole);
        setRole(newRole);

        // Redirect based on role
        switch (newRole) {
            case 'HOSPITAL_ADMIN':
                router.push('/recipients');
                break;
            case 'CONSULTING_HOSPITAL':
                router.push('/donors');
                break;
            case 'NOTTO_ADMIN':
                router.push('/dashboard');
                break;
        }
    };

    const logout = () => {
        localStorage.removeItem('userRole');
        setRole(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ role, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
