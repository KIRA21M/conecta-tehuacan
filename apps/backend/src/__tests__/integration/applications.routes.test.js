// Test de Integración: Applications Routes
// Prueba el flujo completo: HTTP Request → Controller → Service → Database

const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');

// Mock de JWT helper
jest.mock('../../utils/jwt', () => ({
  verifyToken: jest.fn((token) => {
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
    // Mock de las queries de BD
    db.query = jest.fn();
  });

  describe('POST /api/applications - Create Application', () => {
    it('debe crear una aplicación como candidato autenticado', async () => {
      const mockApplication = {
        id: 1,
        job_id: 10,
        candidate_id: 5,
        status: 'pending',
        cover_letter: 'Soy muy interesado en esta posición'
      };

      db.query
        .mockResolvedValueOnce([{ id: 10, title: 'Senior Developer' }]) // Job existe
        .mockResolvedValueOnce([{ insertId: 1 }]); // Insertar aplicación

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .send({
          job_id: 10,
          cover_letter: 'Soy muy interesado en esta posición'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('data');
      expect(db.query).toHaveBeenCalled();
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

    it('debe validar que job_id sea requerido', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .send({
          cover_letter: 'Test sin job_id'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('debe validar longitud máxima de cover_letter', async () => {
      const longCoverLetter = 'a'.repeat(5001); // Excede límite

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .send({
          job_id: 10,
          cover_letter: longCoverLetter
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/applications - List My Applications', () => {
    it('debe retornar aplicaciones del candidato autenticado', async () => {
      const mockApplications = [
        { 
          id: 1, 
          job_id: 10, 
          status: 'pending',
          job_title: 'Senior Developer',
          company_name: 'Tech Corp'
        },
        { 
          id: 2, 
          job_id: 11, 
          status: 'accepted',
          job_title: 'Junior Developer',
          company_name: 'StartUp Inc'
        }
      ];

      db.query = jest.fn()
        .mockResolvedValueOnce([[mockApplications[0], mockApplications[1]]]) // SELECT
        .mockResolvedValueOnce([[{ total: 2 }]]); // COUNT

      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debe paginar resultados correctamente', async () => {
      db.query = jest.fn()
        .mockResolvedValueOnce([[]]) // Sin resultados en página 2
        .mockResolvedValueOnce([[{ total: 5 }]]);

      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .query({ page: 2, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.meta).toHaveProperty('page', 2);
    });
  });

  describe('PATCH /api/applications/:id/status - Update Status', () => {
    it('debe actualizar estado como reclutador propietario', async () => {
      db.query
        .mockResolvedValueOnce([{ id: 1, job_id: 10, status: 'pending' }]) // App existe
        .mockResolvedValueOnce([{ id: 10 }]) // Job del reclutador
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update

      const response = await request(app)
        .patch('/api/applications/1/status')
        .set('Authorization', `Bearer valid_token_reclutador`)
        .send({
          status: 'accepted'
        });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('debe requerir rejection_reason cuando status es rejected', async () => {
      const response = await request(app)
        .patch('/api/applications/1/status')
        .set('Authorization', `Bearer valid_token_reclutador`)
        .send({
          status: 'rejected'
          // Falta rejection_reason
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('debe validar que solo reclutador pueda actualizar estado', async () => {
      const response = await request(app)
        .patch('/api/applications/1/status')
        .set('Authorization', `Bearer valid_token_aspirante`) // Rol incorrecto
        .send({
          status: 'accepted'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/applications/favorites - Add Favorite', () => {
    it('debe agregar un job a favoritos', async () => {
      db.query
        .mockResolvedValueOnce([{ id: 10 }]) // Job existe
        .mockResolvedValueOnce([{ insertId: 100 }]); // Favorito creado

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
        .mockResolvedValueOnce([{ id: 10 }])
        .mockRejectedValueOnce(new Error('Duplicate entry for key favorites.UC_favorite_candidate_job'));

      const response = await request(app)
        .post('/api/applications/favorites')
        .set('Authorization', `Bearer valid_token_aspirante`)
        .send({
          job_id: 10
        });

      expect(response.status).toBe(409); // Conflict
    });
  });

  describe('GET /api/applications/job/:jobId - List Job Applications (Recruiter)', () => {
    it('debe retornar todas las aplicaciones de un job', async () => {
      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 10, recruiter_user_id: 10 }]) // Verifica propiedad
        .mockResolvedValueOnce([
          [
            { 
              id: 1, 
              candidate_id: 5, 
              candidate_name: 'John Doe',
              status: 'pending',
              created_at: '2024-01-15'
            }
          ]
        ])
        .mockResolvedValueOnce([[{ total: 1 }]]);

      const response = await request(app)
        .get('/api/applications/job/10')
        .set('Authorization', `Bearer valid_token_reclutador`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debe rechazar si reclutador no es propietario del job', async () => {
      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 10, recruiter_user_id: 999 }]); // Otro reclutador

      const response = await request(app)
        .get('/api/applications/job/10')
        .set('Authorization', `Bearer valid_token_reclutador`);

      expect(response.status).toBe(403);
    });
  });
});
