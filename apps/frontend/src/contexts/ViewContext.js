'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ViewContext = createContext();

export function ViewProvider({ children }) {
  const [view, setView] = useState('public');
  const [shouldFocusFirstElement, setShouldFocusFirstElement] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const firstElementRef = useRef(null);

  const switchToCandidateView = () => {
    setView('candidate');
    setShouldFocusFirstElement(true);
    // Opcional: Redirigir a una ruta específica para candidatos
    // if (pathname === '/login') {
    //   router.push('/dashboard');
    // }
  };

  const switchToPublicView = () => {
    setView('public');
    setShouldFocusFirstElement(true);
  };

  // Reset to public view when navigating away from login/dashboard
  useEffect(() => {
    if (pathname !== '/login' && pathname !== '/dashboard') {
      setView('public');
    }
  }, [pathname]);

  // Enfocar primer elemento después de cambiar de vista
  useEffect(() => {
    if (shouldFocusFirstElement && firstElementRef.current) {
      setTimeout(() => {
        firstElementRef.current.focus();
        setShouldFocusFirstElement(false);
      }, 100);
    }
  }, [shouldFocusFirstElement, view]);

  return (
    <ViewContext.Provider value={{ 
      view, 
      setView,
      switchToCandidateView,
      switchToPublicView,
      firstElementRef 
    }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}