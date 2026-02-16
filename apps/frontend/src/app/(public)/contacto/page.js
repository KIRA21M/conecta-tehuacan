export default function ContactoPage() {
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
      {/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/anchor-is-valid */}
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
            <div style={{
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              <span style={{ color: '#111827' }}>CONECTA</span>
              <span style={{ color: '#2563EB' }}>TEHUACÁN</span>
            </div>

            <nav>
              <button tabIndex={-1} type="button" style={{
                marginLeft: '20px',
                textDecoration: 'none',
                color: '#6B7280',
                fontSize: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>Contáctanos</button>
              <button tabIndex={-1} type="button" style={{
                marginLeft: '20px',
                textDecoration: 'none',
                color: '#6B7280',
                fontSize: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>Explorar Empleos</button>
              <button tabIndex={-1} type="button" style={{
                marginLeft: '20px',
                textDecoration: 'none',
                color: '#6B7280',
                fontSize: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>Sobre Nosotros</button>
              <button tabIndex={-1} type="button" style={{
                marginLeft: '20px',
                textDecoration: 'none',
                color: '#6B7280',
                fontSize: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>Iniciar Sesión</button>
              <button tabIndex={-1} type="button" style={{
                marginLeft: '20px',
                background: '#2563EB',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: '0.3s',
                fontSize: '14px'
              }}>Crear Cuenta</button>
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
            <form>
              <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  flex: 1
                }}>
                  <label htmlFor="name" style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '14px'
                  }}>Nombre completo</label>
                  <input id="name" type="text" readOnly style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb'
                  }} />
                </div>

                <div style={{
                  flex: 1
                }}>
                  <label htmlFor="email" style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '14px'
                  }}>Correo Electrónico</label>
                  <input id="email" type="email" readOnly style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb'
                  }} />
                </div>
              </div>

              <div style={{
                marginBottom: '20px'
              }}>
                <label htmlFor="subject" style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px'
                }}>Asunto</label>
                <input id="subject" type="text" readOnly style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb'
                }} />
              </div>

              <div style={{
                marginBottom: '20px'
              }}>
                <label htmlFor="message" style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px'
                }}>Tu Mensaje</label>
                <textarea id="message" rows="5" readOnly style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  resize: 'none'
                }}></textarea>
              </div>

              <button type="button" tabIndex={-1} style={{
                width: '100%',
                background: '#2563EB',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: '0.3s',
                fontSize: '16px'
              }}>Enviar mensaje</button>
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