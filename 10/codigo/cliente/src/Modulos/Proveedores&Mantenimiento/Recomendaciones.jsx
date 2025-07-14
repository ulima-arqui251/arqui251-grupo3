import React, { useState, useEffect } from 'react';
import providerService from './providerService';

const Recomendaciones = () => {
  const [especialidad, setEspecialidad] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [comentariosVisibles, setComentariosVisibles] = useState({});
  const [especialidades, setEspecialidades] = useState([]);

  // Cargar especialidades disponibles al montar
  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const res = await providerService.obtenerEspecialidades();
        setEspecialidades(res.data || []);
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
      }
    };

    cargarEspecialidades();
  }, []);

  const buscar = async () => {
    try {
      const res = await providerService.obtenerRecomendaciones(especialidad);
      setProveedores(res.data || []);
      setComentariosVisibles({});
    } catch (error) {
      console.error(error);
      alert('Error al obtener recomendaciones');
    }
  };

  const toggleComentarios = async (proveedorId) => {
    const yaVisibles = comentariosVisibles[proveedorId];

    if (yaVisibles) {
      setComentariosVisibles(prev => ({
        ...prev,
        [proveedorId]: null
      }));
    } else {
      try {
        const res = await providerService.obtenerComentarios(proveedorId);
        setComentariosVisibles(prev => ({
          ...prev,
          [proveedorId]: res.data || []
        }));
      } catch (error) {
        console.error(error);
        alert('Error al obtener comentarios');
      }
    }
  };

  return (
    <div>
      <select
        value={especialidad}
        onChange={(e) => setEspecialidad(e.target.value)}
      >
        <option value="">Selecciona una especialidad</option>
        {especialidades.map((esp, i) => (
          <option key={i} value={esp}>
            {esp}
          </option>
        ))}
      </select>

      <button onClick={buscar} disabled={!especialidad}>Buscar</button>

      <ul>
        {proveedores.map(p => {
          const promedio = typeof p.calificacionPromedio === 'number'
            ? p.calificacionPromedio.toFixed(1)
            : 'N/A';

          return (
            <li key={p.id}>
              <strong>{p.nombre}</strong> - {p.especialidad} - ⭐ {promedio}
              <button onClick={() => toggleComentarios(p.id)}>
                {comentariosVisibles[p.id] ? 'Ocultar comentarios' : 'Ver comentarios'}
              </button>

              {comentariosVisibles[p.id] && (
                <ul>
                  {comentariosVisibles[p.id].length > 0 ? (
                    comentariosVisibles[p.id].map((c, index) => (
                      <li key={index}> {c.comentario} - ⭐ {c.puntuacion}</li>
                    ))
                  ) : (
                    <li>No hay comentarios</li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Recomendaciones;
