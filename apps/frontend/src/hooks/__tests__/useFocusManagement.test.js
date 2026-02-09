import { renderHook, act, waitFor } from '@testing-library/react';
import { useFocusManagement } from '../useFocusManagement';

describe('useFocusManagement Hook', () => {
  test('debe inicializarse correctamente', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    expect(result.current.itemRefs).toBeDefined();
    expect(result.current.setFocus).toBeDefined();
    expect(result.current.focusNext).toBeDefined();
    expect(result.current.focusPrevious).toBeDefined();
    expect(result.current.getRef).toBeDefined();
    expect(result.current.getFocusedIndex).toBeDefined();
  });

  test('getRef debe retornar una función válida', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    const refFunction = result.current.getRef(0);
    expect(typeof refFunction).toBe('function');
  });

  test('setFocus debe actualizar el foco', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    // Crear elementos mock
    const mockElement = {
      focus: jest.fn(),
    };
    
    result.current.itemRefs.current[0] = mockElement;
    
    act(() => {
      result.current.setFocus(0);
    });
    
    expect(mockElement.focus).toHaveBeenCalled();
    expect(result.current.getFocusedIndex()).toBe(0);
  });

  test('focusNext debe mover el foco al siguiente elemento', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    // Crear elementos mock
    const mockElements = [
      { focus: jest.fn() },
      { focus: jest.fn() },
    ];
    
    result.current.itemRefs.current = mockElements;
    
    act(() => {
      result.current.focusNext();
    });
    
    expect(mockElements[1].focus).toHaveBeenCalled();
    expect(result.current.getFocusedIndex()).toBe(1);
  });

  test('focusPrevious debe mover el foco al elemento anterior', () => {
    const { result } = renderHook(() => useFocusManagement(1));
    
    const mockElements = [
      { focus: jest.fn() },
      { focus: jest.fn() },
    ];
    
    result.current.itemRefs.current = mockElements;
    
    act(() => {
      result.current.focusPrevious();
    });
    
    expect(mockElements[0].focus).toHaveBeenCalled();
    expect(result.current.getFocusedIndex()).toBe(0);
  });

  test('focusNext debe ser cíclico (volver al inicio después del último)', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    const mockElements = [
      { focus: jest.fn() },
      { focus: jest.fn() },
    ];
    
    result.current.itemRefs.current = mockElements;
    
    // Mover al último
    act(() => {
      result.current.focusNext();
    });
    
    expect(result.current.getFocusedIndex()).toBe(1);
    
    // Mover después del último (debe volver al primero)
    act(() => {
      result.current.focusNext();
    });
    
    expect(mockElements[0].focus).toHaveBeenCalled();
    expect(result.current.getFocusedIndex()).toBe(0);
  });

  test('focusPrevious debe ser cíclico (ir al final cuando está en el primero)', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    const mockElements = [
      { focus: jest.fn() },
      { focus: jest.fn() },
    ];
    
    result.current.itemRefs.current = mockElements;
    
    // Estar en el primero e ir hacia atrás
    act(() => {
      result.current.focusPrevious();
    });
    
    expect(mockElements[1].focus).toHaveBeenCalled();
    expect(result.current.getFocusedIndex()).toBe(1);
  });

  test('getRef debe crear referencias para cada índice', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    const mockElement1 = { focus: jest.fn() };
    const mockElement2 = { focus: jest.fn() };
    
    const ref1 = result.current.getRef(0);
    const ref2 = result.current.getRef(1);
    
    act(() => {
      ref1(mockElement1);
      ref2(mockElement2);
    });
    
    expect(result.current.itemRefs.current[0]).toBe(mockElement1);
    expect(result.current.itemRefs.current[1]).toBe(mockElement2);
  });

  test('getFocusedIndex debe retornar el índice enfocado actualmente', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    const mockElements = [
      { focus: jest.fn() },
      { focus: jest.fn() },
    ];
    
    result.current.itemRefs.current = mockElements;
    
    act(() => {
      result.current.setFocus(1);
    });
    
    expect(result.current.getFocusedIndex()).toBe(1);
  });

  test('no debe causar error si intenta enfocar un índice inexistente', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    const mockElement = { focus: jest.fn() };
    result.current.itemRefs.current[0] = mockElement;
    
    // Intentar enfocar un índice que no existe
    expect(() => {
      act(() => {
        result.current.setFocus(999);
      });
    }).not.toThrow();
  });

  test('initialFocusIndex debe establecer el índice de foco inicial', () => {
    const { result } = renderHook(() => useFocusManagement(1));
    
    // Inicialmente el índice debería ser 1
    expect(result.current.focusedIndexRef.current).toBe(1);
  });

  test('debe manejar múltiples elementos correctamente', () => {
    const { result } = renderHook(() => useFocusManagement(0));
    
    const mockElements = Array.from({ length: 5 }, () => ({
      focus: jest.fn(),
    }));
    
    result.current.itemRefs.current = mockElements;
    
    // Recorrer todos los elementos
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.setFocus(i);
      });
      
      expect(mockElements[i].focus).toHaveBeenCalled();
      expect(result.current.getFocusedIndex()).toBe(i);
    }
  });
});
