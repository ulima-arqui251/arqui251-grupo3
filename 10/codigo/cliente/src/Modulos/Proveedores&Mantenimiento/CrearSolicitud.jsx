import React, { useState } from 'react';
import providerService from './providerService';

const CrearSolicitud = () => {
  const [form, setForm] = useState({
    descripcion: '',
    canchaId: '',
    fecha: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await providerService.crearSolicitud(form);
      alert('Solicitud creada');
    } catch (error) {
      alert('Error al crear solicitud');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
      <input placeholder="ID Cancha" value={form.canchaId} onChange={e => setForm({...form, canchaId: e.target.value})} />
      <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
      <button type="submit">Crear</button>
    </form>
  );
};

export default CrearSolicitud;
