'use client';

import { useView } from '@/contexts/ViewContext';

export default function MainContent({ children }) {
  const { view } = useView();

  const className = view === 'public' 
    ? 'main-container with-padding' 
    : 'main-content';

  return (
    <main id="main-content" className={className}>
      {children}
    </main>
  );
}