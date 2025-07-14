const API_URL = 'http://localhost:3001/canchas';

const canchaService = {
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

  //  RF1.3 - Filtrar canchas
  async filtrarCanchas(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}?${query}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al filtrar canchas.');
  },

  //  RF1.2 - Obtener reservas de una cancha (calendario)
  async obtenerReservas(canchaId) {
    const res = await fetch(`${API_URL}/${canchaId}/reservas`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al obtener reservas de la cancha.');
  },

  //  RF1.5 - Crear cancha (admin)
  async crearCancha(data) {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res, 'Error al crear cancha.');
  },

  //  RF1.5 - Actualizar cancha (admin)
  async actualizarCancha(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res, 'Error al actualizar cancha.');
  },

  // RF1.5 - Eliminar cancha (admin)
  async eliminarCancha(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al eliminar cancha.');
  },

  // RF1.5 - Obtener detalles de cancha
  async obtenerCancha(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al obtener cancha.');
  },

  // RF1.5 - Subir imagen de una cancha
  async subirImagenCancha(id, file) {
    const formData = new FormData();
    formData.append('imagen', file);

    const res = await fetch(`${API_URL}/${id}/imagen`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      },
      body: formData
    });

    return this.handleResponse(res, 'Error al subir la imagen de la cancha.');
  }
};

export default canchaService;
