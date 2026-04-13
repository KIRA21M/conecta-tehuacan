'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useView } from '@/contexts/ViewContext';
import styles from './CandidateNavbar.module.css';

export default function CandidateNavbar() {
  const { switchToPublicView } = useView();
  const [activeIndex, setActiveIndex] = useState(-1);
  const navRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, 7);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let newIndex = activeIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (activeIndex + 1) % 7;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (activeIndex - 1 + 7) % 7;
          break;
        case 'Tab':
          if (activeIndex === 6 && !e.shiftKey) {
            e.preventDefault();
            newIndex = 0;
          } else if (activeIndex === 0 && e.shiftKey) {
            e.preventDefault();
            newIndex = 6;
          }
          break;
      }

      setActiveIndex(newIndex);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].focus();
    }
  }, [activeIndex]);

  return (
    <nav 
      ref={navRef}
      className={styles.navbar}
      role="navigation"
      aria-label="Navegación de candidato"
    >
      <div className={styles.container}>
        {/* Logo y Cerrar Sesión */}
        <div className={styles.logoSection}>
          <Link 
            href="/dashboard"
            className={styles.logo}
            ref={el => itemRefs.current[0] = el}
            tabIndex={0}
            onFocus={() => setActiveIndex(0)}
          >
            <Image 
              src="/logo.svg" 
              alt="Conecta Tehuacán" 
              width={321}
              height={46}
            />
          </Link>
          <button
            className={styles.logoutButton}
            onClick={switchToPublicView}
            ref={el => itemRefs.current[1] = el}
            tabIndex={0}
            onFocus={() => setActiveIndex(1)}
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Buscador */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar empleos..."
            className={styles.searchInput}
            ref={el => itemRefs.current[2] = el}
            tabIndex={0}
            onFocus={() => setActiveIndex(2)}
          />
        </div>

        {/* Enlaces */}
        <Link
          href="/dashboard"
          className={styles.navLink}
          ref={el => itemRefs.current[3] = el}
          tabIndex={0}
          onFocus={() => setActiveIndex(3)}
        >
          Inicio
        </Link>

        <Link
          href="/empleos"
          className={styles.navLink}
          ref={el => itemRefs.current[4] = el}
          tabIndex={0}
          onFocus={() => setActiveIndex(4)}
        >
          Explorar Empleos
        </Link>

        {/* Avatar */}
        <div className={styles.avatarContainer}>
          <button
            className={styles.avatar}
            ref={el => itemRefs.current[5] = el}
            tabIndex={0}
            onFocus={() => setActiveIndex(5)}
            aria-label="Menú de usuario"
          >
            <span>U</span>
          </button>
        </div>
      </div>
    </nav>
  );
}