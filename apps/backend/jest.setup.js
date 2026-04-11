// Jest setup file
afterEach(() => {
  jest.clearAllMocks();
});

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'root_password';
process.env.DB_NAME = 'conecta_test';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.JWT_EXPIRE = '24h';
