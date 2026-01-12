# Conecta Tehuacán

Proyecto profesional listo para producción.

Definición del problema y justificación de una App Web 
El objetivo de Conecta Tehuacán es servir como puente entre buscadores de 
empleo y empresas del área de Tehuacán, Puebla. La solución debe permitir que 
micro‑empresas, negocios familiares y compañías grandes publiquen vacantes, 
que los candidatos filtren por ubicación, sector o tipo de trabajo y que se gestione 
la comunicación entre ambas partes. Un sitio web informativo no es suficiente 
porque necesita mayor interacción. La tabla de la guía de Hostinger describe que 
un sitio web suele presentar contenido estático y la interacción se limita a leer o 
navegar; un web app es altamente interactivo y permite que el usuario realice 
tareas como introducir, modificar y recuperar datos en tiempo real[1]. Además, el 
web app requiere marcos y tecnologías del lado del servidor para funcionar de 
forma dinámica. 
En el caso de Conecta Tehuacán, los usuarios necesitan: 
• Crear perfiles y currículos, lo que implica almacenar datos de usuario y 
gestionarlos de forma segura. 
• Publicar ofertas de empleo, editar anuncios y recibir postulaciones. 
• Realizar búsquedas filtradas por ubicación (Tehuacán y localidades 
cercanas), tipo de empleo y remuneración, es decir, consultas dinámicas a 
la base de datos. 
• Notificaciones y mensajería entre candidatos y empleadores. 
Estas 
funcionalidades 
requieren 
una plataforma con autenticación, 
almacenamiento y actualización de datos, y filtrado dinámico que no es posible 
con una página HTML estática. Por ello es necesario desarrollar una App Web 
completa con capas frontend y backend, que permita interacción bidireccional y 
actualización en tiempo real. Además, el enfoque local de Tehuacán puede 
aprovechar el uso de geolocalización y filtros de cercanía; el web app podrá 
escalar para incluir empresas de distintos tamaños, gestionar grandes volúmenes 
de vacantes y usuarios y, en un futuro, integrar servicios adicionales (por ejemplo 
pagos para ofertas destacadas). 
## Stack Tecnológico

Para garantizar que la plataforma sea escalable y capaz de manejar la interacción bidireccional requerida, se ha seleccionado el siguiente stack tecnológico:

### Frontend (Lado del Cliente)
* **React:** Biblioteca declarativa y eficiente para construir interfaces de usuario basadas en componentes reutilizables.
* **Vite:** Herramienta de construcción para un entorno de desarrollo ágil y rápido.
* **Next.js:** Framework complementario para optimizar el rendimiento mediante renderizado del lado del servidor (SSR) y rutas dinámicas.
* **Gestión de Estados:** Uso de bibliotecas maduras como **Redux** o **Zustand** para manejar la complejidad de los datos en el cliente.
* **Interactividad:** Actualización de la interfaz en tiempo real en respuesta a las acciones del usuario, como búsquedas y postulaciones.

### Backend (Lado del Servidor)
* **Node.js:** Entorno de ejecución de JavaScript orientado a eventos, diseñado para aplicaciones de red escalables y conexiones concurrentes.
* **Express / NestJS:** Frameworks para la creación rápida de rutas API (Express) o para implementar una arquitectura modular y estructurada.
* **Lógica de Negocio:** Gestión de autenticación, seguridad, APIs HTTP y comunicación fluida con la base de datos.

### Base de Datos y Persistencia
* **MySQL / PostgreSQL:** Sistemas relacionales para el manejo de datos estructurados como empresas, usuarios y vacantes.
* **Prisma / TypeORM:** Uso de ORMs para abstraer la base de datos, facilitar las migraciones y mejorar la mantenibilidad del código.
* **Geolocalización:** Implementación de filtros de cercanía y ubicación específicos para la región de Tehuacán.
  
 ## Hosting y Servicios
* *servidor:* Despliegue del backend en contenedores *Docker* (servidores VPS o Kubernetes) para facilitar la escalabilidad. También se consideran servicios PaaS como Heroku, Render o Fly.io
  
*Almacenamiento:* Uso de servicios en la nube como AWS S3, Google Cloud Storage o DigitalOcean Spaces para archivos (CVs en PDF e imágenes)

*Notificaciones:* Integración con SendGrid o Mailgun para correos y, en fases posteriores, notificaciones push

## Estructura del Proyecto 
CONECTA-TEHUACAN/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│       # Pipeline de integración continua (CI) con GitHub Actions
│
├── .husky/
│   └── pre-commit
│       # Hook de Git para validaciones antes de cada commit
│
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   └── index.js
│   │   │   # Punto de entrada del servidor backend
│   │   ├── Dockerfile
│   │   │   # Imagen Docker para el backend
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   └── frontend/
│       ├── src/
│       │   └── main.tsx
│       │   # Punto de entrada del frontend
│       ├── index.html
│       ├── Dockerfile
│       │   # Imagen Docker para el frontend
│       ├── vite.config.js
│       ├── package.json
│       └── package-lock.json
│
├── docker/
│   └── docker-compose.yml
│       # Orquestación de contenedores (frontend, backend, servicios)
│
├── investigación comparativa/
│   ├── Kevin Ricardo Simon Alfaro.pdf
│   ├── Marco Antonio Aguilar.pdf
│   ├── Osbaldo Alvarez.pdf
│   └── Samuel Jonathan Trujillo Bolaños.pdf
│       # Documentos individuales de investigación comparativa
│
├── docker-stack.yml
│   # Archivo alternativo para despliegue de servicios
│
├── .gitignore
│   # Archivos y carpetas ignorados por Git
│
├── package.json
│   # Configuración general del monorepo
│
└── README.md
    # Documentación principal del proyecto
### ### ### ### ### ### ### ### ### ### ### 