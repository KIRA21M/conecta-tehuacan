'use client';

import { useState, useEffect } from 'react';

interface FavoriteJob {
  id: number;
  title: string;
  company_name: string;
  location: string;
  work_mode: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch favorites from API
    // For now, using mock data
    const mockFavorites: FavoriteJob[] = [
      {
        id: 1,
        title: 'Desarrollador Full Stack',
        company_name: 'Innovate Solutions',
        location: 'Ciudad de México',
        work_mode: 'Remoto',
        employment_type: 'Tiempo completo',
        salary_min: 50000,
        salary_max: 70000,
      },
      {
        id: 2,
        title: 'Analista de Datos',
        company_name: 'Data Corp',
        location: 'Guadalajara',
        work_mode: 'Híbrido',
        employment_type: 'Tiempo completo',
        salary_min: 40000,
        salary_max: 55000,
      },
    ];
    setTimeout(() => {
      setFavorites(mockFavorites);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFavorite = (id: number) => {
    // TODO: Call API to remove from favorites
    setFavorites(prev => prev.filter(job => job.id !== id));
  };

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px',
        }}></div>
        <p>Cargando favoritos...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <a
        href="#favorites-list"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          e.target.style.left = '10px';
          e.target.style.top = '10px';
          e.target.style.width = 'auto';
          e.target.style.height = 'auto';
        }}
        onBlur={(e) => {
          e.target.style.left = '-9999px';
          e.target.style.top = 'auto';
          e.target.style.width = '1px';
          e.target.style.height = '1px';
        }}
      >
        Saltar a la lista de favoritos
      </a>
      <h1>Mis Favoritos</h1>
      {favorites.length === 0 ? (
        <p>No tienes vacantes favoritas aún.</p>
      ) : (
        <div id="favorites-list" style={{ maxWidth: '800px', margin: '0 auto' }} role="list" aria-label="Lista de vacantes favoritas">
          {favorites.map((job) => (
            <div
              key={job.id}
              role="listitem"
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
              tabIndex={0}
              aria-label={`Vacante favorita: ${job.title} en ${job.company_name}, ${job.location}, ${job.work_mode}, ${job.employment_type}`}
            >
              <button
                onClick={() => handleRemoveFavorite(job.id)}
                aria-label={`Remover ${job.title} de favoritos`}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#ef4444',
                }}
                title="Remover de favoritos"
              >
                ❤️
              </button>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{job.title}</h3>
              <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#374151' }}>
                {job.company_name}
              </p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                <span>📍 {job.location}</span>
                <span>🏠 {job.work_mode}</span>
                <span>💼 {job.employment_type}</span>
              </div>
              {job.salary_min && job.salary_max && (
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#059669' }}>
                  💰 ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} MXN
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}