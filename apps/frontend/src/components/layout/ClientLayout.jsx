'use client';

import { ViewProvider } from '@/contexts/ViewContext';
import ConditionalNavbar from './ConditionalNavbar';
import MainContent from './MainContent';
import styles from './ClientLayout.module.css';

export default function ClientLayout({ children }) {
  return (
    <ViewProvider>
      <ConditionalNavbar />
      <MainContent>
        {children}
      </MainContent>
    </ViewProvider>
  );
}