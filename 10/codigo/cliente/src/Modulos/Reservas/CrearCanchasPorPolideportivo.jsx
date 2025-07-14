import React, { useEffect, useState } from 'react';
import polideportivoService from '../Reservas/polideportivoService';
import canchaService from '../Reservas/canchaService';

export default function CrearCanchasPorPolideportivo() {
  const [polideportivos, setPolideportivos] = useState([]);
  const [polideportivoId, setPolideportivoId] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    precio: '',
    techado: false,
    iluminacion: false,
    estado: 'disponible'
  });
  const [imagen, setImagen] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Cargar polideportivos al inicio
  useEffect(() => {
    const fetchPolideportivos = async () => {
      try {
        const data = await polideportivoService.obtenerTodos();
        setPolideportivos(data);
      } catch (err) {
        setError('Error al cargar polideportivos');
      }
    };
    fetchPolideportivos();
  }, []);

  // Cargar canchas asociadas al polideportivo
  useEffect(() => {
    const fetchCanchas = async () => {
      if (!polideportivoId) return;
      try {
        const data = await canchaService.filtrarCanchas({ polideportivoId });
        setCanchas(data);
      } catch (err) {
        setError('Error al cargar canchas');
      }
    };
    fetchCanchas();
  }, [polideportivoId]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImagenChange = e => {
    setImagen(e.target.files[0]);
  };

  const crearCancha = async e => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!polideportivoId) {
      setError('Selecciona un polideportivo.');
      return;
    }

    if (!form.nombre || !form.tipo) {
      setError('Nombre y tipo son obligatorios.');
      return;
    }

    try {
      const nueva = await canchaService.crearCancha({
        ...form,
        polideportivoId
      });

      if (imagen) {
        await canchaService.subirImagenCancha(nueva.id, imagen);
      }

      setMensaje('Cancha creada correctamente.');
      setForm({
        nombre: '',
        tipo: '',
        precio: '',
        techado: false,
        iluminacion: false,
        estado: 'disponible'
      });
      setImagen(null);

      const nuevasCanchas = await canchaService.filtrarCanchas({ polideportivoId });
      setCanchas(nuevasCanchas);
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarCancha = async id => {
    try {
      await canchaService.eliminarCancha(id);
      const nuevas = await canchaService.filtrarCanchas({ polideportivoId });
      setCanchas(nuevas);
    } catch (err) {
      setError('Error al eliminar cancha');
    }
  };

  return (
    <div className="container">
      <h2>Crear Canchas por Polideportivo</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      <label>Seleccionar Polideportivo:</label>
      <select value={polideportivoId} onChange={e => setPolideportivoId(e.target.value)}>
        <option value="">-- Seleccionar --</option>
        {polideportivos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      {polideportivoId && (
        <>
          <h3>Nueva Cancha</h3>
          <form onSubmit={crearCancha}>
            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
            />
            <input
              name="tipo"
              placeholder="Tipo (ej. fútbol)"
              value={form.tipo}
              onChange={handleChange}
            />
            <input
              name="precio"
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
              step="any"
            />
            <label>
              <input
                type="checkbox"
                name="techado"
                checked={form.techado}
                onChange={handleChange}
              /> Techado
            </label>
            <label>
              <input
                type="checkbox"
                name="iluminacion"
                checked={form.iluminacion}
                onChange={handleChange}
              /> Iluminación
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
            />
            <button type="submit">Crear Cancha</button>
          </form>

          <h3>Canchas del Polideportivo</h3>
          {canchas.length === 0 && <p>No hay canchas registradas.</p>}
          {canchas.map(c => (
            <div key={c.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>{c.nombre}</strong> - {c.tipo} - S/ {c.precio}</p>
              {c.imagen && (
                <img src={`http://localhost:3001/${c.imagen}`} alt="cancha" style={{ width: '100px' }} />
              )}
              <button onClick={() => eliminarCancha(c.id)}>Eliminar</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
