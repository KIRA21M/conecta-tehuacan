import { useRef } from 'react';

export function useRef() {
  return require('react').useRef.apply(null, arguments);
}

export { useFocusManagement } from './useFocusManagement';
