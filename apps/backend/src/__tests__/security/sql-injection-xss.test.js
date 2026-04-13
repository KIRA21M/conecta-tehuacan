// Security Test: SQL Injection and XSS Protection
// Tests that middleware effectively blocks or sanitizes malicious input

const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');

// Mock de JWT helper
jest.mock('../../utils/jwt', () => ({
  verifyAccessToken: jest.fn(() => ({ 
    id: 5, 
    email: 'test@test.com', 
    role: 'aspirante' 
  })),
}));

jest.mock('../../config/db');

describe('Security Middleware - Injection Protection', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    db.query = jest.fn();
  });

  describe('SQL Injection Protection', () => {
    it('debe detectar y bloquear intentos de SQL Injection en parámetros query', async () => {
      db.query.mockResolvedValue([[]]);

      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', 'Bearer valid_token')
        .query({ job_id: "1' OR '1'='1" });

      // El validador detecta que no es entero y devuelve 400
      expect(response.status).toBe(400);
    });

    it('debe bloquear entradas en el body que contengan patrones de inyección', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', 'Bearer valid_token')
        .send({
          job_id: 10,
          cover_letter: "Malicious note'); DROP TABLE users; --"
        });

      // El middleware de protección detecta el patrón DROP TABLE y bloquea con 400
      expect(response.status).toBe(400);
    });
  });

  describe('XSS Protection', () => {
    it('debe bloquear tags HTML sospechosos para prevenir XSS', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', 'Bearer valid_token')
        .send({
          job_id: 10,
          cover_letter: "<script>alert('xss')</script>Hola"
        });

      // El middleware de protección detecta <script> y bloquea con 400
      expect(response.status).toBe(400);
    });
  });
});
