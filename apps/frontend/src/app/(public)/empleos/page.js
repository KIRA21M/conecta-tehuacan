'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, MapPin, Building2, SlidersHorizontal } from 'lucide-react';

const empleosMock = [
  { id: 1, titulo: 'Administrador de Ventas', empresa: 'Distribuidora del Valle', ubicacion: 'San Nicolas Tetitzintla', modalidad: 'Híbrido', salario: '$10,000 - $12,000', categoria: 'Administración' },
  { id: 2, titulo: 'Desarrollador Web', empresa: 'Tech Solutions', ubicacion: 'Tehuacán Centro', modalidad: 'Remoto', salario: '$15,000 - $20,000', categoria: 'Tecnología' },
  { id: 3, titulo: 'Ejecutivo de Ventas', empresa: 'Comercial Norte', ubicacion: 'Tehuacán', modalidad: 'Presencial', salario: '$8,000 - $10,000', categoria: 'ventas' },
  { id: 4, titulo: 'Contador General', empresa: 'Grupo Empresarial', ubicacion: 'Tehuacán', modalidad: 'Híbrido', salario: '$12,000 - $15,000', categoria: 'Administración' },
];

function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px 24px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '8px', backgroundColor: '#e5e7eb', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '6px', marginBottom: '8px', width: '60%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '13px', backgroundColor: '#e5e7eb', borderRadius: '6px', width: '40%', animation: 'pulse 1.5s infinite' }} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '6px', width: '100px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '13px', backgroundColor: '#e5e7eb', borderRadius: '6px', width: '60px', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

function JobCard({ empleo, index }) {
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const timer = setTimeout(() => setVisible(true), prefersReducedMotion ? 0 : index * 150);
    return () => clearTimeout(timer);
  }, [index, prefersReducedMotion]);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px 24px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
      cursor: 'pointer',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s ease',
      opacity: prefersReducedMotion ? 1 : (visible ? 1 : 0),
      transform: prefersReducedMotion ? 'none' : (visible ? 'translateY(0)' : 'translateY(20px)'),
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '8px',
        backgroundColor: '#F1F5F9', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Building2 size={28} color="#94A3B8" />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0', color: '#111827' }}>{empleo.titulo}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#2563EB', fontSize: '13px', fontWeight: '500' }}>{empleo.empresa}</span>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span style={{ color: '#6B7280', fontSize: '13px' }}>{empleo.ubicacion}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ color: '#16A34A', fontWeight: '700', fontSize: '14px', margin: '0 0 4px 0' }}>{empleo.salario}</p>
        <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>{empleo.modalidad}</p>
      </div>
    </div>
  );
}

export default function Empleos() {
  const [loading, setLoading] = useState(true);
  const [empleos, setEmpleos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmpleos(empleosMock);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const empleosFiltrados = empleos.filter(e => {
    const coincideBusqueda = e.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.empresa.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaSeleccionada === '' || e.categoria === categoriaSeleccionada;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ background: '#ffffff', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ width: '90%', maxWidth: '1100px', margin: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Image src="/logo.svg" alt="Conecta Tehuacán" width={200} height={40} />
          </Link>
          <nav>
            <Link href="/contacto" style={{ marginLeft: '20px', textDecoration: 'none', color: '#6B7280', fontSize: '14px' }}>Contáctanos</Link>
            <Link href="/empleos" style={{ marginLeft: '20px', textDecoration: 'none', color: '#2563EB', fontSize: '14px', fontWeight: '600' }}>Explorar Empleos</Link>
            <Link href="/nosotros" style={{ marginLeft: '20px', textDecoration: 'none', color: '#6B7280', fontSize: '14px' }}>Sobre Nosotros</Link>
            <Link href="/login" style={{ marginLeft: '20px', textDecoration: 'none', color: '#6B7280', fontSize: '14px' }}>Iniciar Sesión</Link>
            <Link href="/registro" style={{ marginLeft: '20px', background: '#2563EB', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>Crear Cuenta</Link>
          </nav>
        </div>
      </header>

      {/* BÚSQUEDA */}
      <section style={{ backgroundColor: '#ffffff', padding: '40px 20px' }}>
        <div style={{ width: '90%', maxWidth: '700px', margin: 'auto', display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', flex: 1 }}>
            <Search size={18} color="#9CA3AF" style={{ marginRight: '10px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Puestos, Empresas ..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#111827', backgroundColor: 'transparent' }}
            />
          </div>
          <div style={{ width: '1px', height: '30px', backgroundColor: '#e5e7eb' }} />
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <MapPin size={18} color="#9CA3AF" style={{ marginRight: '10px', flexShrink: 0 }} />
            <input type="text" placeholder="Zona de Tehuacán" style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#111827', backgroundColor: 'transparent', width: '140px' }} />
          </div>
          <button style={{ backgroundColor: '#2563EB', color: '#ffffff', border: 'none', padding: '16px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Buscar Vacante
          </button>
        </div>
      </section>

      {/* CONTENIDO */}
      <section style={{ padding: '40px 20px', flex: 1, backgroundColor: '#ffffff' }}>
        <div style={{ width: '90%', maxWidth: '1100px', margin: 'auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', height: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <SlidersHorizontal size={18} color="#2563EB" />
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>Filtros</h3>
            </div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Categoría</p>
            {['Tecnología', 'Administración', 'ventas'].map(cat => (
              <label key={cat} htmlFor={`cat-${cat}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#6B7280' }}>
                <input
                  type="checkbox"
                  id={`cat-${cat}`}
                  checked={categoriaSeleccionada === cat}
                  onChange={() => setCategoriaSeleccionada(categoriaSeleccionada === cat ? '' : cat)}
                  style={{ cursor: 'pointer' }}
                />
                {cat}
              </label>
            ))}
          </div>
          <div>
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : empleosFiltrados.length > 0 ? (
              empleosFiltrados.map((empleo, index) => (
                <JobCard key={empleo.id} empleo={empleo} index={index} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
                <p style={{ fontSize: '16px' }}>No se encontraron empleos.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0F172A', color: '#ffffff', padding: '40px 0' }}>
        <div style={{ width: '90%', maxWidth: '1100px', margin: 'auto', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '10px' }}>
              <span>CONECTA</span><span style={{ color: '#2563EB' }}> TEHUACÁN</span>
            </div>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>La plataforma líder en vinculación laboral exclusiva para la ciudad de Tehuacán y sus alrededores.</p>
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
