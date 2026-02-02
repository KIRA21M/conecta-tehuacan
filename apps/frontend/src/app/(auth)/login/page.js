'use client';

import { useView } from '@/contexts/ViewContext';
import styles from './login.module.css';

export default function Login() {
  const { switchToCandidateView, switchToRecruiterView } = useView();

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Selecciona tu rol</h1>
      <div className={styles.buttons}>
        <button
          onClick={switchToCandidateView}
          className={styles.button}
          tabIndex={1}
          autoFocus
        >
          Candidatos
        </button>
        <button
          onClick={switchToRecruiterView}
          className={styles.button}
          tabIndex={2}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}