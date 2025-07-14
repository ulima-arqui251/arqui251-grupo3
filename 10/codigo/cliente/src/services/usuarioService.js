const API_URL = 'http://localhost:3001/usuarios';

const usuarioService = {
  // ✅ Obtener token desde localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // ✅ Obtener encabezados con Authorization
  getHeaders(json = true) {
    const token = this.getToken();
    return {
      ...(json && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  // ✅ Manejar respuestas
  async handleResponse(res, defaultMessage) {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: defaultMessage }));
      throw new Error(error.error || error.message || defaultMessage);
    }
    return res.json();
  },

  // ✅ Login
  async login({ correo, password, captchaToken }) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password, captchaToken }),
    });
    const data = await this.handleResponse(res, 'Error al iniciar sesión.');

    // Guardar token y usuario en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  // ✅ Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // ✅ Registro usuario normal
  async registrarUsuario(data) {
    const res = await fetch(`${API_URL}/register/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(res, 'Error al registrar usuario.');
  },

  // ✅ Registro entidad
  async registrarEntidad(data) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(res, 'Error al registrar entidad.');
  },

  // ✅ Obtener perfil
  async obtenerPerfil() {
    const res = await fetch(`${API_URL}/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al obtener perfil.');
  },

  // ✅ Actualizar perfil
  async actualizarPerfil(data) {
    const res = await fetch(`${API_URL}/me`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res, 'Error al actualizar perfil.');
  },

  // ✅ Subir avatar
  async subirAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${API_URL}/me/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: formData,
    });
    return this.handleResponse(res, 'Error al subir avatar.');
  },

  // ✅ Obtener historial con fallback
  async obtenerHistorial() {
    const res = await fetch(`${API_URL}/me/history`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al obtener historial.');
  },
  // ✅ Registro Admin
async registrarAdmin(data) {
  const res = await fetch(`${API_URL}/register/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return this.handleResponse(res, 'Error al registrar administrador.');
}
};

export default usuarioService;
