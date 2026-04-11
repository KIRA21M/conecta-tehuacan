'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useView } from '@/contexts/ViewContext';
import { useAuth } from '@/contexts/AuthContext';
import styles from './RecruiterSidebar.module.css';

const TAB_ROUTES = {
  'Mis vacantes': '/recruiter/mis-vacantes',
  'Candidatos': '/recruiter/candidatos',
  'Mensajes': '/recruiter/mensajes',
  'Perfil empresa': '/recruiter/perfil-empresa',
};

export default function RecruiterSidebar() {
  const { switchToCandidateView } = useView();
  const { user, logout } = useAuth();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef([]);
  const router = useRouter();
  const pathname = usePathname();

  const tabs = useMemo(
    () => [
      { name: 'Mis vacantes', description: 'Creación y edición de ofertas laborales' },
      { name: 'Candidatos', description: 'Revisión de perfiles que aplicaron a las vacantes' },
      { name: 'Mensajes', description: 'Comunicación directa con aplicantes' },
      { name: 'Perfil empresa', description: 'Configuración de datos corporativos y logo' },
    ],
    []
  );

  const getActiveTab = () => {
    for (const [tabName, route] of Object.entries(TAB_ROUTES)) {
      if (pathname.startsWith(route)) {
        return tabName;
      }
    }
    return null;
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tabName) => {
    const route = TAB_ROUTES[tabName];
    if (route) {
      router.push(route);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Redirigir de todas formas
      router.push('/login');
    }
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, tabs.length + 2);
  }, [tabs.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let newIndex = focusedIndex;
      const totalItems = tabs.length + 2; // tabs + cambiar a candidato + logout

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (focusedIndex + 1) % totalItems;
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (focusedIndex - 1 + totalItems) % totalItems;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          const element = itemRefs.current[focusedIndex];
          if (element) {
            element.click();
          }
          break;
        case 'Tab':
          if (focusedIndex === totalItems - 1 && !e.shiftKey) {
            e.preventDefault();
            setFocusedIndex(0);
          } else if (focusedIndex === 0 && e.shiftKey) {
            e.preventDefault();
            setFocusedIndex(totalItems - 1);
          }
          break;
      }

      setFocusedIndex(newIndex);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, tabs.length]);

  useEffect(() => {
    if (itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex]);

  return (
    <aside className={styles.sidebar} role="navigation" aria-label="Panel de reclutador">
      <h2 className={styles.title}>Dashboard Reclutador</h2>

      <button
        className={styles.toggleButton}
        onClick={() => switchToCandidateView(true)}
        ref={(el) => (itemRefs.current[0] = el)}
        tabIndex={0}
        onFocus={() => setFocusedIndex(0)}
        title="Cambiar a vista de candidato"
      >
        Cambiar a Candidato
      </button>

      {tabs.map((tab, index) => (
        <button
          key={tab.name}
          className={`${styles.tab} ${activeTab === tab.name ? styles.active : ''}`}
          onClick={() => handleTabClick(tab.name)}
          ref={(el) => (itemRefs.current[index + 1] = el)}
          tabIndex={0}
          onFocus={() => setFocusedIndex(index + 1)}
          aria-current={activeTab === tab.name ? 'page' : undefined}
          title={tab.description}
        >
          <div className={styles.tabContent}>
            <span className={styles.tabName}>{tab.name}</span>
            <span className={styles.description}>{tab.description}</span>
          </div>
        </button>
      ))}

      <div style={{ flex: 1 }}></div>

      <button
        className={styles.logoutButton}
        onClick={handleLogout}
        ref={(el) => (itemRefs.current[tabs.length + 1] = el)}
        tabIndex={0}
        onFocus={() => setFocusedIndex(tabs.length + 1)}
        aria-label="Cerrar sesión"
        title={`Cerrar sesión (${user?.email || 'usuario'})`}
      >
        <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>🚪</span>
        Cerrar Sesión
      </button>
    </aside>
  );
}