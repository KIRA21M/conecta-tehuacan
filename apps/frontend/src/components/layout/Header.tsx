'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const Header = () => {
    return (
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-50 flex justify-center fixed top-0 z-50">
            <div className="max-w-[1440px] w-full px-6 md:px-12 h-20 flex items-center justify-between">
                <Link href="/" className="group flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tight">
                        <span className="text-gray-900 group-hover:text-primary transition-colors">CONECTA</span>
                        <span className="text-primary ml-1.5 group-hover:text-gray-900 transition-colors">TEHUACÁN</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-10">
                    <Link href="/contacto" className="text-[15px] font-medium text-gray-500 hover:text-primary transition-colors">Contáctanos</Link>
                    <Link href="/empleos" className="text-[15px] font-medium text-gray-500 hover:text-primary transition-colors">Explorar Empleos</Link>
                    <Link href="/nosotros" className="text-[15px] font-medium text-gray-500 hover:text-primary transition-colors">Sobre Nosotros</Link>
                    <div className="h-6 w-[1px] bg-gray-200 mx-1" />
                    <Link href="/login" className="text-[15px] font-semibold text-primary hover:text-primary-hover transition-colors">Iniciar Sesión</Link>
                    <Link href="/registro">
                        <Button>Crear Cuenta</Button>
                    </Link>
                </nav>

                {/* Mobile menu could be added here if needed, but keeping fidelity to provided desktop capture */}
            </div>
        </header>
    );
};
