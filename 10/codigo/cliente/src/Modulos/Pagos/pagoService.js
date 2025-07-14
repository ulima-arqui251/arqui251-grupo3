// src/services/pagoService.js
const API_URL = 'http://localhost:3001/pagos';

const pagoService = {
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

  // RF-PAGOS.1 - Registrar pago
  async registrarPago({ reservaId, monto, metodo, referencia }) {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reservaId, monto, metodo, referencia }),
    });

    return this.handleResponse(res, 'Error al registrar el pago.');
  }
};

export default pagoService;
