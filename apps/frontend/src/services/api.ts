const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const authAPI = {
  register: async (data: { nombre: string; email: string; password: string; confirmPassword: string; rol: string }) => {
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

  login: async (email: string, password: string) => {
    // Intentar login como aspirante primero
    let res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    // Si falla, intentar como reclutador/admin
    if (!res.ok) {
      res = await fetch(`${API_URL}/auth/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    }
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error en login');
    }
    return res.json();
  },
};
