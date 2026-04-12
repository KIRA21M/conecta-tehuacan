'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Call API to update profile
      console.log('Updating profile:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <a
        href="#profile-form"
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
        Saltar al formulario de perfil
      </a>
      <h1>Mi Perfil</h1>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form id="profile-form" onSubmit={handleSubmit} aria-labelledby="profile-heading">
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="full_name" style={{ display: 'block', marginBottom: '5px' }}>
              Nombre Completo
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={!isEditing}
                aria-describedby="full_name_help"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  marginTop: '5px'
                }}
              />
            </label>
            <span id="full_name_help" style={{ display: 'none' }}>
              Ingresa tu nombre completo
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              Correo Electrónico
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                aria-describedby="email_help"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  marginTop: '5px'
                }}
              />
            </label>
            <span id="email_help" style={{ display: 'none' }}>
              Ingresa tu correo electrónico
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '5px' }}>
              Rol
              <input
                type="text"
                id="role"
                name="role"
                value={user.role}
                disabled
                aria-describedby="role_help"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  backgroundColor: '#f5f5f5',
                  marginTop: '5px'
                }}
              />
            </label>
            <span id="role_help" style={{ display: 'none' }}>
              Tu rol en la plataforma, no editable
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Editar información del perfil"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Editar Perfil
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={isLoading}
                  aria-label={isLoading ? 'Guardando cambios' : 'Guardar cambios del perfil'}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      full_name: user.full_name,
                      email: user.email,
                    });
                  }}
                  aria-label="Cancelar edición y restaurar valores originales"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
