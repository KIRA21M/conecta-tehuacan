'use client';

import { useState } from 'react';
import { useView } from '@/contexts/ViewContext';
import RecruiterSidebar from '@/components/layout/RecruiterSidebar';
import styles from '../(auth)/login/login.module.css';

export default function Dashboard() {
  const { view } = useView();
  const [activeTab, setActiveTab] = useState('Mis Vacantes');

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

  if (view !== 'candidate') {
    return <div>Acceso denegado</div>;
  }

  return (
    <div className={styles.dashboard}>
      <RecruiterSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.content} id="main-content" tabIndex={-1}>
        {getContent()}
      </div>
    </div>
  );
}