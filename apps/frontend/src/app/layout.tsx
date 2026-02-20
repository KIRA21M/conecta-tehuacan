'use client';

import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ViewProvider } from '@/contexts/ViewContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <ViewProvider>
                    {children}
                </ViewProvider>
            </body>
        </html>
    );
}
