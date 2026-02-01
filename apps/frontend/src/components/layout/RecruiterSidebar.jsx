'use client';

import { useState, useEffect, useRef } from 'react';
import { useView } from '@/contexts/ViewContext';
import styles from './RecruiterSidebar.module.css';

export default function RecruiterSidebar({ onTabChange }) {
  const { switchToCandidateView } = useView();
  const [activeTab, setActiveTab] = useState('Candidatos');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef([]);

  const tabs = [
    { name: 'Mis vacantes', description: 'Creación y edición de ofertas laborales' },
    { name: 'Candidatos', description: 'Revisión de perfiles que aplicaron a las vacantes' },
    { name: 'Mensajes', description: 'Comunicación directa con aplicantes' },
    { name: 'Perfil empresa', description: 'Configuración de datos corporativos y logo' }
  ];

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, tabs.length + 1);
  }, [tabs.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let newIndex = focusedIndex;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (focusedIndex + 1) % (tabs.length + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (focusedIndex - 1 + tabs.length + 1) % (tabs.length + 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex === 0) {
            switchToCandidateView();
          } else {
            const tabIndex = focusedIndex - 1;
            setActiveTab(tabs[tabIndex].name);
            onTabChange?.(tabs[tabIndex].name);
          }
          break;
        case 'Tab':
          if (focusedIndex === tabs.length && !e.shiftKey) {
            e.preventDefault();
            setFocusedIndex(0);
          } else if (focusedIndex === 0 && e.shiftKey) {
            e.preventDefault();
            setFocusedIndex(tabs.length);
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
        onClick={switchToCandidateView}
        ref={el => itemRefs.current[0] = el}
        tabIndex={0}
        onFocus={() => setFocusedIndex(0)}
      >
        Cambiar a Candidato
      </button>

      {tabs.map((tab, index) => (
        <button
          key={tab.name}
          className={`${styles.tab} ${activeTab === tab.name ? styles.active : ''}`}
          onClick={() => {
            setActiveTab(tab.name);
            onTabChange?.(tab.name);
          }}
          ref={el => itemRefs.current[index + 1] = el}
          tabIndex={0}
          onFocus={() => setFocusedIndex(index + 1)}
          aria-current={activeTab === tab.name ? 'page' : undefined}
        >
          <div className={styles.tabContent}>
            <span className={styles.tabName}>{tab.name}</span>
            <span className={styles.description}>{tab.description}</span>
          </div>
        </button>
      ))}
    </aside>
  );
}