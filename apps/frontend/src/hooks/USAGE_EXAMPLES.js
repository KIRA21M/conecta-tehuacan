/**
 * EJEMPLOS DE USO - Hook useFocusManagement
 * 
 * Este archivo contiene ejemplos de cómo utilizar el hook useFocusManagement
 * en diferentes tipos de componentes. Estos son ejemplos referenciales que
 * puedes adaptar a tus necesidades.
 */

// ============================================================================
// EJEMPLO 1: Modal con Navegación de Teclado
// ============================================================================

import { useRef, useEffect } from 'react';
import { useFocusManagement } from '@/hooks/useFocusManagement';

export function ModalExample() {
  const { setFocus, getRef, focusNext, focusPrevious } = useFocusManagement(0);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalRef.current?.contains(document.activeElement)) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        e.shiftKey ? focusPrevious() : focusNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusNext, focusPrevious]);

  return (
    <div ref={modalRef} role="dialog">
      <button ref={getRef(0)} autoFocus>Aceptar</button>
      <button ref={getRef(1)}>Cancelar</button>
      <button ref={getRef(2)}>Más opciones</button>
    </div>
  );
}

// ============================================================================
// EJEMPLO 2: Formulario con Navegación
// ============================================================================

export function FormExample() {
  const { setFocus, getRef, focusNext } = useFocusManagement(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado');
  };

  const handleFieldError = (fieldIndex) => {
    // Mover el foco al campo con error
    setFocus(fieldIndex);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          ref={getRef(0)}
          id="email"
          type="email"
          placeholder="tu@email.com"
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          ref={getRef(1)}
          id="password"
          type="password"
          placeholder="••••••••"
        />
      </div>
      <div>
        <label htmlFor="confirm">Confirmar</label>
        <input
          ref={getRef(2)}
          id="confirm"
          type="password"
          placeholder="••••••••"
        />
      </div>
      <button ref={getRef(3)} type="submit">
        Enviar
      </button>
    </form>
  );
}

// ============================================================================
// EJEMPLO 3: Menú Contextual
// ============================================================================

export function ContextMenuExample() {
  const { setFocus, getRef, focusNext, focusPrevious } = useFocusManagement(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!menuRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusPrevious();
          break;
        case 'Escape':
          // Cerrar menú
          console.log('Cerrar menú');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusNext, focusPrevious]);

  return (
    <ul ref={menuRef} role="menu">
      <li role="menuitem">
        <button ref={getRef(0)} autoFocus>Editar</button>
      </li>
      <li role="menuitem">
        <button ref={getRef(1)}>Copiar</button>
      </li>
      <li role="menuitem">
        <button ref={getRef(2)}>Pegar</button>
      </li>
      <li role="menuitem">
        <button ref={getRef(3)}>Eliminar</button>
      </li>
    </ul>
  );
}

// ============================================================================
// EJEMPLO 4: Tabs con Navegación
// ============================================================================

export function TabsExample() {
  const { setFocus, getRef, focusNext, focusPrevious } = useFocusManagement(0);
  const tabsRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!tabsRef.current?.contains(document.activeElement)) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        focusNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        focusPrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusNext, focusPrevious]);

  return (
    <div ref={tabsRef}>
      <div role="tablist">
        <button ref={getRef(0)} role="tab" autoFocus>Tab 1</button>
        <button ref={getRef(1)} role="tab">Tab 2</button>
        <button ref={getRef(2)} role="tab">Tab 3</button>
      </div>
      <div role="tabpanel">Contenido del tab</div>
    </div>
  );
}

// ============================================================================
// EJEMPLO 5: Carrusel de Imágenes con Control de Teclado
// ============================================================================

export function CarouselExample() {
  const { setFocus, getRef } = useFocusManagement(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!carouselRef.current?.contains(document.activeElement)) return;

      const totalImages = 5;
      const currentIndex = parseInt(document.activeElement?.dataset.index || '0');

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % totalImages;
        setFocus(nextIndex);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
        setFocus(prevIndex);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setFocus]);

  return (
    <div ref={carouselRef}>
      {[0, 1, 2, 3, 4].map((index) => (
        <img
          key={index}
          ref={getRef(index)}
          src={`/image-${index}.jpg`}
          alt={`Imagen ${index + 1}`}
          data-index={index}
          tabIndex={index === 0 ? 0 : -1}
          role="button"
        />
      ))}
    </div>
  );
}

// ============================================================================
// EJEMPLO 6: Búsqueda Predictiva con Navegación
// ============================================================================

export function SearchExample() {
  const [results, setResults] = require('react').useState([]);
  const { setFocus, getRef, focusNext, focusPrevious } = useFocusManagement(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!searchRef.current?.contains(document.activeElement)) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusPrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusNext, focusPrevious]);

  return (
    <div ref={searchRef}>
      <input
        type="search"
        placeholder="Buscar..."
        onChange={(e) => {
          // Simular búsqueda
          setResults(['Resultado 1', 'Resultado 2', 'Resultado 3']);
        }}
        autoFocus
      />
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <button ref={getRef(index)}>{result}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// NOTAS IMPORTANTES
// ============================================================================

/**
 * 1. SIEMPRE incluye el hook al principio del componente
 * 2. Usa getRef(index) para asignar referencias a elementos interactivos
 * 3. Asegúrate de que los índices sean secuenciales (0, 1, 2, ...)
 * 4. El primer elemento debe tener autoFocus cuando sea posible
 * 5. Limpia los listeners de eventos en el cleanup de useEffect
 * 6. Incluye aria-label y data-testid para accesibilidad y testing
 * 7. Usa preventDefault() cuando manejes eventos de teclado personalizados
 * 8. Considera la navegación cíclica para mejorar la UX
 */
