'use client';

import styles from '../error.module.css';

export default function Error({ error, reset }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>500</h1>
        <h2 className={styles.title}>Error interno del servidor</h2>
        <p className={styles.description}>
          Estamos experimentando problemas técnicos en Conecta Tehuacán. Por favor, intenta de nuevo más tarde.
        </p>
        <button onClick={reset} className={styles.button}>
          Recargar página
        </button>
      </div>
    </div>
  );
}