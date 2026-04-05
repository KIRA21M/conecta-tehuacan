const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// ─── Sesión ───────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: number;
  full_name: string;
  email: string;
  role: 'aspirante' | 'reclutador' | 'admin';
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

export const sessionStorage = {
  save(session: Session) {
    localStorage.setItem('session', JSON.stringify(session));
  },
  get(): Session | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  clear() {
    localStorage.removeItem('session');
    localStorage.removeItem('token'); // legacy
    localStorage.removeItem('user'); // legacy
  },
};

// ─── Cliente HTTP con renovación automática de token ─────────────────────────

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const session = sessionStorage.get();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Token expirado → intentar renovar con refreshToken
  if (res.status === 401 && session?.refreshToken) {
    const renewed = await tryRefresh(session.refreshToken);
    if (renewed) {
      headers['Authorization'] = `Bearer ${renewed.accessToken}`;
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    } else {
      // Refresh inválido → cerrar sesión
      sessionStorage.clear();
    }
  }

  return res;
}

async function tryRefresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const { data } = await res.json();

    // Actualizar sesión con nuevos tokens
    const current = sessionStorage.get();
    if (current) {
      sessionStorage.save({ ...current, accessToken: data.accessToken, refreshToken: data.refreshToken });
    }

    return data;
  } catch {
    return null;
  }
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authAPI = {
  register: async (data: {
    nombre: string;
    email: string;
    password: string;
    confirmPassword: string;
    rol: string;
  }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: data.nombre,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        role: data.rol,
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error en registro');
    }
    return res.json();
  },

  login: async (email: string, password: string): Promise<Session> => {
    // Determinar endpoint según rol — primero aspirante, luego admin/reclutador
    const endpoints = ['/auth/login', '/auth/login/admin'];

    for (const endpoint of endpoints) {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { data } = await res.json();
        const session: Session = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        };
        sessionStorage.save(session);
        return session;
      }

      // Si es 403 (cuenta no verificada) lanzar inmediatamente sin reintentar
      if (res.status === 403) {
        const error = await res.json();
        throw new Error(error.message || 'Cuenta no verificada');
      }
    }

    throw new Error('Credenciales inválidas');
  },

  logout: async () => {
    const session = sessionStorage.get();
    if (session?.refreshToken) {
      // Revocar refresh token en el servidor (best-effort)
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      }).catch(() => {});
    }
    sessionStorage.clear();
  },

  refresh: async (): Promise<Session | null> => {
    const session = sessionStorage.get();
    if (!session?.refreshToken) return null;

    const renewed = await tryRefresh(session.refreshToken);
    if (!renewed) {
      sessionStorage.clear();
      return null;
    }

    const updatedSession = { ...session, accessToken: renewed.accessToken, refreshToken: renewed.refreshToken };
    sessionStorage.save(updatedSession);
    return updatedSession;
  },

  getSession: (): Session | null => sessionStorage.get(),

  isAuthenticated: (): boolean => !!sessionStorage.get()?.accessToken,

  hasRole: (...roles: SessionUser['role'][]): boolean => {
    const session = sessionStorage.get();
    return !!session && roles.includes(session.user.role);
  },

  forgotPassword: async (email: string) => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al enviar correo de recuperación');
    }
    return res.json();
  },

  resetPassword: async (token: string, newPassword: string) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
    return res.json();
  },
};

// ─── Jobs API ─────────────────────────────────────────────────────────────────

export const jobsAPI = {
  list: async (params?: Record<string, string | number>) => {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    const res = await apiFetch(`/jobs${qs}`);
    if (!res.ok) throw new Error('Error al obtener vacantes');
    return res.json();
  },

  getById: async (id: number) => {
    const res = await apiFetch(`/jobs/${id}`);
    if (!res.ok) throw new Error('Vacante no encontrada');
    return res.json();
  },

  create: async (data: Record<string, unknown>) => {
    const res = await apiFetch('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al crear vacante');
    }
    return res.json();
  },

  update: async (id: number, data: Record<string, unknown>) => {
    const res = await apiFetch(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al actualizar vacante');
    }
    return res.json();
  },

  setStatus: async (id: number, is_active: boolean) => {
    const res = await apiFetch(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active }),
    });
    if (!res.ok) throw new Error('Error al cambiar estado');
    return res.json();
  },
};
