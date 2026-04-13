'use client';

import { useState } from 'react';

export default function TestError() {
  const [error, setError] = useState(false);

  if (error) {
    throw new Error('Este es un error de prueba para simular un error 500');
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Página de Prueba de Error 500</h1>
      <p>Haz clic en el botón para simular un error y ver la página 500.</p>
      <button onClick={() => setError(true)} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Lanzar Error 500
      </button>
    </div>
  );
}