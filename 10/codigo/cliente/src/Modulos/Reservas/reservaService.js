const API_URL = 'http://localhost:3001/reservas';

const reservaService = {
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

  // RF1.4 - Crear reserva
  async crearReserva(data) {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res, 'Error al crear reserva.');
  },

  // RF1.6 - Cambiar estado (aprobar/cancelar)
  async cambiarEstado(id, estado) {
    const res = await fetch(`${API_URL}/${id}/estado`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ estado }),
    });
    return this.handleResponse(res, 'Error al cambiar estado de reserva.');
  },

  // RF1.7 - Obtener reserva por ID
  async obtenerReserva(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al obtener reserva.');
  },

  // Historial de reservas del usuario
  async obtenerMisReservas() {
    const res = await fetch(`${API_URL}/usuario/reservas`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res, 'Error al obtener tus reservas');
  }
};

export default reservaService;
