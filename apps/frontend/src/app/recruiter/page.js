'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useView } from '@/contexts/ViewContext';
import RecruiterSidebar from '@/components/layout/RecruiterSidebar';
import styles from './recruiter.module.css';

export default function Recruiter() {
  const { view, switchToRecruiterView } = useView();
  const [activeTab, setActiveTab] = useState('Mis vacantes');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          router.push('/login');
          return;
        }

        const userData = JSON.parse(user);
        
        // Verificar que sea reclutador
        if (userData.role !== 'reclutador') {
          router.push('/dashboard');
          return;
        }

        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      switchToRecruiterView();
    }
  }, [isAuthenticated, switchToRecruiterView]);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'Mis vacantes':
        return <h1>Aquí van las vacantes</h1>;
      case 'Candidatos':
        return <h1>Aquí van los candidatos</h1>;
      case 'Mensajes':
        return <h1>Aquí van los mensajes</h1>;
      case 'Perfil empresa':
        return (
          <>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 'bold', fontSize: '24px' }}>
              Perfil Empresa
            </h1>
            <p>Aquí va la información de la empresa</p>
          </>
        );
      default:
        return <h1>Dashboard del reclutador</h1>;
    }
  };

  return (
    <div className={styles.dashboard}>
      <RecruiterSidebar onTabChange={setActiveTab} />
      <main className={styles.content} id="main-content" tabIndex={-1}>
        {renderContent()}
      </main>
    </div>
  );
}