'use client';

import { useState, useEffect, useRef } from 'react';
import { useView } from '@/contexts/ViewContext';
import RecruiterSidebar from '@/components/layout/RecruiterSidebar';
import styles from './login.module.css';

export default function Login() {
  const { view, switchToCandidateView } = useView();
  const [activeTab, setActiveTab] = useState('Mis Vacantes');
  const firstButtonRef = useRef(null);

  useEffect(() => {
    if (view === 'public' && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, [view]);

  const handleCandidateClick = () => {
    setView('candidate');
  };

  const getContent = () => {
    switch (activeTab) {
      case 'Mis Vacantes':
        return <h1>Aquí van las vacantes</h1>;
      case 'Candidatos':
        return <h1>Aquí van los candidatos</h1>;
      case 'Mensajes':
        return <h1>Aquí van los mensajes</h1>;
      case 'Perfil Empresa':
        return <h1>Aquí va el perfil de la empresa</h1>;
      default:
        return <h1>Panel de control</h1>;
    }
  };

  if (view === 'candidate') {
    return (
      <div className={styles.dashboard}>
        <RecruiterSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className={styles.content} id="main-content" tabIndex={-1}>
          {getContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button ref={firstButtonRef} className={styles.button} tabIndex={1}>
        Dashboard Reclutador
      </button>
      <button 
        className={styles.button} 
        onClick={switchToCandidateView}
        tabIndex={2}
      >
        Acceso Candidato
      </button>
    </div>
  );
}