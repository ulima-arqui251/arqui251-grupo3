const API_URL = 'http://localhost:3001/polideportivos';

const polideportivoService = {
  getToken() {
    return localStorage.getItem('token');
  },

  getHeaders(json = true) {
    const token = this.getToken();
    return {
      ...(json && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  async handleResponse(res, defaultMessage) {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: defaultMessage }));
      throw new Error(error.message || defaultMessage);
    }
    return res.json();
  },

  // Obtener todos los polideportivos (sin filtros)
  async obtenerTodos() {
    const res = await fetch(`${API_URL}/todo`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al obtener los polideportivos.');
  },

  // Obtener polideportivos con filtros
  async filtrar(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}?${query}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al filtrar los polideportivos.');
  },

  // Crear un nuevo polideportivo
  async crearPolideportivo(data) {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res, 'Error al crear el polideportivo.');
  },

  // Obtener un polideportivo específico
  async obtenerPorId(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al obtener el polideportivo.');
  },

  // Actualizar polideportivo
  async actualizar(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res, 'Error al actualizar el polideportivo.');
  },

  // Eliminar polideportivo
  async eliminar(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al eliminar el polideportivo.');
  },
  // Subir imagen de un polideportivo
async subirImagenPolideportivo(id, file) {
  const formData = new FormData();
  formData.append('imagen', file);

  const res = await fetch(`${API_URL}/${id}/imagen`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${this.getToken()}`
    },
    body: formData
  });

  return this.handleResponse(res, 'Error al subir la imagen del polideportivo.');
},
};


export default polideportivoService;
