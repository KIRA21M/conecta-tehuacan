'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
                        <p className="text-gray-600 mb-6">Hemos detectado un error inesperado. Por favor, intenta recargar la página.</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            Recargar página
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
