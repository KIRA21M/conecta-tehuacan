# Usamos la versión ligera de Node
FROM node:20-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos solo los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies para que rinda el modo dev)
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Next.js
EXPOSE 3000

# Iniciamos en modo desarrollo directamente
CMD ["npm", "run", "dev"]
