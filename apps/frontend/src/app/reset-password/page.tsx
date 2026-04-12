'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authAPI } from '@/services/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ResetPasswordPage() {
    const [values, setValues] = useState({ password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
    const [touched, setTouched] = useState<{ password?: boolean; confirmPassword?: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState('');
    const [shake, setShake] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setFormError('Token de recuperación inválido o expirado.');
            return;
        }
        passwordRef.current?.focus();
    }, [token]);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent, prevRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            prevRef.current?.focus();
        }
    };

    const validatePassword = (value: string) => {
        if (!value.trim()) return 'La contraseña es obligatoria';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número';
        return '';
    };

    const validateConfirmPassword = (value: string, password: string) => {
        if (!value.trim()) return 'Confirma tu contraseña';
        if (value !== password) return 'Las contraseñas no coinciden';
        return '';
    };

    const handleFieldChange = (field: 'password' | 'confirmPassword') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValues((prev) => ({ ...prev, [field]: value }));

        if (touched[field]) {
            if (field === 'password') {
                setErrors((prev) => ({
                    ...prev,
                    password: validatePassword(value),
                    confirmPassword: values.confirmPassword ? validateConfirmPassword(values.confirmPassword, value) : prev.confirmPassword,
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: validateConfirmPassword(value, values.password),
                }));
            }
        }
    };

    const handleFieldBlur = (field: 'password' | 'confirmPassword') => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        if (field === 'password') {
            setErrors((prev) => ({
                ...prev,
                password: validatePassword(values.password),
                confirmPassword: values.confirmPassword ? validateConfirmPassword(values.confirmPassword, values.password) : prev.confirmPassword,
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateConfirmPassword(values.confirmPassword, values.password),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSuccess('');

        if (!token) {
            setFormError('Token de recuperación inválido o expirado.');
            return;
        }

        const passwordError = validatePassword(values.password);
        const confirmError = validateConfirmPassword(values.confirmPassword, values.password);
        const nextErrors = { password: passwordError, confirmPassword: confirmError };

        if (passwordError || confirmError) {
            setErrors(nextErrors);
            setTouched({ password: true, confirmPassword: true });
            setShake(true);
            setTimeout(() => setShake(false), 500);
            if (passwordError) {
                passwordRef.current?.focus();
            } else {
                confirmRef.current?.focus();
            }
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword(token, values.password);
            setSuccess('Tu contraseña ha sido cambiada exitosamente. Redirigiendo al inicio de sesión...');
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setFormError(err.message || 'Error al cambiar la contraseña');
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
                            <span className="text-gray-900">CAMBIAR</span>
                            <span className="text-primary ml-1.5">CONTRASEÑA</span>
                        </h1>
                        <p className="text-[15px] text-gray-700">
                            Ingresa tu nueva contraseña.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert" aria-live="polite">
                                {formError}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded" role="alert" aria-live="polite">
                                {success}
                            </div>
                        )}
                        <Input
                            ref={passwordRef}
                            id="password"
                            label="Nueva Contraseña"
                            type="password"
                            placeholder=" "
                            value={values.password}
                            onChange={handleFieldChange('password')}
                            onBlur={() => handleFieldBlur('password')}
                            onKeyDown={(e) => handleKeyDown(e, confirmRef)}
                            autoComplete="new-password"
                            error={touched.password ? errors.password : undefined}
                            aria-invalid={Boolean(errors.password)}
                            required
                        />
                        <Input
                            ref={confirmRef}
                            id="confirmPassword"
                            label="Confirmar Contraseña"
                            type="password"
                            placeholder=" "
                            value={values.confirmPassword}
                            onChange={handleFieldChange('confirmPassword')}
                            onBlur={() => handleFieldBlur('confirmPassword')}
                            onKeyDown={(e) => handleKeyDown(e, submitRef)}
                            onKeyUp={(e) => handleKeyUp(e, passwordRef)}
                            autoComplete="new-password"
                            error={touched.confirmPassword ? errors.confirmPassword : undefined}
                            aria-invalid={Boolean(errors.confirmPassword)}
                            required
                        />
                        <div className="pt-2 flex flex-col items-center gap-6">
                            <Button
                                ref={submitRef}
                                type="submit"
                                className="px-10 py-3 text-[16px]"
                                disabled={loading || !token}
                            >
                                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
