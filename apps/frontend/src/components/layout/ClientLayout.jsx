'use client';

import { ViewProvider } from '@/contexts/ViewContext';
import ConditionalNavbar from './ConditionalNavbar';
import MainContent from './MainContent';
import styles from './ClientLayout.module.css';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/registro');

  return (
    <ViewProvider>
      {!isAuthRoute && <ConditionalNavbar />}
      <MainContent>
        {children}
      </MainContent>
    </ViewProvider>
  );
}