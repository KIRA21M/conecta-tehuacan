'use client';

import { useState, useEffect } from 'react';

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch applications from API
    // For now, using mock data
    const mockApplications: Application[] = [
      {
        id: 1,
        jobTitle: 'Desarrollador Frontend',
        company: 'Tech Corp',
        status: 'pending',
        appliedDate: '2024-01-15',
      },
      {
        id: 2,
        jobTitle: 'Ingeniero de Software',
        company: 'Startup Inc',
        status: 'reviewed',
        appliedDate: '2024-01-10',
      },
    ];
    setTimeout(() => {
      setApplications(mockApplications);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'reviewed': return 'Revisado';
      case 'accepted': return 'Aceptado';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
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
        <p>Cargando postulaciones...</p>
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
        href="#applications-list"
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
        Saltar a la lista de postulaciones
      </a>
      <h1>Mis Postulaciones</h1>
      {applications.length === 0 ? (
        <p>No has aplicado a ninguna vacante aún.</p>
      ) : (
        <div id="applications-list" style={{ maxWidth: '800px', margin: '0 auto' }} role="list" aria-label="Lista de postulaciones">
          {applications.map((app) => (
            <div
              key={app.id}
              role="listitem"
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              aria-label={`Postulación a ${app.jobTitle} en ${app.company}, estado ${getStatusText(app.status)}, aplicado el ${new Date(app.appliedDate).toLocaleDateString('es-ES')}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{app.jobTitle}</h3>
                  <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>{app.company}</p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#9ca3af' }}>
                    Aplicado el: {new Date(app.appliedDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(app.status),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                  aria-label={`Estado: ${getStatusText(app.status)}`}
                >
                  {getStatusText(app.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
