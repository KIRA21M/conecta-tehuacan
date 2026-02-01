'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './RecruiterSidebar.module.css';

export default function RecruiterSidebar({ activeTab, setActiveTab }) {
  const tabs = ['Mis Vacantes', 'Candidatos', 'Mensajes', 'Perfil Empresa'];
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRefs = useRef([]);

  // Enfocar el botón activo cuando cambia activeTab
  useEffect(() => {
    const index = tabs.indexOf(activeTab);
    if (index !== -1) {
      setFocusedIndex(index);
    }
  }, [activeTab]);

  // Manejar navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % tabs.length);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + tabs.length) % tabs.length);
          break;
          
        case 'Enter':
        case ' ':
          e.preventDefault();
          setActiveTab(tabs[focusedIndex]);
          break;
          
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
          
        case 'End':
          e.preventDefault();
          setFocusedIndex(tabs.length - 1);
          break;
      }
    };

    const currentRef = buttonRefs.current[focusedIndex];
    if (currentRef) {
      currentRef.focus();
      currentRef.addEventListener('keydown', handleKeyDown);
      
      return () => {
        currentRef.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [focusedIndex, tabs, setActiveTab]);

  return (
    <div className={styles.sidebar} role="navigation" aria-label="Panel de control">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          ref={el => buttonRefs.current[index] = el}
          className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
          onClick={() => {
            setActiveTab(tab);
            setFocusedIndex(index);
          }}
          onFocus={() => setFocusedIndex(index)}
          tabIndex={activeTab === tab ? 0 : -1}
          aria-current={activeTab === tab ? 'page' : undefined}
          role="tab"
          aria-label={tab}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}