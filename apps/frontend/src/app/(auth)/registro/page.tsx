'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Radio } from '@/components/ui/Radio';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function RegistroPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        rol: 'aspirante'
    });
    const [loading, setLoading] = useState(false);

    // Refs for navigation
    const nombreRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const rolAspiranteRef = useRef<HTMLInputElement>(null);
    const rolReclutadorRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        nombreRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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
                            ¿Ya tienes una cuenta? <Link href="/login" className="text-primary font-bold hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        <Input
                            ref={nombreRef}
                            id="nombre"
                            label="Nombre Completo"
                            placeholder=" "
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, emailRef)}
                            required
                        />

                        <Input
                            ref={emailRef}
                            id="email"
                            label="Correo Electrónico"
                            type="email"
                            placeholder=" "
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                            required
                        />

                        <Input
                            ref={passwordRef}
                            id="password"
                            label="Contraseña"
                            type="password"
                            placeholder=" "
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
                            required
                        />

                        <Input
                            ref={confirmPasswordRef}
                            id="confirmPassword"
                            label="Confirma Contraseña"
                            type="password"
                            placeholder=" "
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, rolAspiranteRef)}
                            required
                        />

                        <div className="space-y-3">
                            <span className="text-[14px] font-semibold text-gray-800 ml-0.5">Selecciona tu Rol</span>
                            <div className="flex gap-10 pl-1">
                                <Radio
                                    ref={rolAspiranteRef}
                                    label="Aspirante"
                                    name="rol"
                                    id="aspirante"
                                    checked={formData.rol === 'aspirante'}
                                    onChange={() => setFormData({ ...formData, rol: 'aspirante' })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowRight') rolReclutadorRef.current?.focus();
                                        if (e.key === 'Enter') submitRef.current?.focus();
                                    }}
                                />
                                <Radio
                                    ref={rolReclutadorRef}
                                    label="Reclutador"
                                    name="rol"
                                    id="reclutador"
                                    checked={formData.rol === 'reclutador'}
                                    onChange={() => setFormData({ ...formData, rol: 'reclutador' })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowLeft') rolAspiranteRef.current?.focus();
                                        if (e.key === 'Enter') submitRef.current?.focus();
                                    }}
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-center">
                            <Button
                                ref={submitRef}
                                type="submit"
                                className="px-12 py-3 text-[16px]"
                                disabled={loading}
                            >
                                {loading ? 'Registrando...' : 'Registrarse'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
