'use client';

import { useState } from 'react';
import { useView } from '@/contexts/ViewContext';
import RecruiterSidebar from '@/components/layout/RecruiterSidebar';
import styles from './recruiter.module.css';

export default function Recruiter() {
  const { view } = useView();
  const [activeTab, setActiveTab] = useState('Mis vacantes');

  if (view !== 'recruiter') {
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