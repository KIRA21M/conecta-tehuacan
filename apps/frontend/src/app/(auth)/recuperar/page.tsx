'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authAPI } from '@/services/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitRef.current?.focus();
        }
    };

    const validateEmail = (value: string) => {
        if (!value.trim()) return 'El correo electrónico es obligatorio';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Ingresa un correo electrónico válido';
        return '';
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setLoading(true);

        try {
            await authAPI.forgotPassword(email);
            setSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        } catch (err: any) {
            setError(err.message || 'Error al enviar el correo de recuperación');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FBFBFB]">
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-6px); }
                    80% { transform: translateX(6px); }
                }
                @media (prefers-reduced-motion: no-preference) {
                    .shake {
                        animation: shake 0.5s ease;
                    }
                }
            `}</style>

            <Header />

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
                <Card className={`flex flex-col items-center ${shake ? 'shake' : ''}`}>
                    <div className="mb-8 text-center">
                        <h1 className="text-[22px] font-bold tracking-tight mb-6">
                            <span className="text-gray-900">RECUPERAR</span>
                            <span className="text-primary ml-1.5">CONTRASEÑA</span>
                        </h1>
                        <p className="text-[15px] text-gray-700">
                            Ingresa tu correo electrónico para recibir un enlace de recuperación.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert" aria-live="polite">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded" role="alert" aria-live="polite">
                                {success}
                            </div>
                        )}
                        <Input
                            ref={emailRef}
                            id="email"
                            label="Correo Electrónico"
                            type="email"
                            placeholder=" "
                            value={email}
                            onChange={handleEmailChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="email"
                            error={error}
                            aria-invalid={Boolean(error)}
                            required
                        />
                        <div className="pt-2 flex flex-col items-center gap-6">
                            <Button
                                ref={submitRef}
                                type="submit"
                                className="px-10 py-3 text-[16px]"
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar Enlace'}
                            </Button>
                            <Link href="/login" className="text-[15px] font-bold text-gray-900 hover:text-primary transition-colors underline underline-offset-4">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                </Card>
            </main>

            <Footer />
        </div>
    );
}