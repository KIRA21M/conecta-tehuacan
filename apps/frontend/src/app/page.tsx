import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Search, MapPin, Briefcase, MapPinned, FileText, Users, ChevronRight } from 'lucide-react';

// Datos de vacantes destacadas
const vacantes = [
    {
        id: 1,
        titulo: 'Administrador de Ventas',
        empresa: 'Distribuidora del Valle',
        ubicacion: 'San Nicolas Tetitzintla',
        modalidad: 'Hibrido',
        salario: '$10,000 - $12,000',
    },
    {
        id: 2,
        titulo: 'Administrador de Ventas',
        empresa: 'Distribuidora del Valle',
        ubicacion: 'San Nicolas Tetitzintla',
        modalidad: 'Hibrido',
        salario: '$10,000 - $12,000',
    },
    {
        id: 3,
        titulo: 'Administrador de Ventas',
        empresa: 'Distribuidora del Valle',
        ubicacion: 'San Nicolas Tetitzintla',
        modalidad: 'Hibrido',
        salario: '$10,000 - $12,000',
    },
];

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FBFBFB]">
            <Header />

            {/* Hero */}
            <section className="pt-32 pb-10 px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl mx-auto">
                    Tu proximo empleo en{' '}
                    <span className="text-primary italic">Tehuacan</span> esta aqui.
                </h1>
                <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm md:text-base">
                    Conectamos el talento local con las mejores empresas de la region de forma rapida y gratuita.
                </p>

                {/* Barra de busqueda */}
                <div className="mt-10 max-w-2xl mx-auto bg-white rounded-full shadow-md border border-gray-100 flex items-center px-4 py-2 gap-2">
                    <Search size={20} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Puestos, Empresas ..."
                        className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder:text-gray-400"
                    />
                    <div className="h-6 w-px bg-gray-200" />
                    <MapPin size={18} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Zona de Tehuacan"
                        className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder:text-gray-400"
                    />
                    <button className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary-hover transition-colors shrink-0">
                        Buscar Vacante
                    </button>
                </div>
            </section>

            {/* Vacantes Destacadas */}
            <section className="max-w-6xl w-full mx-auto px-4 py-12">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Vacantes Destacadas</h2>
                <p className="text-sm text-gray-500 mb-8">Nuevas oportunidades publicadas hoy en la region.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {vacantes.map((v) => (
                        <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="font-bold text-gray-900">{v.titulo}</h3>
                                <p className="text-primary text-sm font-medium">{v.empresa}</p>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <MapPinned size={14} />
                                    <span>{v.ubicacion}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase size={14} />
                                    <span>{v.modalidad}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText size={14} />
                                    <span className="font-semibold text-gray-700">{v.salario}</span>
                                </div>
                            </div>
                            <button className="mt-auto border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Postularse ahora
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Seccion de Roles */}
            <section className="max-w-6xl w-full mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Buscas trabajo */}
                    <div className="bg-primary rounded-3xl p-8 md:p-10 text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">Buscas Trabajo?</h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-6">
                            Crea tu perfil profesional, carga tu CV y postulate a cientos de vacantes con un solo clic.
                        </p>
                        <ul className="space-y-2 mb-8 text-sm">
                            <li className="flex items-center gap-2">
                                <ChevronRight size={16} className="text-white/60" />
                                Carga de CV en PDF
                            </li>
                            <li className="flex items-center gap-2">
                                <ChevronRight size={16} className="text-white/60" />
                                Seguimiento de postulaciones
                            </li>
                        </ul>
                        <Link href="/dashboard" className="inline-block bg-white text-primary font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                            Ir a Mi Perfil
                        </Link>
                    </div>

                    {/* Eres reclutador */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Eres reclutador?</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Publica tus vacantes y encuentra al mejor talento de Tehuacan. Gestiona candidatos de forma eficiente.
                        </p>
                        <ul className="space-y-2 mb-8 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <ChevronRight size={16} className="text-gray-400" />
                                Publicacion de vacantes ilimitada
                            </li>
                            <li className="flex items-center gap-2">
                                <ChevronRight size={16} className="text-gray-400" />
                                Gestion de CVs recibidos
                            </li>
                        </ul>
                        <Link href="/recruiter" className="inline-block bg-gray-900 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
                            Dashboard Empresa
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
