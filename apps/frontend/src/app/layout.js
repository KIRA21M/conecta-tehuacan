import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar'

export const metadata = {
  title: 'Conecta Tehuacán',
  description: 'Plataforma para conectar oportunidades en Tehuacán',
  keywords: 'empleo, tehuacán, trabajo, conexiones',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#2867EC" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Post+No+Bills+Jaffna:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        
        <Navbar />
        
        <main id="main-content" className="main-container">
          {children}
        </main>
        
        {/* Puedes agregar un Footer aquí más tarde */}
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Detectar si JS está habilitado
              document.documentElement.classList.add('js-enabled');
              
              // Prevenir zoom en inputs en iOS
              document.addEventListener('touchstart', function() {}, {passive: true});
            `
          }}
        />
      </body>
    </html>
  )
}