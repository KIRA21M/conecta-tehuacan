import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook para manejar el control de foco en componentes Next.js
 * Permite mover el foco manualmente a elementos específicos y gestionar
 * la navegación por teclado entre elementos.
 * 
 * @param {number} initialFocusIndex - Índice inicial del elemento que debe tener foco
 * @returns {Object} Objeto con métodos y referencias para controlar el foco
 */
export function useFocusManagement(initialFocusIndex = 0) {
  const itemRefs = useRef([]);
  const focusedIndexRef = useRef(initialFocusIndex);

  /**
   * Mueve el foco a un elemento específico por índice
   * @param {number} index - Índice del elemento
   */
  const setFocus = useCallback((index) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index].focus();
      focusedIndexRef.current = index;
    }
  }, []);

  /**
   * Mueve el foco al siguiente elemento
   */
  const focusNext = useCallback(() => {
    const totalItems = itemRefs.current.length;
    if (totalItems === 0) return;
    
    const nextIndex = (focusedIndexRef.current + 1) % totalItems;
    setFocus(nextIndex);
  }, [setFocus]);

  /**
   * Mueve el foco al elemento anterior
   */
  const focusPrevious = useCallback(() => {
    const totalItems = itemRefs.current.length;
    if (totalItems === 0) return;
    
    const prevIndex = (focusedIndexRef.current - 1 + totalItems) % totalItems;
    setFocus(prevIndex);
  }, [setFocus]);

  /**
   * Obtiene la referencia para un elemento en el índice especificado
   * @param {number} index - Índice del elemento
   * @returns {Object} Objeto ref para pasar al elemento
   */
  const getRef = useCallback((index) => {
    return (element) => {
      if (element) {
        itemRefs.current[index] = element;
      }
    };
  }, []);

  /**
   * Obtiene el índice del elemento actualmente enfocado
   */
  const getFocusedIndex = useCallback(() => {
    return focusedIndexRef.current;
  }, []);

  /**
   * Inicializa el foco en el primer elemento después del montaje
   */
  useEffect(() => {
    // Usar setTimeout para permitir que el DOM se renderice primero
    const timer = setTimeout(() => {
      if (itemRefs.current[initialFocusIndex]) {
        itemRefs.current[initialFocusIndex].focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [initialFocusIndex]);

  return {
    itemRefs,
    setFocus,
    focusNext,
    focusPrevious,
    getRef,
    getFocusedIndex,
    focusedIndexRef,
  };
}
