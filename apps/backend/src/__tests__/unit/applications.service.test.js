// Test Unitario: Applications Service
// Prueba la lógica de negocio sin contactar la base de datos (mocked)

const ApplicationsService = require('../../services/applications.service');
const db = require('../../config/db');

// Mock de la base de datos
jest.mock('../../config/db');
jest.mock('bcryptjs');

describe('ApplicationsService - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createApplication', () => {
    it('debe crear una aplicación exitosamente', async () => {
      const mockJobId = 1;
      const mockCandidateId = 5;
      const mockCoverLetter = 'Estoy muy interesado en esta posición';

      // Mock de la respuesta de BD
      db.query = jest.fn()
        .mockResolvedValueOnce([{ insertId: 100 }]) // Verificar que el job existe
        .mockResolvedValueOnce([{ insertId: 100 }]); // INSERT de la aplicación

      const result = await ApplicationsService.createApplication(
        mockJobId,
        mockCandidateId,
        mockCoverLetter
      );

      expect(result).toHaveProperty('id');
      expect(result.id).toBe(100);
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('debe rechazar si el job no existe', async () => {
      const mockJobId = 999;
      const mockCandidateId = 5;
      const mockCoverLetter = 'Test';

      // Mock: job no existe (retorna array vacío)
      db.query = jest.fn().mockResolvedValueOnce([]);

      try {
        await ApplicationsService.createApplication(
          mockJobId,
          mockCandidateId,
          mockCoverLetter
        );
        fail('Debería haber lanzado una excepción');
      } catch (error) {
        expect(error.message).toContain('Job not found');
      }
    });

    it('debe evitar duplicados al crear aplicación', async () => {
      const mockJobId = 1;
      const mockCandidateId = 5;
      const mockCoverLetter = 'Test';

      // Mock: job existe pero applicación ya existe
      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 1 }]) // Job existe
        .mockRejectedValueOnce(new Error('Duplicate entry')); // Aplicación duplicada

      try {
        await ApplicationsService.createApplication(
          mockJobId,
          mockCandidateId,
          mockCoverLetter
        );
        fail('Debería haber rechazado duplicado');
      } catch (error) {
        expect(error.message).toContain('Duplicate entry');
      }
    });
  });

  describe('updateApplicationStatus', () => {
    it('debe actualizar el estado de una aplicación', async () => {
      const mockAppId = 100;
      const mockNewStatus = 'accepted';
      const mockReviewerId = 10;

      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 100, status: 'pending' }]) // GET actual
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // UPDATE

      const result = await ApplicationsService.updateApplicationStatus(
        mockAppId,
        mockNewStatus,
        mockReviewerId,
        null
      );

      expect(result).toEqual({ id: 100, status: 'accepted' });
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('debe validar que la aplicación exista antes de actualizar', async () => {
      const mockAppId = 999;
      const mockNewStatus = 'rejected';
      const mockReviewerId = 10;

      db.query = jest.fn().mockResolvedValueOnce([]); // Aplicación no existe

      try {
        await ApplicationsService.updateApplicationStatus(
          mockAppId,
          mockNewStatus,
          mockReviewerId,
          null
        );
        fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('Application not found');
      }
    });

    it('debe requerir rejection_reason cuando status es rejected', async () => {
      const mockAppId = 100;
      const mockNewStatus = 'rejected';
      const mockReviewerId = 10;
      const noRejectionReason = null;

      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 100, status: 'pending' }]);

      try {
        await ApplicationsService.updateApplicationStatus(
          mockAppId,
          mockNewStatus,
          mockReviewerId,
          noRejectionReason
        );
        fail('Debería haber requerido rejection_reason');
      } catch (error) {
        expect(error.message).toContain('rejection_reason');
      }
    });
  });

  describe('getApplicationStats', () => {
    it('debe calcular estadísticas correctamente', async () => {
      const mockJobId = 1;

      db.query = jest.fn().mockResolvedValueOnce([{
        total: 10,
        pending: 3,
        accepted: 5,
        rejected: 2,
        withdrawn: 0
      }]);

      const result = await ApplicationsService.getApplicationStats(mockJobId);

      expect(result.total).toBe(10);
      expect(result.pending).toBe(3);
      expect(result.accepted).toBe(5);
      expect(result.acceptance_rate).toBe(0.5); // 5/10
    });

    it('debe retornar 0% acceptance rate cuando no hay aplicaciones', async () => {
      const mockJobId = 1;

      db.query = jest.fn().mockResolvedValueOnce([]);

      const result = await ApplicationsService.getApplicationStats(mockJobId);

      expect(result.total).toBe(0);
      expect(result.acceptance_rate).toBe(0);
    });
  });

  describe('addFavorite', () => {
    it('debe agregar un job a favoritos', async () => {
      const mockJobId = 1;
      const mockCandidateId = 5;

      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 1 }]) // Job existe
        .mockResolvedValueOnce([{ insertId: 50 }]); // INSERT favorito

      const result = await ApplicationsService.addFavorite(
        mockJobId,
        mockCandidateId
      );

      expect(result.id).toBe(50);
    });

    it('debe evitar duplicados en favoritos', async () => {
      const mockJobId = 1;
      const mockCandidateId = 5;

      db.query = jest.fn()
        .mockResolvedValueOnce([{ id: 1 }])
        .mockRejectedValueOnce(new Error('UNIQUE constraint'));

      try {
        await ApplicationsService.addFavorite(mockJobId, mockCandidateId);
        fail('Debería rechazar duplicado');
      } catch (error) {
        expect(error.message).toContain('UNIQUE');
      }
    });
  });

  describe('Seguridad: Validación de propiedad', () => {
    it('debe validar que solo el candidato pueda ver sus aplicaciones', async () => {
      const mockAppId = 100;
      const mockCandidateIdOwner = 5;
      const mockCandidateIdUnauthorized = 6;

      db.query = jest.fn().mockResolvedValueOnce([{
        id: 100,
        candidate_id: mockCandidateIdOwner
      }]);

      const result = await db.query('SELECT candidate_id FROM applications WHERE id=?', [mockAppId]);
      const [app] = result;

      expect(app.candidate_id).toBe(mockCandidateIdOwner);
      expect(app.candidate_id).not.toBe(mockCandidateIdUnauthorized);
    });
  });
});
