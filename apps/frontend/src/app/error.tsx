'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error global:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h2>
                <p className="text-gray-600 mb-6 font-medium">
                    Ha ocurrido un error inesperado en la aplicación.
                </p>
                <Button
                    onClick={() => reset()}
                    className="w-full"
                >
                    Intentar de nuevo
                </Button>
            </div>
        </div>
    );
}
