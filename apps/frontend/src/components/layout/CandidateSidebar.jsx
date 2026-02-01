'use client';

import { useState, useEffect, useRef } from 'react';
import { useView } from '@/contexts/ViewContext';
import styles from './CandidateSidebar.module.css';

export default function CandidateSidebar({ onTabChange }) {
  const { switchToRecruiterView } = useView();
  const [activeTab, setActiveTab] = useState('Mi perfil');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef([]);

  const tabs = [
    { name: 'Mi perfil', description: 'Gestión de información personal y profesional', icon: '👤' },
    { name: 'Mis postulaciones', description: 'Historial y estado de vacantes aplicadas', icon: '📄' },
    { name: 'Mis favoritos', description: 'Guardado de vacantes de interés', icon: '⭐' }
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
            switchToRecruiterView();
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
    <aside className={styles.sidebar} role="navigation" aria-label="Panel de candidato">
      <h2 className={styles.title}>Panel del Candidato</h2>
      
      <button
        className={styles.toggleButton}
        onClick={switchToRecruiterView}
        ref={el => itemRefs.current[0] = el}
        tabIndex={0}
        onFocus={() => setFocusedIndex(0)}
      >
        Cambiar a Dashboard
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
            <span className={styles.icon}>{tab.icon}</span>
            <div className={styles.tabText}>
              <span className={styles.tabName}>{tab.name}</span>
              <span className={styles.description}>{tab.description}</span>
            </div>
          </div>
        </button>
      ))}
    </aside>
  );
}