'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CandidateSidebar from '@/components/layout/CandidateSidebar';
import ProfilePage from '@/components/dashboard/ProfilePage';
import ApplicationsPage from '@/components/dashboard/ApplicationsPage';
import FavoritesPage from '@/components/dashboard/FavoritesPage';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const { view, switchToCandidateView } = useView();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState('Mi perfil');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      switchToCandidateView();
    }
  }, [isAuthenticated, isLoading, switchToCandidateView, router]);

  // Mostrar pantalla de carga mientras verifica autenticación
  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#64748b' }}>Verificando sesión...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya se redirigió)
  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Mi perfil':
        return <ProfilePage />;
      case 'Mis postulaciones':
        return <ApplicationsPage />;
      case 'Mis favoritos':
        return <FavoritesPage />;
      default:
        return <h1>Dashboard del candidato</h1>;
    }
  };

  return (
    <div className={styles.dashboard}>
      <CandidateSidebar onTabChange={setActiveTab} />
      <main className={styles.content} id="main-content" tabIndex={-1}>
        {renderContent()}
      </main>
    </div>
  );
}