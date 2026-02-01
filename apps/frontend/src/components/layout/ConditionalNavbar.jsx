'use client';

import { useView } from '@/contexts/ViewContext';
import Navbar from './Navbar';
import CandidateNavbar from './CandidateNavbar';
import RecruiterNavbar from './RecruiterNavbar';

export default function ConditionalNavbar() {
  const { view } = useView();

  switch (view) {
    case 'candidate':
      return <CandidateNavbar />;
    case 'recruiter':
      return <RecruiterNavbar />;
    default:
      return <Navbar />;
  }
}