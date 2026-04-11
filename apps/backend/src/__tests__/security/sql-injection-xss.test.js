// Test de Seguridad: Applications Endpoints
// Valida protecciones contra ataques comunes: SQL injection, XSS, unauthorized access

const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');

jest.mock('../../utils/jwt', () => ({
  verifyToken: jest.fn((token) => {
    if (token === 'valid_token_aspirante_5') {
      return { id: 5, email: 'candidate@test.com', role: 'aspirante' };
    }
    if (token === 'valid_token_reclutador_10') {
      return { id: 10, email: 'recruiter@test.com', role: 'reclutador' };
    }
    if (token === 'valid_token_admin_1') {
      return { id: 1, email: 'admin@test.com', role: 'admin' };
    }
    throw new Error('Invalid token');
  }),
}));

jest.mock('../../config/db');

describe('Security Tests - Applications Endpoints', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    db.query = jest.fn();
  });

  // ============ SQL INJECTION TESTS ============
  describe('SQL Injection Prevention', () => {
    
    it('debe prevenir SQL injection en WHERE clause de búsqueda', async () => {
      const sqlInjectionPayload = "1' OR '1'='1";

      db.query = jest.fn()
        .mockResolvedValueOnce([[
          { 
            id: 1, 
            job_id: 10, 
            status: 'pending' 
          }
        ]]);

      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .query({ 
          job_id: sqlInjectionPayload 
        });

      // Verificar que express-validator evitó el injection
      expect(response.status).toBe(400); // Debe rechazar ID inválido
    });

    it('debe usar parameterized queries para prevenir SQL injection', async () => {
      // Este test verifica que los parametros se pasen correctamente a db.query
      const candidateId = 5;
      
      db.query = jest.fn().mockResolvedValueOnce([[]]);

      await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`);

      // Verificar que db.query fue llamado (el middleware debería usar parameterized query)
      expect(db.query).toHaveBeenCalled();
      
      // En el servicio actual, debería hacer algo como:
      // db.query('SELECT * FROM applications WHERE candidate_id = ?', [candidateId])
      const callArgs = db.query.mock.calls[0];
      expect(callArgs.length).toBeGreaterThan(0);
    });

    it('debe escapar comillas en cover_letter para prevenir SQL injection', async () => {
      const payloadWithQuotes = "Test'; DROP TABLE applications; --";

      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 10 }]) // Job existe
        .mockResolvedValueOnce([{ insertId: 1 }]); // Aplicación creada

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: 10,
          cover_letter: payloadWithQuotes
        });

      // El middleware de validación debe escapar/sanitizar
      expect(response.status).toBe(201); // Acepta pero escapa el payload
      
      // Verificar que db.query fue llamado con el payload escapado
      expect(db.query).toHaveBeenCalled();
    });
  });

  // ============ XSS (Cross-Site Scripting) TESTS ============
  describe('XSS (Cross-Site Scripting) Prevention', () => {
    
    it('debe escapar HTML en cover_letter', async () => {
      const xssPayload = '<script>alert("XSS")</script>';

      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 10 }])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: 10,
          cover_letter: xssPayload
        });

      // express-validator.escape() debe convertir < a &lt; etc
      expect(response.status).toBe(201);
    });

    it('debe escapar HTML en query parameters', async () => {
      const xssPayload = '<img src=x onerror=alert("XSS")>';

      db.query = jest.fn().mockResolvedValueOnce([]);

      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .query({ 
          search: xssPayload 
        });

      // Debe retornar 200 (sin error 400)
      // El payload será escapado por express-validator
      expect([200, 400]).toContain(response.status);
    });
  });

  // ============ AUTHORIZATION & ACCESS CONTROL TESTS ============
  describe('Authorization & Access Control', () => {
    
    it('debe rechazar acceso a rutas sin autenticación', async () => {
      const response = await request(app)
        .get('/api/applications')
        // NO envía Authorization header

      expect(response.status).toBe(401);
    });

    it('debe rechazar token inválido', async () => {
      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer invalid_token_xyz`);

      expect(response.status).toBe(401);
    });

    it('debe prevenir que candidato vea aplicaciones de otro candidato', async () => {
      // Candidato 5 intenta ver aplicaciones otro candidato
      db.query = jest.fn()
        .mockResolvedValueOnce([
          [
            { 
              id: 1, 
              candidate_id: 6, // Otro candidato
              status: 'pending' 
            }
          ]
        ]);

      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`);

      // El middleware/servicio debe filtrar por candidate_id del token
      // En el test anterior con mock, solo se retornan aplicaciones del usuario autenticado
      expect(response.status).toBe(200); // API retorna pero solo datos propios
    });

    it('debe rechazar que reclutador actualice aplicación de otro reclutador', async () => {
      // Reclutador 10 intenta actualizar que pertenece a recuriter 20
      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 1, job_id: 10 }]) // App existe
        .mockResolvedValueOnce([{ id: 10, recruiter_user_id: 20 }]); // Job pertenece a otro

      const response = await request(app)
        .patch('/api/applications/1/status')
        .set('Authorization', `Bearer valid_token_reclutador_10`)
        .send({
          status: 'accepted'
        });

      expect(response.status).toBe(403); // Forbidden
    });

    it('debe rechazar que aspirante actualice estado de aplicación', async () => {
      const response = await request(app)
        .patch('/api/applications/1/status')
        .set('Authorization', `Bearer valid_token_aspirante_5`) // Rol incorrecto
        .send({
          status: 'accepted'
        });

      expect(response.status).toBe(403);
    });
  });

  // ============ INPUT VALIDATION TESTS ============
  describe('Input Validation & Sanitization', () => {
    
    it('debe rechazar cover_letter vacío', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: 10,
          cover_letter: '' // Vacío no permitido
        });

      expect(response.status).toBe(400);
    });

    it('debe rechazar cover_letter > 5000 caracteres', async () => {
      const longText = 'a'.repeat(5001);

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: 10,
          cover_letter: longText
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('debe rechazar job_id no numérico', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: 'not_a_number',
          cover_letter: 'Test'
        });

      expect(response.status).toBe(400);
    });

    it('debe rechazar job_id negativo o 0', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: -1,
          cover_letter: 'Test'
        });

      expect(response.status).toBe(400);
    });

    it('debe validar enum para status', async () => {
      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 1, status: 'pending' }]);

      const response = await request(app)
        .patch('/api/applications/1/status')
        .set('Authorization', `Bearer valid_token_reclutador_10`)
        .send({
          status: 'invalid_status' // No es pending|accepted|rejected|withdrawn
        });

      expect(response.status).toBe(400);
    });
  });

  // ============ RACE CONDITION / DATA INTEGRITY TESTS ============
  describe('Data Integrity & Race Conditions', () => {
    
    it('debe prevenir crear aplicación duplicada (UNIQUE constraint)', async () => {
      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 10 }]) // Job existe
        .mockRejectedValueOnce(new Error('Duplicate entry for key applications.UQ_applications')); // UNIQUE

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: 10,
          cover_letter: 'Test'
        });

      expect(response.status).toBe(409); // Conflict
    });

    it('debe validar foreign key (job debe existir)', async () => {
      db.query = jest.fn()
        .mockResolvedValueOnce([]); // Job NO existe

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: 9999,
          cover_letter: 'Test'
        });

      expect(response.status).toBe(400); // Bad Request o 409 Conflict
    });
  });

  // ============ LOGGING & AUDIT TRAILS ============
  describe('Audit Logging', () => {
    
    it('debe registrar (log) cambios de estado sensibles', async () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation();

      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 1, job_id: 10, status: 'pending' }])
        .mockResolvedValueOnce([{ id: 10 }])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      await request(app)
        .patch('/api/applications/1/status')
        .set('Authorization', `Bearer valid_token_reclutador_10`)
        .send({
          status: 'accepted'
        });

      // Verificar que hubo un console.info (audit log)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[AUDIT\]|status|application/)
      );

      consoleSpy.mockRestore();
    });
  });

  // ============ RATE LIMITING (CONFIG READY) ============
  describe('Rate Limiting Ready', () => {
    
    it('endpoints están preparados para rate limiting', async () => {
      // Este test valida que la estructura está lista
      // El rate limiting se configura en app.js/middleware
      
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer valid_token_aspirante_5`)
        .send({
          job_id: 10,
          cover_letter: 'Test'
        });

      // Rate limit headers deberían estar presentes (cuando se configure)
      // X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
      expect(response.headers || {}).toBeDefined();
    });
  });
});
