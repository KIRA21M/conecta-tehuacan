'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useView } from '@/contexts/ViewContext';
import CandidateSidebar from '@/components/layout/CandidateSidebar';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const { view } = useView();
  const [activeTab, setActiveTab] = useState('Mi perfil');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          // No hay sesión, redirigir a login
          router.push('/login');
          return;
        }

        const userData = JSON.parse(user);
        if (!userData.isAuthenticated) {
          // Usuario no autenticado, redirigir a login
          router.push('/login');
          return;
        }

        // Usuario autenticado
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Mostrar pantalla de carga mientras verifica autenticación
  if (loading) {
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

  if (view !== 'candidate') {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Mi perfil':
        return <h1>Aquí va el perfil del candidato</h1>;
      case 'Mi postulación':
        return <h1>Aquí van las postulaciones</h1>;
      case 'Mis favoritos':
        return <h1>Aquí van los empleos favoritos</h1>;
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