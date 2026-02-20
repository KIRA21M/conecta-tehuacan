'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.email && formData.asunto && formData.mensaje) {
      setEnviado(true);
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      setTimeout(() => setEnviado(false), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleFormSubmit(e);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', sans-serif",
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      backgroundColor: '#F3F4F6',
      color: '#111827'
    }}>
      {/* HEADER */}
      <header style={{
        background: '#ffffff',
        padding: '20px 0',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '90%',
          maxWidth: '1100px',
          margin: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link href="/" style={{
              fontWeight: 'bold',
              fontSize: '20px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Image src="/logo.svg" alt="Conecta Tehuacán" width={200} height={40} />
            </Link>

            <nav>
              <Link 
                href="/contacto"
                style={{
                  marginLeft: '20px',
                  textDecoration: 'none',
                  color: '#6B7280',
                  fontSize: '14px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: '0.2s'
                }}
              >
                Contáctanos
              </Link>
              <Link 
                href="/empleos"
                style={{
                  marginLeft: '20px',
                  textDecoration: 'none',
                  color: '#6B7280',
                  fontSize: '14px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: '0.2s'
                }}
              >
                Explorar Empleos
              </Link>
              <Link 
                href="/nosotros"
                style={{
                  marginLeft: '20px',
                  textDecoration: 'none',
                  color: '#6B7280',
                  fontSize: '14px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: '0.2s'
                }}
              >
                Sobre Nosotros
              </Link>
              <Link 
                href="/login"
                style={{
                  marginLeft: '20px',
                  textDecoration: 'none',
                  color: '#6B7280',
                  fontSize: '14px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: '0.2s'
                }}
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/registro"
                style={{
                  marginLeft: '20px',
                  background: '#2563EB',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: '0.3s'
                }}
              >
                Crear Cuenta
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        textAlign: 'center',
        padding: '60px 0 40px 0'
      }}>
        <div style={{
          width: '90%',
          maxWidth: '1100px',
          margin: 'auto'
        }}>
          <h1 style={{
            fontSize: '36px',
            marginBottom: '15px'
          }}>
            Estamos aquí para <span style={{ color: '#2563EB' }}>ayudarte</span>
          </h1>
          <p style={{
            color: '#6B7280',
            maxWidth: '600px',
            margin: 'auto'
          }}>
            ¿Tienes dudas sobre cómo publicar una vacante o cómo mejorar tu perfil?
            Nuestro equipo te responderá en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section style={{
        padding: '40px 0 60px 0'
      }}>
        <div style={{
          width: '90%',
          maxWidth: '1100px',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px'
        }}>

          {/* CONTACT INFO */}
          <div style={{
            background: '#ffffff',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              marginBottom: '20px'
            }}>Datos de Contacto</h2>

            <div style={{
              marginBottom: '20px'
            }}>
              <strong>Email</strong>
              <p>soporte@conectatehuacan.com</p>
            </div>

            <div style={{
              marginBottom: '20px'
            }}>
              <strong>Teléfono</strong>
              <p>+52 238 123 4567</p>
            </div>

            <div>
              <strong>Síguenos en redes sociales</strong>
              <div style={{
                display: 'flex',
                marginTop: '10px'
              }}>
                <span style={{
                  marginRight: '10px',
                  color: '#2563EB',
                  fontWeight: '500'
                }}>Facebook</span>
                <span style={{
                  color: '#2563EB',
                  fontWeight: '500'
                }}>Instagram</span>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div style={{
            background: '#ffffff',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)'
          }}>
            <form onSubmit={handleFormSubmit}>
              <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  flex: 1
                }}>
                  <label htmlFor="nombre" style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>Nombre completo</label>
                  <input 
                    id="nombre" 
                    name="nombre"
                    type="text" 
                    value={formData.nombre}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Tu nombre completo"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      transition: '0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid #2563EB';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid #e5e7eb';
                      e.target.style.background = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{
                  flex: 1
                }}>
                  <label htmlFor="email" style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>Correo Electrónico</label>
                  <input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="correo@ejemplo.com"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      transition: '0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid #2563EB';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid #e5e7eb';
                      e.target.style.background = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div style={{
                marginBottom: '20px'
              }}>
                <label htmlFor="asunto" style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Asunto</label>
                <input 
                  id="asunto" 
                  name="asunto"
                  type="text" 
                  value={formData.asunto}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Asunto de tu mensaje"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    transition: '0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #2563EB';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{
                marginBottom: '20px'
              }}>
                <label htmlFor="mensaje" style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Tu Mensaje</label>
                <textarea 
                  id="mensaje" 
                  name="mensaje"
                  rows="5" 
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje aquí..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    resize: 'vertical',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    transition: '0.2s',
                    minHeight: '120px',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #2563EB';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                ></textarea>
              </div>

              {enviado && (
                <div style={{
                  padding: '12px',
                  marginBottom: '15px',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '8px',
                  color: '#065f46',
                  fontSize: '14px'
                }}>
                  ✓ Mensaje enviado correctamente. Nos pondremos en contacto pronto.
                </div>
              )}

              <button 
                type="submit" 
                style={{
                  width: '100%',
                  background: '#2563EB',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: '0.3s',
                  fontSize: '16px',
                  fontWeight: '500',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.background = '#1d4ed8';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.background = '#2563EB';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Enviar mensaje (Ctrl+Enter)
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER */}
<footer style={{
  background: '#0F172A',
  color: '#ffffff',
  padding: '40px 0',
  marginTop: 'auto'
}}>
  <div style={{
    width: '90%',
    maxWidth: '1100px',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px'
  }}>
    <div>
      <div style={{
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '10px'
      }}>
        <span style={{ color: '#ffffff' }}>CONECTA</span>
        <span style={{ color: '#2563EB' }}> TEHUACÁN</span>
      </div>
      <p style={{
        fontSize: '14px',
        color: '#cbd5e1'
      }}>
        La plataforma líder en vinculación laboral exclusiva para la ciudad de
        Tehuacán y sus alrededores.
      </p>
    </div>

    <div>
      <h3 style={{ marginBottom: '10px' }}>Contáctanos</h3>
      <p style={{ fontSize: '14px', color: '#cbd5e1' }}>Facebook</p>
      <p style={{ fontSize: '14px', color: '#cbd5e1' }}>Instagram</p>
    </div>
  </div>
</footer>

    </div>
  );
}