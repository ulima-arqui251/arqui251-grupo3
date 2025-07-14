import React, { useState } from 'react';
import polideportivoService from '../Reservas/polideportivoService';

export default function CrearPolideportivo() {
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ubicacionLat: '',
    ubicacionLng: '',
    tipo: ''
  });

  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImagenChange = e => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMensaje('');

    const { nombre, direccion, tipo } = form;
    if (!nombre || !direccion || !tipo) {
      setError('Los campos nombre, dirección y tipo son obligatorios.');
      return;
    }

    try {
      // 1. Crear el polideportivo sin imagen
      const nuevo = await polideportivoService.crearPolideportivo(form);

      // 2. Subir la imagen si se seleccionó una
      if (imagen) {
        await polideportivoService.subirImagenPolideportivo(nuevo.id, imagen);
      }

      setMensaje('Polideportivo creado exitosamente.');
      setForm({
        nombre: '',
        direccion: '',
        ubicacionLat: '',
        ubicacionLng: '',
        tipo: ''
      });
      setImagen(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Crear Polideportivo</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <input
          name="ubicacionLat"
          placeholder="Latitud"
          value={form.ubicacionLat}
          onChange={handleChange}
          type="number"
          step="any"
        />
        <input
          name="ubicacionLng"
          placeholder="Longitud"
          value={form.ubicacionLng}
          onChange={handleChange}
          type="number"
          step="any"
        />
        <input
          name="tipo"
          placeholder="Tipo (ej. fútbol, vóley)"
          value={form.tipo}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
        />

        <button type="submit">Crear Polideportivo</button>
      </form>
    </div>
  );
}
