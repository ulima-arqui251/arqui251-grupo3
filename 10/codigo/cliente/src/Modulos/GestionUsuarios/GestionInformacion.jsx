import React, { useEffect, useState } from 'react';
import usuarioService from '../../services/usuarioService';

function DashboardUsuario() {
  const [perfil, setPerfil] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [origenHistorial, setOrigenHistorial] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    identidad: '' 
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Cargar perfil e historial al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const perfilData = await usuarioService.obtenerPerfil();
        setPerfil(perfilData);
        setFormData({
          nombre: perfilData.nombre || '',
          apellido: perfilData.apellido || '',
          especialidad: perfilData.especialidad || '',
          identidad: perfilData.identidad || ''
        });

        const historialData = await usuarioService.obtenerHistorial();
        setHistorial(historialData.historial);
        setOrigenHistorial(historialData.origen);
      } catch (err) {
        console.error(err);
        setMensaje(err.message);
      }
    };

    fetchData();
  }, []);

  // Actualizar perfil
  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    try {
      const updated = await usuarioService.actualizarPerfil(formData);
      setPerfil(updated);
      setMensaje('Perfil actualizado correctamente.');
    } catch (err) {
      setMensaje(err.message);
    }
  };

  // Subir avatar
  const handleUploadAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      setMensaje('Selecciona un archivo.');
      return;
    }
    try {
      await usuarioService.subirAvatar(avatarFile);
      setMensaje('Avatar subido correctamente.');
    } catch (err) {
      setMensaje(err.message);
    }
  };

  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Dashboard Usuario</h2>

      {mensaje && <p>{mensaje}</p>}

      <h3>Datos del Perfil</h3>
      <form onSubmit={handleUpdatePerfil}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
          />
        </div>
        <div>
          <label>Especialidad:</label>
          <input
            type="text"
            value={formData.especialidad}
            onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
          />
        </div>
        <div>
          <label>DNI/RUC:</label>
          <input
            type="text"
            value={formData.identidad}
            onChange={(e) => setFormData({ ...formData, identidad: e.target.value })}
          />
        </div>
        <button type="submit">Actualizar Perfil</button>
      </form>

      <h3>Foto de Perfil</h3>
      {perfil.fotoPerfil && (
        <img src={`http://localhost:3001/${perfil.fotoPerfil}`} alt="Avatar" width="120" />
      )}
      <form onSubmit={handleUploadAvatar}>
        <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
        <button type="submit">Subir Avatar</button>
      </form>

      <h3>Historial de Actividad ({origenHistorial})</h3>
      {historial.length === 0 ? (
        <p>No hay registros.</p>
      ) : (
        <ul>
          {historial.map((item) => (
            <li key={item.id}>
              {item.descripcion} - {item.fecha_reserva}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardUsuario;
