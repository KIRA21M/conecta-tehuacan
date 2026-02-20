'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useView } from '@/contexts/ViewContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { switchToCandidateView, switchToRecruiterView } = useView();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navRef = useRef(null);
  const itemRefs = useRef([]);

  const menuItems = [
    { id: 'contacto', label: 'Contáctanos', href: '/contacto' },
    { id: 'empleos', label: 'Explorar Empleos', href: '/empleos' },
    { id: 'nosotros', label: 'Sobre Nosotros', href: '/nosotros' },
  ];

  useEffect(() => {
    const totalItems = showLoginOptions ? menuItems.length + 5 : menuItems.length + 3;
    itemRefs.current = itemRefs.current.slice(0, totalItems);
  }, [menuItems.length, showLoginOptions]);

  // Manejar el foco cuando se abre/cierra el dropdown
  useEffect(() => {
    if (showLoginOptions && activeIndex === menuItems.length + 1) {
      // Si se abrió el dropdown desde el botón, mover foco a la primera opción
      setTimeout(() => setActiveIndex(menuItems.length + 2), 0);
    }
  }, [showLoginOptions, menuItems.length, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const totalItems = showLoginOptions ? menuItems.length + 5 : menuItems.length + 3;
      let newIndex = activeIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (activeIndex + 1) % totalItems;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (activeIndex - 1 + totalItems) % totalItems;
          break;
          case 'Enter':
          e.preventDefault();
          if (activeIndex === menuItems.length + 1) {
            // Botón de Iniciar Sesión
            setShowLoginOptions(!showLoginOptions);
          } else if (showLoginOptions && activeIndex === menuItems.length + 2) {
            // Opción Candidatos
            switchToCandidateView(true);
            setShowLoginOptions(false);
          } else if (showLoginOptions && activeIndex === menuItems.length + 3) {
            // Opción Dashboard
            switchToRecruiterView(true);
            setShowLoginOptions(false);
          }
          break;
        case 'Escape':
          if (showLoginOptions) {
            setShowLoginOptions(false);
          }
          break;
        case 'ArrowDown':
          if (activeIndex === menuItems.length + 1 && !showLoginOptions) {
            e.preventDefault();
            setShowLoginOptions(true);
            newIndex = menuItems.length + 2; // Primera opción del dropdown
          } else if (showLoginOptions && activeIndex >= menuItems.length + 2 && activeIndex < menuItems.length + 3) {
            e.preventDefault();
            newIndex = activeIndex + 1;
          }
          break;
        case 'ArrowUp':
          if (showLoginOptions && activeIndex > menuItems.length + 2) {
            e.preventDefault();
            newIndex = activeIndex - 1;
          } else if (showLoginOptions && activeIndex === menuItems.length + 2) {
            e.preventDefault();
            setShowLoginOptions(false);
            newIndex = menuItems.length + 1; // Volver al botón de login
          }
          break;
      }

      setActiveIndex(newIndex);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, menuItems.length, showLoginOptions, switchToCandidateView, switchToRecruiterView]);

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
      aria-label="Navegación principal"
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link 
          href="/"
          className={styles.logo}
          ref={el => itemRefs.current[0] = el}
          tabIndex={0}
          onFocus={() => setActiveIndex(0)}
        >
          <Image src="/logo.svg" alt="Conecta Tehuacán" width={200} height={40} priority />
        </Link>

        {/* Menú principal */}
        <div className={styles.menu}>
          {menuItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={styles.menuLink}
              ref={el => itemRefs.current[index + 1] = el}
              tabIndex={0}
              onFocus={() => setActiveIndex(index + 1)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Botones de autenticación */}
        <div className={styles.authSection}>
          <div className={styles.loginContainer}>
            <button
              className={styles.loginButton}
              ref={el => itemRefs.current[menuItems.length + 1] = el}
              tabIndex={0}
              onClick={() => setShowLoginOptions(!showLoginOptions)}
              onFocus={() => setActiveIndex(menuItems.length + 1)}
              aria-expanded={showLoginOptions}
              aria-haspopup="true"
            >
              Iniciar Sesión
            </button>
            
            {showLoginOptions && (
              <div className={styles.loginOptions} role="menu">
                <button
                  className={styles.loginOption}
                  onClick={() => switchToCandidateView(true)}
                  role="menuitem"
                  ref={el => itemRefs.current[menuItems.length + 2] = el}
                  tabIndex={0}
                  onFocus={() => setActiveIndex(menuItems.length + 2)}
                >
                  Candidatos
                </button>
                <button
                  className={styles.loginOption}
                  onClick={() => switchToRecruiterView(true)}
                  role="menuitem"
                  ref={el => itemRefs.current[menuItems.length + 3] = el}
                  tabIndex={0}
                  onFocus={() => setActiveIndex(menuItems.length + 3)}
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
          
          <Link
            href="/registro"
            className={styles.registerButton}
            ref={el => itemRefs.current[showLoginOptions ? menuItems.length + 4 : menuItems.length + 2] = el}
            tabIndex={0}
            onFocus={() => setActiveIndex(showLoginOptions ? menuItems.length + 4 : menuItems.length + 2)}
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
}