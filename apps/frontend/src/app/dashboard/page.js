'use client';

import { useState } from 'react';
import { useView } from '@/contexts/ViewContext';
import CandidateSidebar from '@/components/layout/CandidateSidebar';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const { view } = useView();
  const [activeTab, setActiveTab] = useState('Mi perfil');

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