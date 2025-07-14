import React, { useEffect, useState } from 'react';
import polideportivoService from '../Reservas/polideportivoService';

export default function VerPolideportivos() {
  const [polideportivos, setPolideportivos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', direccion: '', tipo: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPolideportivos();
  }, []);

  const cargarPolideportivos = async () => {
    try {
      const data = await polideportivoService.obtenerTodos();
      setPolideportivos(data);
    } catch (err) {
      setError('Error al cargar polideportivos');
    }
  };

  const handleEditar = (poli) => {
    setEditando(poli.id);
    setForm({
      nombre: poli.nombre,
      direccion: poli.direccion,
      tipo: poli.tipo,
    });
    setMensaje('');
    setError('');
  };

  const handleGuardar = async (id) => {
    try {
      await polideportivoService.actualizar(id, form);
      setEditando(null);
      setMensaje('Polideportivo actualizado correctamente.');
      cargarPolideportivos();
    } catch (err) {
      setError('Error al actualizar polideportivo');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este polideportivo?')) return;
    try {
      await polideportivoService.eliminar(id);
      setMensaje('Polideportivo eliminado.');
      cargarPolideportivos();
    } catch (err) {
      setError('Error al eliminar polideportivo');
    }
  };

  const handleImagen = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await polideportivoService.subirImagenPolideportivo(id, file);
      setMensaje('Imagen actualizada.');
      cargarPolideportivos();
    } catch (err) {
      setError('Error al subir imagen');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h2>Todos los Polideportivos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      {polideportivos.map((poli) => (
        <div key={poli.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <div>
            {poli.imagen && (
              <img
                src={`http://localhost:3001/${poli.imagen}`}
                alt={poli.nombre}
                style={{ width: '150px', height: 'auto', marginBottom: 10 }}
              />
            )}
          </div>

          {editando === poli.id ? (
            <>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
              />
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Dirección"
              />
              <input
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                placeholder="Tipo"
              />
              <button onClick={() => handleGuardar(poli.id)}>Guardar</button>
              <button onClick={() => setEditando(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <p><strong>{poli.nombre}</strong></p>
              <p> {poli.direccion}</p>
              <p>Tipo: {poli.tipo}</p>

              <input type="file" accept="image/*" onChange={(e) => handleImagen(e, poli.id)} />
              <br />
              <button onClick={() => handleEditar(poli)}>Editar</button>
              <button onClick={() => handleEliminar(poli.id)}>Eliminar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
