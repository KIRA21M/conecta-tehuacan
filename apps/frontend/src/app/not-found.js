'use client';

import styles from './error.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>¡Ups! Página no encontrada</h2>
        <p className={styles.description}>
          Parece que la vacante o sección que buscas no existe o ha sido movida.
        </p>
        <a href="/" className={styles.button}>
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}