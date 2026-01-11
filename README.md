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

## 🛠️ Stack Tecnológico

[cite_start]Para garantizar que la plataforma sea escalable y capaz de manejar la interacción bidireccional requerida, se ha seleccionado el siguiente stack tecnológico[cite: 15, 18]:

### Frontend (Lado del Cliente)
* [cite_start]**React:** Se utiliza esta biblioteca declarativa y eficiente para construir interfaces de usuario basadas en piezas individuales llamadas componentes[cite: 20, 21].
* [cite_start]**Interactividad:** Facilita la actualización de la interfaz en tiempo real en respuesta a las acciones del usuario, como la búsqueda de vacantes[cite: 23, 24].
* [cite_start]**Herramientas:** Se propone el uso de **Vite** para un desarrollo ágil, junto con bibliotecas como **Zustand** o **Redux** para la gestión de estados complejos[cite: 25, 27].

### Backend (Lado del Servidor)
* [cite_start]**Node.js con Express/NestJS:** Proporciona un entorno de ejecución orientado a eventos diseñado para aplicaciones de red escalables[cite: 29, 30].
* [cite_start]**Manejo de Conexiones:** Es ideal para gestionar múltiples conexiones concurrentes sin bloqueo, lo cual es fundamental para una plataforma con flujo constante de usuarios y vacantes[cite: 31, 32].
* [cite_start]**Lógica de Negocio:** El servidor se encarga de las rutas API, la gestión de autenticación, la seguridad y la comunicación con la base de datos[cite: 34, 51].

### Base de Datos
* [cite_start]**MySQLL:** Se recomienda este sistema relacional por su capacidad para manejar datos estructurados (usuarios, empresas, postulaciones) y su soporte para consultas complejas[cite: 36, 37, 39].
* [cite_start]**Geolocalización:** Permite el uso de extensiones como **PostGIS** para implementar filtros de cercanía y ubicación específicos para la región de Tehuacán[cite: 16, 40].