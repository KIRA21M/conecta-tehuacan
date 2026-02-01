// components/layout/Navbar.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const navbarRef = useRef(null);
  const itemRefs = useRef([]);
  const menuItemsRef = useRef([]);

  const menuItems = [
    { id: 'logo', type: 'logo', label: 'CONECTA TEHUACAN', href: '/' },
    { id: 'contactanos', type: 'link', label: 'Contactanos', href: '/contacto' },
    { id: 'explorar', type: 'link', label: 'Explorar Empleos', href: '/empleos' },
    { id: 'sobre-nosotros', type: 'link', label: 'Sobre Nosotros', href: '/nosotros' },
    { id: 'divider', type: 'divider' },
    { id: 'login', type: 'link', label: 'Iniciar Sesión', href: '/login' },
    { id: 'registro', type: 'button', label: 'Crear Cuenta', href: '/registro' },
  ];

  // Detectar cambio de tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navegación por teclado con loop infinito
  useEffect(() => {
    const handleKeyDown = (e) => {
      const focusableItems = menuItems.filter(item => 
        item.type === 'link' || item.type === 'button' || item.type === 'logo'
      );
      const currentIndex = focusableItems.findIndex(item => item.id === menuItems[activeIndex]?.id);
      
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % focusableItems.length;
          const nextItemId = focusableItems[nextIndex].id;
          const nextItemIndex = menuItems.findIndex(item => item.id === nextItemId);
          setActiveIndex(nextItemIndex);
          break;
          
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
          const prevItemId = focusableItems[prevIndex].id;
          const prevItemIndex = menuItems.findIndex(item => item.id === prevItemId);
          setActiveIndex(prevItemIndex);
          break;
          
        case 'Tab':
          if (currentIndex === focusableItems.length - 1 && !e.shiftKey) {
            e.preventDefault();
            const firstItemId = focusableItems[0].id;
            const firstItemIndex = menuItems.findIndex(item => item.id === firstItemId);
            setActiveIndex(firstItemIndex);
          } else if (currentIndex === 0 && e.shiftKey) {
            e.preventDefault();
            const lastItemId = focusableItems[focusableItems.length - 1].id;
            const lastItemIndex = menuItems.findIndex(item => item.id === lastItemId);
            setActiveIndex(lastItemIndex);
          }
          break;
      }
    };

    const navbar = navbarRef.current;
    if (navbar) {
      navbar.addEventListener('keydown', handleKeyDown);
      return () => navbar.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeIndex, menuItems]);

  // Enfocar elemento activo
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].focus();
    }
  }, [activeIndex]);

  // Inicializar refs
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, menuItems.length);
  }, [menuItems]);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  const handleItemFocus = (index) => {
    setActiveIndex(index);
  };

  const handleItemBlur = () => {
    // No resetear inmediatamente para mantener estilos durante navegación
    setTimeout(() => {
      if (!itemRefs.current.some(ref => ref && ref === document.activeElement)) {
        setActiveIndex(-1);
      }
    }, 100);
  };

  return (
    <nav 
      ref={navbarRef}
      className={styles.navbar}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link
          href="/"
          ref={el => itemRefs.current[0] = el}
          className={`${styles.logo} ${activeIndex === 0 ? styles.active : ''}`}
          onClick={() => handleItemClick(0)}
          onFocus={() => handleItemFocus(0)}
          onBlur={handleItemBlur}
          tabIndex={0}
          aria-label="Ir al inicio - CONECTA TEHUACAN"
        >
          <img src="/logo.svg" alt="CONECTA TEHUACAN" className={styles.logoImage} />
        </Link>

        {/* Menú de navegación */}
        <div className={styles.navMenu}>
          {/* Contactanos */}
          <Link
            href="/contacto"
            ref={el => itemRefs.current[1] = el}
            className={`${styles.navLink} ${activeIndex === 1 ? styles.active : ''}`}
            onClick={() => handleItemClick(1)}
            onFocus={() => handleItemFocus(1)}
            onBlur={handleItemBlur}
            tabIndex={0}
          >
            Contactanos
          </Link>

          {/* Explorar Empleos */}
          <Link
            href="/empleos"
            ref={el => itemRefs.current[2] = el}
            className={`${styles.navLink} ${activeIndex === 2 ? styles.active : ''}`}
            onClick={() => handleItemClick(2)}
            onFocus={() => handleItemFocus(2)}
            onBlur={handleItemBlur}
            tabIndex={0}
          >
            Explorar Empleos
          </Link>

          {/* Sobre Nosotros */}
          <Link
            href="/nosotros"
            ref={el => itemRefs.current[3] = el}
            className={`${styles.navLink} ${activeIndex === 3 ? styles.active : ''}`}
            onClick={() => handleItemClick(3)}
            onFocus={() => handleItemFocus(3)}
            onBlur={handleItemBlur}
            tabIndex={0}
          >
            Sobre Nosotros
          </Link>

          {/* Divisor */}
          <div className={styles.divider} aria-hidden="true"></div>

          {/* Iniciar Sesión */}
          <Link
            href="/login"
            ref={el => itemRefs.current[4] = el}
            className={`${styles.navLink} ${activeIndex === 4 ? styles.active : ''}`}
            onClick={() => handleItemClick(4)}
            onFocus={() => handleItemFocus(4)}
            onBlur={handleItemBlur}
            tabIndex={0}
          >
            Iniciar Sesión
          </Link>

          {/* Crear Cuenta - Botón */}
          <Link
            href="/registro"
            ref={el => itemRefs.current[5] = el}
            className={`${styles.navButton} ${activeIndex === 5 ? styles.active : ''}`}
            onClick={() => handleItemClick(5)}
            onFocus={() => handleItemFocus(5)}
            onBlur={handleItemBlur}
            tabIndex={0}
            aria-label="Crear cuenta nueva"
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
}