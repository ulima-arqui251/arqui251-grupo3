const API_POLIS = 'http://localhost:3001/polideportivos';

const servicioGeneral = {
  async obtenerPolideportivos(filtros = {}) {
    const query = new URLSearchParams(filtros).toString();
    const res = await fetch(`${API_POLIS}?${query}`);
    if (!res.ok) throw new Error('Error al obtener polideportivos');
    return res.json();
  }
};

export default servicioGeneral;
