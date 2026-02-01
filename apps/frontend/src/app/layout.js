import { Inter } from 'next/font/google'
import '../styles/globals.css'
import ClientLayout from '../components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Conecta Tehuacán',
  description: 'Plataforma de conexión laboral para Tehuacán',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}