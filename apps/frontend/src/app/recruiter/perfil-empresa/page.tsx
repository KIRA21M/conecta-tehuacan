'use client';

import React, { useState, useEffect } from 'react';

interface CompanyProfile {
  name: string;
  description: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  email: string;
  phone: string;
  logoUrl?: string;
}

export default function PerfilEmpresa() {
  const [profile, setProfile] = useState<CompanyProfile>({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    location: '',
    email: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // TODO: Integrar con API para traer el perfil de la empresa
    // Por ahora, cargamos datos de ejemplo
    setProfile({
      name: 'Tech Solutions Inc.',
      description: 'Empresa líder en desarrollo de software y soluciones tecnológicas',
      website: 'www.techsolutions.com',
      industry: 'Tecnología',
      size: '50-200 empleados',
      location: 'Tehuacán, Puebla',
      email: 'info@techsolutions.com',
      phone: '+52 238 123 4567',
    });
    setIsLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Integrar con API para guardar el perfil
      // Por ahora, simulamos el guardado
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage('Perfil actualizado correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile((prev) => ({
            ...prev,
            logoUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <div>Cargando perfil de empresa...</div>;
  }

  return (
    <section style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>
        Perfil de Empresa
      </h1>

      {successMessage && (
        <div
          style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            padding: '1rem',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0',
          }}
        >
          {successMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Sección de logo */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Logo de la empresa
          </h2>
          <div
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '0.375rem',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f9fafb',
            }}
          >
            {profile.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt="Logo"
                style={{ maxHeight: '200px', marginBottom: '1rem' }}
              />
            ) : (
              <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
                Sube una imagen para el logo
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{
                display: 'block',
                margin: '0 auto',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
              }}
            />
          </div>
        </div>

        {/* Nombre de empresa */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Nombre de la empresa
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Descripción */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Descripción
          </label>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontFamily: 'inherit',
              minHeight: '150px',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Sitio web */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Sitio web
          </label>
          <input
            type="url"
            name="website"
            value={profile.website}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Industria */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Industria
          </label>
          <input
            type="text"
            name="industry"
            value={profile.industry}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Tamaño */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Tamaño de empresa
          </label>
          <select
            name="size"
            value={profile.size}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Selecciona una opción</option>
            <option value="1-10">1-10 empleados</option>
            <option value="11-50">11-50 empleados</option>
            <option value="50-200">50-200 empleados</option>
            <option value="200-1000">200-1000 empleados</option>
            <option value="1000+">1000+ empleados</option>
          </select>
        </div>

        {/* Ubicación */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Ubicación
          </label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Email de contacto
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Teléfono */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            backgroundColor: isSaving ? '#d1d5db' : '#2563eb',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}
