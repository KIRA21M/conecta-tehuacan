'use client';

import React, { useState, useEffect } from 'react';

interface JobListing {
  id: string;
  title: string;
  department: string;
  applicants: number;
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
}

export default function MisVacantes() {
  const [vacantes, setVacantes] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'closed'>('all');

  useEffect(() => {
    // TODO: Integrar con API para traer las vacantes del reclutador
    // Por ahora, mostramos datos de ejemplo
    setVacantes([
      {
        id: '1',
        title: 'Desarrollador Frontend Senior',
        department: 'Ingeniería',
        applicants: 15,
        status: 'active',
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'Diseñador UX/UI',
        department: 'Diseño',
        applicants: 8,
        status: 'active',
        createdAt: '2024-01-10',
      },
      {
        id: '3',
        title: 'Especialista en Marketing',
        department: 'Marketing',
        applicants: 0,
        status: 'draft',
        createdAt: '2024-01-20',
      },
    ]);
    setIsLoading(false);
  }, []);

  const filteredVacantes =
    filter === 'all' ? vacantes : vacantes.filter((v) => v.status === filter);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'draft':
        return '#f59e0b';
      case 'closed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'draft':
        return 'Borrador';
      case 'closed':
        return 'Cerrada';
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div>Cargando vacantes...</div>;
  }

  return (
    <section>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>
        Mis Vacantes
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            backgroundColor: filter === 'all' ? '#2563eb' : '#e5e7eb',
            color: filter === 'all' ? '#ffffff' : '#000000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            backgroundColor: filter === 'active' ? '#2563eb' : '#e5e7eb',
            color: filter === 'active' ? '#ffffff' : '#000000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        >
          Activas
        </button>
        <button
          onClick={() => setFilter('draft')}
          style={{
            backgroundColor: filter === 'draft' ? '#2563eb' : '#e5e7eb',
            color: filter === 'draft' ? '#ffffff' : '#000000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        >
          Borradores
        </button>
        <button
          onClick={() => setFilter('closed')}
          style={{
            backgroundColor: filter === 'closed' ? '#2563eb' : '#e5e7eb',
            color: filter === 'closed' ? '#ffffff' : '#000000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Cerradas
        </button>
      </div>

      <button
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '1rem',
        }}
      >
        + Nueva Vacante
      </button>

      {filteredVacantes.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
          No hay vacantes {filter !== 'all' ? `en estado "${filter}"` : ''}
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredVacantes.map((vacante) => (
            <div
              key={vacante.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
                  {vacante.title}
                </h3>
                <span
                  style={{
                    backgroundColor: getStatusBadgeColor(vacante.status),
                    color: '#ffffff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                  }}
                >
                  {getStatusLabel(vacante.status)}
                </span>
              </div>
              <p style={{ color: '#6b7280', margin: '0.5rem 0' }}>
                <strong>Departamento:</strong> {vacante.department}
              </p>
              <p style={{ color: '#6b7280', margin: '0.5rem 0' }}>
                <strong>Candidatos:</strong> {vacante.applicants}
              </p>
              <p style={{ color: '#9ca3af', margin: '0.5rem 0', fontSize: '0.875rem' }}>
                Creada: {new Date(vacante.createdAt).toLocaleDateString('es-MX')}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  Ver
                </button>
                <button
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
