'use client';

import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full bg-[#0F172A] text-white py-16 flex justify-center mt-auto">
            <div className="max-w-[1440px] w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="max-w-sm">
                    <Link href="/" className="text-xl font-bold tracking-tight inline-block mb-6">
                        <span className="text-white">CONECTA</span>
                        <span className="text-primary ml-1.5">TEHUACÁN</span>
                    </Link>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        La plataforma líder en vinculación laboral exclusiva para la ciudad de Tehuacán y sus alrededores.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-[17px] font-bold">Contáctanos</h4>
                    <div className="flex gap-6">
                        <a href="https://facebook.com" className="text-white hover:text-primary transition-all hover:scale-110" aria-label="Facebook">
                            <Facebook size={24} />
                        </a>
                        <a href="https://instagram.com" className="text-white hover:text-primary transition-all hover:scale-110" aria-label="Instagram">
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
