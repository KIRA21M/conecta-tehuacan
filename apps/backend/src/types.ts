/**
 * TypeScript Interfaces and Types for Conecta Tehuacán Backend
 * ============================================================
 * Centralized type definitions for Applications, Messages, and Company Profiles
 */

// ============================================================================
// APPLICATIONS & CANDIDATURES
// ============================================================================

export interface IApplication {
  id: number;
  job_id: number;
  candidate_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  cover_letter?: string;
  reviewed_by?: number;
  reviewed_at?: string | Date;
  rejection_reason?: string;
  created_at: string | Date;
  updated_at: string | Date;
  is_active: number | boolean;
}

export interface IApplicationCreate {
  job_id: number;
  cover_letter?: string;
}

export interface IApplicationUpdate {
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  rejection_reason?: string;
}

export interface IApplicationFilter {
  job_id?: number;
  candidate_id?: number;
  status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  reviewed_by?: number;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'updated_at' | 'status';
  sort_order?: 'ASC' | 'DESC';
}

export interface IApplicationStats {
  job_id: number;
  total_applications: number;
  pending: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  acceptance_rate: number;
}

export interface IApplicationWithJobDetails extends IApplication {
  job_title?: string;
  company_name?: string;
  candidate_name?: string;
  candidate_email?: string;
}

export interface IFavorite {
  id: number;
  job_id: number;
  candidate_id: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface IApplicationNote {
  id: number;
  application_id: number;
  created_by: number;
  note: string;
  created_at: string | Date;
}

// ============================================================================
// MESSAGES & MESSAGING
// ============================================================================

export interface IMessage {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  is_read: number | boolean;
  read_at?: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
  is_deleted: number | boolean;
}

export interface IMessageCreate {
  recipient_id: number;
  content: string;
}

export interface IMessageFilter {
  recipient_id?: number;
  sender_id?: number;
  is_read?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'updated_at';
  sort_order?: 'ASC' | 'DESC';
}

export interface IMessageThread {
  id: number;
  user_id: number;
  other_user_id: number;
  last_message_id?: number;
  last_message_content?: string;
  last_message_at?: string | Date | null;
  unread_count: number;
  updated_at: string | Date;
}

export interface IThreadDetail {
  thread: IMessageThread;
  messages: IMessageWithSenderDetails[];
  other_user: {
    id: number;
    full_name: string;
    email: string;
    role: string;
  };
}

export interface IMessageWithSenderDetails extends IMessage {
  sender_name?: string;
  sender_email?: string;
  recipient_name?: string;
  recipient_email?: string;
}

export interface IMessageAttachment {
  id: number;
  message_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: number;
  created_at: string | Date;
}

export interface IInboxItem {
  other_user_id: number;
  other_user_name: string;
  other_user_email: string;
  last_message: string;
  last_message_at: string | Date;
  unread_count: number;
  last_message_sender_id: number;
}

// ============================================================================
// COMPANY PROFILES
// ============================================================================

export interface ICompanyProfile {
  id: number;
  user_id: number;
  company_name: string;
  description?: string;
  website?: string;
  phone?: string;
  logo_url?: string;
  banner_url?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
  headquarters_location?: string;
  verified: number | boolean;
  verified_at?: string | Date | null;
  verification_document_url?: string;
  total_jobs_posted: number;
  total_applications: number;
  response_rate?: number;
  average_response_time?: number;
  rating?: number;
  created_at: string | Date;
  updated_at: string | Date;
  is_active: number | boolean;
}

export interface ICompanyProfileCreate {
  company_name: string;
  description?: string;
  website?: string;
  phone?: string;
  logo_url?: string;
  banner_url?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
  headquarters_location?: string;
}

export interface ICompanyProfileUpdate {
  company_name?: string;
  description?: string;
  website?: string;
  phone?: string;
  logo_url?: string;
  banner_url?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
  headquarters_location?: string;
}

export interface ICompanyFilter {
  page?: number;
  limit?: number;
  q?: string;
  industry?: string;
  company_size?: string;
  verified?: boolean;
  sort_by?: 'rating' | 'created_at' | 'jobs_posted';
  sort_order?: 'ASC' | 'DESC';
}

export interface ICompanyStats {
  id: number;
  company_profile_id: number;
  active_jobs: number;
  total_views: number;
  total_applications: number;
  accepted_applications: number;
  rejected_applications: number;
  pending_applications: number;
  avg_time_to_hire?: number;
  last_updated: string | Date;
}

export interface ICompanyContact {
  id: number;
  company_profile_id: number;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  position?: string;
  is_primary: number | boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ICompanySocialLink {
  id: number;
  company_profile_id: number;
  platform: string;
  url: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ICompanyProfileWithStats extends ICompanyProfile {
  stats?: ICompanyStats;
  contacts?: ICompanyContact[];
  social_links?: ICompanySocialLink[];
}

// ============================================================================
// PAGINATION & RESPONSE TYPES
// ============================================================================

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface IPaginatedResponse<T> {
  ok: boolean;
  message: string;
  data: T[];
  meta: IPaginationMeta;
}

export interface ISingleResponse<T> {
  ok: boolean;
  message: string;
  data: T;
}

export interface IErrorResponse {
  ok: false;
  message: string;
  errors?: Array<{
    field: string;
    reason: string;
    message: string;
  }>;
}

// ============================================================================
// COMMON REQUEST/RESPONSE TYPES
// ============================================================================

export interface IUserContext {
  id: number;
  email: string;
  full_name: string;
  role: 'aspirante' | 'reclutador' | 'admin';
  is_active: boolean;
  is_verified: boolean;
}

export interface IPermissionContext {
  userId: number;
  role: string;
  permissions: string[];
}

export interface IResourceOwnershipCheck {
  resourceOwnerId: number;
  requestUserId: number;
  resourceType: 'job' | 'application' | 'message' | 'company_profile';
  canModify: boolean;
}

// ============================================================================
// DATABASE QUERY BUILDERS & HELPERS
// ============================================================================

export interface IQueryBuilder {
  table: string;
  conditions: string[];
  parameters: any[];
  limit?: number;
  offset?: number;
  orderBy?: { field: string; order: 'ASC' | 'DESC' }[];
}

export interface ITransactionScope {
  connection: any;
  rollback: () => Promise<void>;
  commit: () => Promise<void>;
}

// ============================================================================
// REQUEST EXTENDED TYPES (for Express middleware)
// ============================================================================

declare global {
  namespace Express {
    interface Request {
      user?: IUserContext;
      permissions?: string[];
      transaction?: ITransactionScope;
    }
  }
}

export { };
