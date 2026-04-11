'use client';

import React, { useState, useEffect } from 'react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'new' | 'reviewing' | 'interviewed' | 'rejected' | 'hired';
  appliedDate: string;
  pdfUrl?: string;
}

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewing' | 'interviewed' | 'rejected' | 'hired'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Integrar con API para traer los candidatos
    // Por ahora, mostramos datos de ejemplo
    setCandidatos([
      {
        id: '1',
        name: 'Juan García',
        email: 'juan@example.com',
        phone: '+52 123 456 7890',
        position: 'Desarrollador Frontend Senior',
        status: 'new',
        appliedDate: '2024-01-20',
      },
      {
        id: '2',
        name: 'María López',
        email: 'maria@example.com',
        phone: '+52 987 654 3210',
        position: 'Desarrollador Frontend Senior',
        status: 'reviewing',
        appliedDate: '2024-01-18',
      },
      {
        id: '3',
        name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        phone: '+52 555 123 4567',
        position: 'Diseñador UX/UI',
        status: 'interviewed',
        appliedDate: '2024-01-15',
      },
    ]);
    setIsLoading(false);
  }, []);

  const filteredCandidatos = candidatos.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return '#06b6d4';
      case 'reviewing':
        return '#f59e0b';
      case 'interviewed':
        return '#8b5cf6';
      case 'hired':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Nuevo';
      case 'reviewing':
        return 'En revisión';
      case 'interviewed':
        return 'Entrevistado';
      case 'hired':
        return 'Contratado';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div>Cargando candidatos...</div>;
  }

  return (
    <section>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>
        Candidatos
      </h1>

      <div style={{ marginBottom: '1.5rem' }}>
          type="text"
          placeholder="Buscar por nombre, correo o posición..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
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
          Todos
        </button>
        <button
          onClick={() => setFilter('new')}
          style={{
            backgroundColor: filter === 'new' ? '#2563eb' : '#e5e7eb',
            color: filter === 'new' ? '#ffffff' : '#000000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        >
          Nuevos
        </button>
        <button
          onClick={() => setFilter('reviewing')}
          style={{
            backgroundColor: filter === 'reviewing' ? '#2563eb' : '#e5e7eb',
            color: filter === 'reviewing' ? '#ffffff' : '#000000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        >
          En revisión
        </button>
        <button
          onClick={() => setFilter('interviewed')}
          style={{
            backgroundColor: filter === 'interviewed' ? '#2563eb' : '#e5e7eb',
            color: filter === 'interviewed' ? '#ffffff' : '#000000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        >
          Entrevistados
        </button>
        <button
          onClick={() => setFilter('hired')}
          style={{
            backgroundColor: filter === 'hired' ? '#2563eb' : '#e5e7eb',
            color: filter === 'hired' ? '#ffffff' : '#000000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Contratados
        </button>
      </div>

      {filteredCandidatos.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
          No hay candidatos que coincidan con tu búsqueda o filtro
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Posición</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidatos.map((candidato) => (
                <tr key={candidato.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>
                    <strong>{candidato.name}</strong>
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{candidato.email}</td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{candidato.position}</td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        backgroundColor: getStatusBadgeColor(candidato.status),
                        color: '#ffffff',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                      }}
                    >
                      {getStatusLabel(candidato.status)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '0.375rem 0.75rem',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        marginRight: '0.5rem',
                      }}
                    >
                      Ver perfil
                    </button>
                    <button
                      style={{
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        padding: '0.375rem 0.75rem',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      Cambiar estado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
