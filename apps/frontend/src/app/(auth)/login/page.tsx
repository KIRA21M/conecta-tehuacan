'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulating login
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FBFBFB]">
            <Header />

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
                <Card className="flex flex-col items-center">
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
                        <Input
                            ref={emailRef}
                            id="email"
                            label="Correo Electrónico"
                            type="email"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                            autoComplete="email"
                            required
                        />

                        <Input
                            ref={passwordRef}
                            id="password"
                            label="Contraseña"
                            type="password"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, submitRef)}
                            onKeyUp={(e) => handleKeyUp(e, emailRef)}
                            autoComplete="current-password"
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
