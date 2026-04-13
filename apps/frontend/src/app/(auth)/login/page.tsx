'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';

export default function LoginPage() {
    const router = useRouter();
    const [values, setValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [shake, setShake] = useState(false);
    const { login } = useAuth();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

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

    const validateEmail = (value: string) => {
        if (!value.trim()) return 'El correo electrónico es obligatorio';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Ingresa un correo electrónico válido';
        return '';
    };

    const validatePassword = (value: string) => {
        if (!value.trim()) return 'La contraseña es obligatoria';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        return '';
    };

    const handleFieldChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValues((prev) => ({ ...prev, [field]: value }));

        if (touched[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: field === 'email' ? validateEmail(value) : validatePassword(value),
            }));
        }
    };

    const handleFieldBlur = (field: 'email' | 'password') => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({
            ...prev,
            [field]: field === 'email' ? validateEmail(values.email) : validatePassword(values.password),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        const emailError = validateEmail(values.email);
        const passwordError = validatePassword(values.password);
        const nextErrors = { email: emailError, password: passwordError };

        if (emailError || passwordError) {
            setErrors(nextErrors);
            setTouched({ email: true, password: true });
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setLoading(true);

        try {
            await login(values.email, values.password);

            // Redirect based on role - need to get user from context or session
            const session = authAPI.getSession();
            if (session?.user.role === 'aspirante') {
                router.push('/dashboard');
            } else {
                router.push('/recruiter');
            }
        } catch (err: any) {
            setFormError(err.message || 'Error al iniciar sesión');
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
                            <span className="text-gray-900">CONECTA</span>
                            <span className="text-primary ml-1.5">TEHUACÁN</span>
                        </h1>
                        <p className="text-[15px] text-gray-700">
                            ¿No tienes cuenta? <Link href="/registro" className="text-primary font-bold hover:underline">Crear Cuenta</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
                                {formError}
                            </div>
                        )}
                        <Input
                            ref={emailRef}
                            id="email"
                            label="Correo Electrónico"
                            type="email"
                            placeholder=" "
                            value={values.email}
                            onChange={handleFieldChange('email')}
                            onBlur={() => handleFieldBlur('email')}
                            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                            autoComplete="email"
                            error={touched.email ? errors.email : undefined}
                            aria-invalid={Boolean(errors.email)}
                            required
                        />
                        <Input
                            ref={passwordRef}
                            id="password"
                            label="Contraseña"
                            type="password"
                            placeholder=" "
                            value={values.password}
                            onChange={handleFieldChange('password')}
                            onBlur={() => handleFieldBlur('password')}
                            onKeyDown={(e) => handleKeyDown(e, submitRef)}
                            onKeyUp={(e) => handleKeyUp(e, emailRef)}
                            autoComplete="current-password"
                            error={touched.password ? errors.password : undefined}
                            aria-invalid={Boolean(errors.password)}
                            required
                        />
                        <div className="pt-2 flex flex-col items-center gap-6">
                            <Button
                                ref={submitRef}
                                type="submit"
                                className="px-10 py-3 text-[16px]"
                                disabled={loading}
                            >
                                {loading ? 'Cargando...' : 'Iniciar Sesión'}
                            </Button>
                            <Link href="/recuperar" className="text-[15px] font-bold text-gray-900 hover:text-primary transition-colors underline underline-offset-4">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </form>
                </Card>
            </main>

            <Footer />
        </div>
    );
}