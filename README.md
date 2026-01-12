# Conecta Tehuacán

Proyecto profesional listo para producción.

## Definición del Problema y Justificación

El objetivo de Conecta Tehuacán es servir como puente entre buscadores de empleo y empresas del área de Tehuacán, Puebla. La solución debe permitir que micro‑empresas, negocios familiares y compañías grandes publiquen vacantes, que los candidatos filtren por ubicación, sector o tipo de trabajo y que se gestione la comunicación entre ambas partes.

Un sitio web informativo no es suficiente porque necesita mayor interacción. La tabla de la guía de Hostinger describe que un sitio web suele presentar contenido estático y la interacción se limita a leer o navegar; un web app es altamente interactivo y permite que el usuario realice tareas como introducir, modificar y recuperar datos en tiempo real[1]. Además, el web app requiere marcos y tecnologías del lado del servidor para funcionar de forma dinámica.

### Funcionalidades Requeridas

En el caso de Conecta Tehuacán, los usuarios necesitan:

* Crear perfiles y currículos, lo que implica almacenar datos de usuario y gestionarlos de forma segura
* Publicar ofertas de empleo, editar anuncios y recibir postulaciones
* Realizar búsquedas filtradas por ubicación (Tehuacán y localidades cercanas), tipo de empleo y remuneración, es decir, consultas dinámicas a la base de datos
* Notificaciones y mensajería entre candidatos y empleadores

Estas funcionalidades requieren una plataforma con autenticación, almacenamiento y actualización de datos, y filtrado dinámico que no es posible con una página HTML estática. Por ello es necesario desarrollar una App Web completa con capas frontend y backend, que permita interacción bidireccional y actualización en tiempo real.

Además, el enfoque local de Tehuacán puede aprovechar el uso de geolocalización y filtros de cercanía; el web app podrá escalar para incluir empresas de distintos tamaños, gestionar grandes volúmenes de vacantes y usuarios y, en un futuro, integrar servicios adicionales (por ejemplo pagos para ofertas destacadas).

## Stack Tecnológico

Para garantizar que la plataforma sea escalable y capaz de manejar la interacción bidireccional requerida, se ha seleccionado el siguiente stack tecnológico:

### Frontend (Lado del Cliente)
* **React:** Biblioteca declarativa y eficiente para construir interfaces de usuario basadas en componentes reutilizables
* **Vite:** Herramienta de construcción para un entorno de desarrollo ágil y rápido
* **Next.js:** Framework complementario para optimizar el rendimiento mediante renderizado del lado del servidor (SSR) y rutas dinámicas
* **Gestión de Estados:** Uso de bibliotecas maduras como **Redux** o **Zustand** para manejar la complejidad de los datos en el cliente
* **Interactividad:** Actualización de la interfaz en tiempo real en respuesta a las acciones del usuario, como búsquedas y postulaciones

### Backend (Lado del Servidor)
* **Node.js:** Entorno de ejecución de JavaScript orientado a eventos, diseñado para aplicaciones de red escalables y conexiones concurrentes
* **Express / NestJS:** Frameworks para la creación rápida de rutas API (Express) o para implementar una arquitectura modular y estructurada
* **Lógica de Negocio:** Gestión de autenticación, seguridad, APIs HTTP y comunicación fluida con la base de datos

### Base de Datos y Persistencia
* **PostgreSQL:** Sistemas relacionales para el manejo de datos estructurados como empresas, usuarios y vacantes
* **Prisma / TypeORM:** Uso de ORMs para abstraer la base de datos, facilitar las migraciones y mejorar la mantenibilidad del código
* **Geolocalización:** Implementación de filtros de cercanía y ubicación específicos para la región de Tehuacán

## Hosting y Servicios

* **Servidor:** Despliegue del backend en contenedores **Docker** (servidores VPS o Kubernetes) para facilitar la escalabilidad. También se consideran servicios PaaS como Heroku, Render o Fly.io
* **Almacenamiento:** Uso de servicios en la nube como AWS S3, Google Cloud Storage o DigitalOcean Spaces para archivos (CVs en PDF e imágenes)
* **Notificaciones:** Integración con SendGrid o Mailgun para correos y, en fases posteriores, notificaciones push

## 🐳 Configuración con Docker

El proyecto utiliza contenedores para estandarizar el entorno de desarrollo:

### Servicios
* **Backend:** Imagen node:18, puerto 3000, comando `npm start`
* **Frontend:** Imagen node:18, puerto 5173, comando `npm run dev`

### Ejecución
```bash
docker-compose up -d
```

## 👥 Equipo y Roles

Para garantizar una correcta organización del proyecto y una ejecución eficiente de cada fase de desarrollo, se han definido los siguientes roles técnicos. Cada integrante aporta una especialización crítica para cubrir el ciclo de vida completo del software:

### Tech Lead / Arquitectura
* **ID:** 3523110229
* **Arquitectura de Sistemas:** Diseño de la estructura global, asegurando que los componentes sean modulares, escalables y mantenibles
* **Estándares Técnicos:** Definición de buenas prácticas de codificación, convenciones de nombres y selección de patrones de diseño
* **Coordinación Técnica:** Supervisión de la interoperabilidad entre el frontend, backend y servicios de terceros
* **Estrategia:** Evaluación de riesgos técnicos y validación de las decisiones de ingeniería más críticas del proyecto

### Frontend
* **ID:** 3523110279
* **Interfaz de Usuario (UI):** Desarrollo de vistas interactivas utilizando **React** y **Vite**, priorizando la experiencia del usuario (UX)
* **Componentización:** Implementación de una librería de componentes reutilizables y atómicos para agilizar el desarrollo
* **Gestión de Estado:** Manejo de la lógica de presentación y sincronización de datos en tiempo real con el servidor
* **Adaptabilidad:** Garantía de un diseño responsivo que funcione correctamente en múltiples dispositivos y resoluciones

### Backend 
* **ID:** 3523110374
* **Lógica de Negocio:** Implementación de los procesos núcleo del sistema mediante **Node.js** y **Express**
* **Seguridad y Acceso:** Gestión de esquemas de autenticación, autorización y protección de datos sensibles
* **Arquitectura de API:** Diseño de endpoints REST eficientes para la comunicación bidireccional con el cliente
* **Integración de Datos:** Manejo de la persistencia y comunicación fluida con la base de datos y servicios externos

### DevOps / CI-CD
* **ID:** 3523110007
* **Virtualización:** Configuración de contenedores **Docker** para estandarizar los entornos de desarrollo y producción
* **Automatización:** Implementación de flujos de **Integración y Despliegue Continuo (CI/CD)** para lanzamientos ágiles
* **Infraestructura:** Gestión del alojamiento, monitoreo de la estabilidad del sistema y configuración de servidores
* **Flujo de Trabajo:** Supervisión del control de versiones en GitHub y mantenimiento de la integridad de las ramas

### QA / Testing
* **ID:** 3523110321
* **Control de Calidad:** Validación rigurosa de cada funcionalidad frente a los requisitos de usuario definidos
* **Code Review:** Revisión técnica del código fuente para asegurar que se sigan los estándares de arquitectura establecidos
* **Pruebas de Integración:** Verificación de la comunicación entre módulos y aprobación de **Pull Requests**
* **Mantenimiento:** Identificación, reporte y seguimiento de errores para garantizar un producto final libre de fallos críticos
