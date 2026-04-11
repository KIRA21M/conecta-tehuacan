'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la primera vista del dashboard
    router.replace('/recruiter/mis-vacantes');
  }, [router]);

  return null;
}
