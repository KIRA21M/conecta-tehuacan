'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useView } from '@/contexts/ViewContext';
import RecruiterSidebar from '@/components/layout/RecruiterSidebar';
import styles from './recruiter.module.css';

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { switchToRecruiterView } = useView();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Verificar que sea reclutador o admin
      if (user?.role !== 'reclutador' && user?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    }

    if (isAuthenticated) {
      switchToRecruiterView(false);
    }
  }, [isAuthenticated, isLoading, user, router, switchToRecruiterView]);

  // Mostrar pantalla de carga mientras verifica autenticación
  if (isLoading || !isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div
          style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <p style={{ color: '#64748b' }}>Verificando sesión...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya se redirigió)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      <RecruiterSidebar />
      <main className={styles.content} id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
