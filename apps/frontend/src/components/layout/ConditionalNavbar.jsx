'use client';

import { useView } from '@/contexts/ViewContext';
import Navbar from './Navbar';
import AuthenticatedNavbar from './AuthenticatedNavbar';

export default function ConditionalNavbar() {
  const { view } = useView();

  if (view === 'candidate') {
    return <AuthenticatedNavbar />;
  }

  return <Navbar />;
}