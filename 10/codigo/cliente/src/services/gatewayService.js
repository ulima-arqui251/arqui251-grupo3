const API_URL = 'http://localhost:3001/dashboard';

const gatewayService = {
  getToken() {
    return localStorage.getItem('token');
  },

  getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  // GET /dashboard/proveedores-detalles
  async obtenerDetallesCompletosProveedores() {
    const res = await fetch(`${API_URL}/proveedores-detalles`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Error al obtener detalles de proveedores.');
    }

    return res.json();
  },
};

export default gatewayService;
