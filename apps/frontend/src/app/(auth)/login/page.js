'use client';

import { useRef, useEffect } from 'react';
import { useView } from '@/contexts/ViewContext';
import { useFocusManagement } from '@/hooks/useFocusManagement';
import styles from './login.module.css';

export default function Login() {
  const { switchToCandidateView, switchToRecruiterView } = useView();
  const { setFocus, getRef, focusNext, focusPrevious, getFocusedIndex } = useFocusManagement(0);
  const containerRef = useRef(null);

  // Manejar navegación por teclado (Tab, Shift+Tab, Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo procesar si el foco está dentro del contenedor
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }

      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            focusPrevious();
          } else {
            focusNext();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          focusNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusPrevious();
          break;
        case 'Enter':
          // Permitir que el evento por defecto se propague para activar el botón
          break;
        case 'Escape':
          // Opcional: puedes agregar lógica aquí si lo necesitas
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusNext, focusPrevious]);

  const handleCandidateClick = () => {
    switchToCandidateView();
  };

  const handleRecruiterClick = () => {
    switchToRecruiterView();
  };

  return (
    <div className={styles.loginContainer} ref={containerRef}>
      <h1 className={styles.title}>Selecciona tu rol</h1>
      <div className={styles.buttons}>
        <button
          ref={getRef(0)}
          onClick={handleCandidateClick}
          className={styles.button}
          tabIndex={0}
          autoFocus
          data-testid="candidate-button"
          aria-label="Seleccionar rol de candidato"
        >
          Candidatos
        </button>
        <button
          ref={getRef(1)}
          onClick={handleRecruiterClick}
          className={styles.button}
          tabIndex={-1}
          data-testid="recruiter-button"
          aria-label="Seleccionar rol de reclutador"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}