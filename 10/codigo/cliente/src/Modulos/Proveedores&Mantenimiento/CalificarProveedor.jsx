import React, { useState } from 'react';
import providerService from './providerService';

const CalificarProveedor = () => {
  const [form, setForm] = useState({
    proveedorId: '',
    puntuacion: 5,
    comentario: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await providerService.calificarProveedor(form);
      alert('Proveedor calificado');
    } catch (error) {
      alert('Error al calificar proveedor');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="ID Proveedor"
        value={form.proveedorId}
        onChange={e => setForm({ ...form, proveedorId: e.target.value })}
      />
      <input
        type="number"
        min="1"
        max="5"
        value={form.puntuacion}
        onChange={e => setForm({ ...form, puntuacion: e.target.value })}
      />
      <textarea
        placeholder="Comentario"
        value={form.comentario}
        onChange={e => setForm({ ...form, comentario: e.target.value })}
      />
      <button type="submit">Calificar</button>
    </form>
  );
};

export default CalificarProveedor;
