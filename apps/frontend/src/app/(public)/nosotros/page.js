'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function CounterCard({ icon, end, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(end / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '32px 24px',
      border: '1px solid #e5e7eb',
      textAlign: 'center',
      flex: '1'
    }}>
      <div style={{ fontSize: '36px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '40px', fontWeight: '800', color: '#2563EB', marginBottom: '8px' }}>
        +{count.toLocaleString()}
      </div>
      <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>{label}</p>
    </div>
  );
}

export default function Nosotros() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#111827',
      fontFamily: "'Segoe UI', sans-serif"
    }}>

      {/* HEADER */}
      <header style={{ background: '#ffffff', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ width: '90%', maxWidth: '1100px', margin: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Image src="/logo.svg" alt="Conecta Tehuacán" width={200} height={40} />
            </Link>
            <nav>
              <Link href="/contacto" style={{ marginLeft: '20px', textDecoration: 'none', color: '#6B7280', fontSize: '14px', padding: '8px 12px' }}>Contáctanos</Link>
              <Link href="/empleos" style={{ marginLeft: '20px', textDecoration: 'none', color: '#6B7280', fontSize: '14px', padding: '8px 12px' }}>Explorar Empleos</Link>
              <Link href="/nosotros" style={{ marginLeft: '20px', textDecoration: 'none', color: '#2563EB', fontSize: '14px', padding: '8px 12px', fontWeight: '600' }}>Sobre Nosotros</Link>
              <Link href="/login" style={{ marginLeft: '20px', textDecoration: 'none', color: '#6B7280', fontSize: '14px', padding: '8px 12px' }}>Iniciar Sesión</Link>
              <Link href="/registro" style={{ marginLeft: '20px', background: '#2563EB', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>Crear Cuenta</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ backgroundColor: '#ffffff', textAlign: 'center', padding: '60px 20px 50px 20px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
          Impulsando el futuro laboral<br />
          de <span style={{ color: '#2563EB' }}>Tehuacán</span>.
        </h1>
        <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '420px', margin: 'auto', lineHeight: '1.6' }}>
          Nacimos para conectar el talento de nuestra ciudad con las empresas que la hacen crecer.
        </p>
      </section>

      {/* CARDS MISIÓN Y VISIÓN */}
      <section style={{ backgroundColor: '#ffffff', padding: '20px 20px 50px 20px' }}>
        <div style={{ width: '90%', maxWidth: '1100px', margin: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <Target size={44} color="#2563EB" strokeWidth={1.5} />
              <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>Nuestra Misión</h2>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              Brindar una plataforma tecnológica que facilite la empleabilidad en Tehuacán.
            </p>
          </div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <Eye size={44} color="#16A34A" strokeWidth={1.5} />
              <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>Nuestra Visión</h2>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              Convertirnos en el ecosistema laboral más confiable de la región.
            </p>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section style={{ backgroundColor: '#F8FAFF', padding: '60px 20px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ width: '90%', maxWidth: '1100px', margin: 'auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
            Nuestro impacto en <span style={{ color: '#2563EB' }}>números</span>
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '40px', fontSize: '15px' }}>
            Conectando talento y empresas en Tehuacán desde el primer día.
          </p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <CounterCard icon="🏢" end={200} label="Empresas registradas" />
            <CounterCard icon="👥" end={1500} label="Candidatos activos" />
            <CounterCard icon="💼" end={800} label="Empleos publicados" />
            <CounterCard icon="✅" end={500} label="Contrataciones exitosas" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0F172A', color: '#ffffff', padding: '40px 0', marginTop: 'auto' }}>
        <div style={{ width: '90%', maxWidth: '1100px', margin: 'auto', display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '10px' }}>
              <span style={{ color: '#ffffff' }}>CONECTA</span>
              <span style={{ color: '#2563EB' }}> TEHUACÁN</span>
            </div>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>
              La plataforma líder en vinculación laboral exclusiva para la ciudad de Tehuacán y sus alrededores.
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