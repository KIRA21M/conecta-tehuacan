'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useView } from '@/contexts/ViewContext';
import { useRouter } from 'next/navigation';
import styles from './AuthenticatedNavbar.module.css';

export default function AuthenticatedNavbar() {
  const { setView } = useView();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef([]);
  const searchInputRef = useRef(null);

  const navItems = [
    { id: 'logo', type: 'logo', label: 'CONECTA TEHUACÁN', href: '/' },
    { id: 'search', type: 'search' },
    { id: 'empleos', type: 'link', label: 'Explorar Empleos', href: '/empleos' },
    { id: 'avatar', type: 'avatar' },
  ];

  const handleLogout = () => {
    setView('public');
    router.push('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Implementar búsqueda aquí
      console.log('Buscando:', searchQuery);
    }
  };

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      const focusableItems = navItems.filter(item => 
        item.type === 'link' || item.type === 'search' || item.type === 'logo'
      );
      const currentIndex = focusableItems.findIndex(item => 
        item.id === navItems[activeIndex]?.id
      );
      
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % focusableItems.length;
          const nextItemId = focusableItems[nextIndex].id;
          const nextItemIndex = navItems.findIndex(item => item.id === nextItemId);
          setActiveIndex(nextItemIndex);
          break;
          
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
          const prevItemId = focusableItems[prevIndex].id;
          const prevItemIndex = navItems.findIndex(item => item.id === prevItemId);
          setActiveIndex(prevItemIndex);
          break;
          
        case 'Tab':
          if (currentIndex === focusableItems.length - 1 && !e.shiftKey) {
            e.preventDefault();
            setActiveIndex(navItems.findIndex(item => item.id === focusableItems[0].id));
          } else if (currentIndex === 0 && e.shiftKey) {
            e.preventDefault();
            const lastItemId = focusableItems[focusableItems.length - 1].id;
            setActiveIndex(navItems.findIndex(item => item.id === lastItemId));
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, navItems]);

  // Enfocar elemento activo
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].focus();
    }
  }, [activeIndex]);

  // Enfocar primer elemento al montar
  useEffect(() => {
    setActiveIndex(0);
  }, []);

  return (
    <nav 
      className={styles.navbar}
      role="navigation"
      aria-label="Navegación de candidato"
    >
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link
          href="/"
          ref={el => itemRefs.current[0] = el}
          className={`${styles.logo} ${activeIndex === 0 ? styles.active : ''}`}
          onClick={() => setActiveIndex(0)}
          onFocus={() => setActiveIndex(0)}
          tabIndex={0}
        >
          <img src="/logo.svg" alt="CONECTA TEHUACÁN" className={styles.logoImage} />
        </Link>

        {/* Buscador */}
        <div className={styles.searchContainer}>
          <input
            ref={el => {
              itemRefs.current[1] = el;
              searchInputRef.current = el;
            }}
            type="text"
            placeholder="Buscar empleos, empresas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setActiveIndex(1)}
            className={`${styles.searchInput} ${activeIndex === 1 ? styles.active : ''}`}
            tabIndex={0}
            aria-label="Buscar empleos y empresas"
          />
        </div>

        {/* Explorar Empleos */}
        <Link
          href="/empleos"
          ref={el => itemRefs.current[2] = el}
          className={`${styles.navLink} ${activeIndex === 2 ? styles.active : ''}`}
          onClick={() => setActiveIndex(2)}
          onFocus={() => setActiveIndex(2)}
          tabIndex={0}
        >
          Explorar Empleos
        </Link>

        {/* Avatar y Menú */}
        <div className={styles.profileSection}>
          <button
            ref={el => itemRefs.current[3] = el}
            className={`${styles.avatarButton} ${activeIndex === 3 ? styles.active : ''}`}
            onClick={() => setActiveIndex(3)}
            onFocus={() => setActiveIndex(3)}
            tabIndex={0}
            aria-label="Menú de perfil"
          >
            <div className={styles.avatar}>
              <span className={styles.avatarInitial}>U</span>
            </div>
          </button>
          
          <div className={styles.dropdownMenu}>
            <button 
              onClick={handleLogout}
              className={styles.dropdownItem}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}