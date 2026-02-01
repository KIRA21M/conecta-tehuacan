'use client';

import { ViewProvider } from '@/contexts/ViewContext'
import ConditionalNavbar from '@/components/layout/ConditionalNavbar'
import MainContent from './MainContent'

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