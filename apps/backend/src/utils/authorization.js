/**
 * Authorization Helper Functions
 * Proporciona validación de propiedad de recursos
 * Implementa "Defense in Depth": validación en middleware + servicio + BD
 */

const db = require('../config/db');
const AppError = require('./errors');

/**
 * Valida que el usuario sea propietario de una aplicación
 * @param {number} applicationId - ID de la aplicación
 * @param {number} userId - ID del usuario autenticado
 * @param {string} userRole - Rol del usuario (aspirante, reclutador, admin)
 * @returns {Promise<Object>} Aplicación si es válida, lanza error si no
 * @throws {AppError} 403 si no es propietario
 */
async function validateApplicationOwnership(applicationId, userId, userRole) {
  try {
    const [applications] = await db.query(
      `SELECT a.id, a.candidate_id, a.job_id, jp.recruiter_user_id
       FROM applications a
       JOIN job_posts jp ON a.job_id = jp.id
       WHERE a.id = ?`,
      [applicationId]
    );

    if (applications.length === 0) {
      throw new AppError('Application not found', 404);
    }

    const application = applications[0];

    // Lógica de autorización según el rol
    if (userRole === 'aspirante') {
      // Solo el candidato que creó la aplicación puede verla/modificarla
      if (application.candidate_id !== userId) {
        console.warn(
          `[SECURITY] Unauthorized application access: user_id=${userId} attempted to access app_id=${applicationId} owned by candidate=${application.candidate_id}`
        );
        throw new AppError('You do not have permission to access this application', 403);
      }
    } else if (userRole === 'reclutador') {
      // Solo el reclutador propietario del job puede verla/modificarla
      if (application.recruiter_user_id !== userId) {
        console.warn(
          `[SECURITY] Unauthorized application access: recruiter_id=${userId} attempted to access job=${application.job_id} owned by recruiter=${application.recruiter_user_id}`
        );
        throw new AppError('You do not have permission to access applications for this job', 403);
      }
    }
    // admin puede acceder a todo

    return application;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Authorization check failed:', error);
    throw new AppError('Authorization check failed', 500);
  }
}

/**
 * Valida que el usuario sea propietario de un job
 * @param {number} jobId - ID del job
 * @param {number} recruiterId - ID del reclutador
 * @returns {Promise<Object>} Job si es válido
 * @throws {AppError} 403 si no es propietario
 */
async function validateJobOwnership(jobId, recruiterId) {
  try {
    const [jobs] = await db.query(
      `SELECT id, recruiter_user_id, title FROM job_posts WHERE id = ?`,
      [jobId]
    );

    if (jobs.length === 0) {
      throw new AppError('Job post not found', 404);
    }

    const job = jobs[0];

    if (job.recruiter_user_id !== recruiterId) {
      console.warn(
        `[SECURITY] Unauthorized job access: recruiter_id=${recruiterId} attempted to access job_id=${jobId} owned by recruiter=${job.recruiter_user_id}`
      );
      throw new AppError('You do not have permission to modify this job post', 403);
    }

    return job;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Job ownership validation failed:', error);
    throw new AppError('Job ownership validation failed', 500);
  }
}

/**
 * Valida que el usuario sea propietario de un perfil de empresa
 * @param {number} companyProfileId - ID del perfil de empresa
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Perfil si es válido
 * @throws {AppError} 403 si no es propietario
 */
async function validateCompanyOwnership(companyProfileId, userId) {
  try {
    const [profiles] = await db.query(
      `SELECT id, user_id, company_name FROM company_profiles WHERE id = ?`,
      [companyProfileId]
    );

    if (profiles.length === 0) {
      throw new AppError('Company profile not found', 404);
    }

    const profile = profiles[0];

    if (profile.user_id !== userId) {
      console.warn(
        `[SECURITY] Unauthorized company profile access: user_id=${userId} attempted to access profile_id=${companyProfileId} owned by user=${profile.user_id}`
      );
      throw new AppError('You do not have permission to modify this company profile', 403);
    }

    return profile;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Company ownership validation failed:', error);
    throw new AppError('Company ownership validation failed', 500);
  }
}

/**
 * Valida que el usuario sea propietario de un mensaje o conversación
 * @param {number} messageId - ID del mensaje
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Mensaje si es válido
 * @throws {AppError} 403 si no es propietario
 */
async function validateMessageOwnership(messageId, userId) {
  try {
    const [messages] = await db.query(
      `SELECT id, sender_id, recipient_id FROM messages WHERE id = ?`,
      [messageId]
    );

    if (messages.length === 0) {
      throw new AppError('Message not found', 404);
    }

    const message = messages[0];

    // Solo el remitente o destinatario puede acceder
    if (message.sender_id !== userId && message.recipient_id !== userId) {
      console.warn(
        `[SECURITY] Unauthorized message access: user_id=${userId} attempted to access message_id=${messageId}`
      );
      throw new AppError('You do not have permission to access this message', 403);
    }

    return message;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Message ownership validation failed:', error);
    throw new AppError('Message ownership validation failed', 500);
  }
}

/**
 * Valida que el usuario sea participante en una conversación
 * @param {number} userId1 - Usuario A de la conversación
 * @param {number} userId2 - Usuario B de la conversación
 * @param {number} requestingUserId - Usuario que solicita
 * @throws {AppError} 403 si no es participante
 */
async function validateThreadParticipant(userId1, userId2, requestingUserId) {
  if (requestingUserId !== userId1 && requestingUserId !== userId2) {
    console.warn(
      `[SECURITY] Unauthorized thread access: user_id=${requestingUserId} attempted to access thread between ${userId1} and ${userId2}`
    );
    throw new AppError('You do not have permission to access this conversation', 403);
  }
}

/**
 * Valida que un recurso esté activo (no eliminado suavemente)
 * @param {string} tableName - Nombre de la tabla
 * @param {number} resourceId - ID del recurso
 * @returns {Promise<boolean>} true si está activo
 * @throws {AppError} 404 si no está activo
 */
async function validateResourceActive(tableName, resourceId) {
  try {
    const query = `SELECT id, is_active FROM ?? WHERE id = ?`;
    const [resources] = await db.query(query, [tableName, resourceId]);

    if (resources.length === 0 || !resources[0].is_active) {
      throw new AppError(`${tableName} not found or has been deleted`, 404);
    }

    return true;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Resource active validation failed:', error);
    throw new AppError('Resource validation failed', 500);
  }
}

/**
 * Obtiene el perfil de empresa del usuario autenticado
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Perfil de empresa si existe
 * @throws {AppError} 404 si no existe perfil
 */
async function getUserCompanyProfile(userId) {
  try {
    const [profiles] = await db.query(
      `SELECT id, user_id, company_name, description, website, phone, verified, created_at
       FROM company_profiles
       WHERE user_id = ? AND is_active = 1
       LIMIT 1`,
      [userId]
    );

    if (profiles.length === 0) {
      throw new AppError('Company profile not found', 404);
    }

    return profiles[0];
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Get user company profile failed:', error);
    throw new AppError('Failed to retrieve company profile', 500);
  }
}

/**
 * Valida que un candidato solo pueda ver sus propias aplicaciones
 * @param {number} candidateId - ID del candidato desde token
 * @param {number} requestedCandidateId - ID del candidato solicitado (query param)
 * @throws {AppError} 403 si intenta ver otro
 */
function validateCandidateFilter(candidateId, requestedCandidateId) {
  if (requestedCandidateId && requestedCandidateId !== candidateId) {
    console.warn(
      `[SECURITY] Attempt to access other candidate's data: user_id=${candidateId} requested data for=${requestedCandidateId}`
    );
    throw new AppError('You can only view your own applications', 403);
  }
}

module.exports = {
  validateApplicationOwnership,
  validateJobOwnership,
  validateCompanyOwnership,
  validateMessageOwnership,
  validateThreadParticipant,
  validateResourceActive,
  getUserCompanyProfile,
  validateCandidateFilter,
};
