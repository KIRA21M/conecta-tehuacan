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
    router.push('/dashboard');
  };

  const switchToRecruiterView = () => {
    setView('recruiter');
    setShouldFocusFirstElement(true);
    router.push('/recruiter');
  };

  const switchToPublicView = () => {
    setView('public');
    setShouldFocusFirstElement(true);
    router.push('/');
  };

  useEffect(() => {
    if (pathname !== '/login' && pathname !== '/dashboard' && pathname !== '/recruiter') {
      setView('public');
    }
  }, [pathname]);

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
      switchToRecruiterView,
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