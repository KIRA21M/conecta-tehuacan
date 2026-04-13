// Test de Integración: Applications Routes
// Prueba el flujo completo: HTTP Request → Controller → Service → Database

const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');

// Mock de JWT helper
jest.mock('../../utils/jwt', () => ({
  verifyAccessToken: jest.fn((token) => {
    if (token === 'valid_token_aspirante') {
      return { 
        id: 5, 
        email: 'candidate@test.com', 
        role: 'aspirante' 
      };
    }
    if (token === 'valid_token_reclutador') {
      return { 
        id: 10, 
        email: 'recruiter@test.com', 
        role: 'reclutador' 
      };
    }
    throw new Error('Invalid token');
  }),
}));

jest.mock('../../config/db');

describe('Applications Routes - Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    db.query = jest.fn();
  });

  describe('POST /api/applications - Create Application', () => {
    it('debe crear una aplicación como candidato autenticado', async () => {
      db.query
        .mockResolvedValueOnce([[{ id: 10, title: 'Senior Developer' }]]) // Check job exists
        .mockResolvedValueOnce([[]]) // Check already applied
        .mockResolvedValueOnce([{ insertId: 1 }]); // Insert application

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .send({
          job_id: 10,
          cover_letter: 'Soy muy interesado en esta posición'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('ok', true);
    });

    it('debe rechazar aplicación sin autenticación', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          job_id: 10,
          cover_letter: 'Test'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/applications - List My Applications', () => {
    it('debe retornar aplicaciones del candidato autenticado', async () => {
      const mockApps = [
        { id: 1, job_id: 10, status: 'pending', total: 1 }
      ];

      db.query.mockResolvedValueOnce([mockApps]); // SELECT rows

      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('debe paginar resultados correctamente', async () => {
      // El servicio usa rows[0].total para el meta.
      db.query.mockResolvedValueOnce([[{ id: 1, total: 5 }]]); 

      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .query({ page: 2, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.meta).toBeDefined();
    });
  });

  describe('PATCH /api/applications/:id/status - Update Status', () => {
    it('debe actualizar estado como reclutador propietario', async () => {
      db.query
        .mockResolvedValueOnce([[{ id: 1, job_id: 10, recruiter_user_id: 10 }]]) // ensureApplicationJobOwner
        .mockResolvedValueOnce([[{ id: 1, job_id: 10, candidate_id: 5, status: 'pending' }]]) // getApplicationById (for audit)
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // UPDATE

      const response = await request(app)
        .patch('/api/applications/1/status')
        .set('Authorization', `Bearer valid_token_reclutador`)
        .send({
          status: 'accepted'
        });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('debe rechazar si la aplicación no existe', async () => {
      // ensureApplicationJobOwner returns nothing -> 403/404 based on implementation
      db.query.mockResolvedValueOnce([[]]); 

      const response = await request(app)
        .patch('/api/applications/999/status')
        .set('Authorization', `Bearer valid_token_reclutador`)
        .send({
          status: 'accepted'
        });

      // El middleware de seguridad o el servicio lanza 403 si no hay permisos/existencia comprobada
      expect([403, 404]).toContain(response.status);
    });
  });

  describe('POST /api/applications/favorites - Add Favorite', () => {
    it('debe agregar un job a favoritos', async () => {
      db.query
        .mockResolvedValueOnce([[{ id: 10 }]]) // Job exists
        .mockResolvedValueOnce([[]]) // Not favorited yet
        .mockResolvedValueOnce([{ insertId: 100 }]); // INSERT

      const response = await request(app)
        .post('/api/applications/favorites')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .send({
          job_id: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
    });

    it('debe evitar duplicados en favoritos', async () => {
      db.query
        .mockResolvedValueOnce([[{ id: 10 }]]) // Job exists
        .mockResolvedValueOnce([[{ id: 100 }]]); // Already favorited

      const response = await request(app)
        .post('/api/applications/favorites')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .send({
          job_id: 10
        });

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/applications/job/:jobId - List Job Applications (Recruiter)', () => {
    it('debe retornar todas las aplicaciones de un job', async () => {
      db.query
        .mockResolvedValueOnce([[{ id: 10, recruiter_user_id: 10 }]]) // check owner
        .mockResolvedValueOnce([[{ id: 1, total: 1 }]]); // fetch items

      const response = await request(app)
        .get('/api/applications/job/10')
        .set('Authorization', `Bearer valid_token_reclutador`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('debe rechazar si reclutador no es propietario del job', async () => {
      db.query.mockResolvedValueOnce([[]]); // Job not found or not owner

      const response = await request(app)
        .get('/api/applications/job/10')
        .set('Authorization', `Bearer valid_token_reclutador`);

      expect([403, 404]).toContain(response.status);
    });
  });
});
