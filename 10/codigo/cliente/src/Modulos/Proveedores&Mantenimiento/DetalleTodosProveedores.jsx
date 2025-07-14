import React, { useEffect, useState } from 'react';
import gatewayService from '../../services/gatewayService';

const DetalleTodosProveedores = () => {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const data = await gatewayService.obtenerDetallesCompletosProveedores();
        setDetalles(data);
      } catch (error) {
        console.error(' Error al cargar detalles de proveedores:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, []);

  if (loading) return <p>Cargando detalles de proveedores...</p>;
  if (!detalles.length) return <p> No se encontraron proveedores.</p>;

  return (
    <div>
      <h2>Detalle de Proveedores</h2>
      {detalles.map((detalle, index) => (
        <div key={index} style={{ border: '1px solid gray', marginBottom: '1rem', padding: '1rem' }}>
          <h3>{detalle.proveedor.nombre} ({detalle.proveedor.especialidad})</h3>
          <p>{detalle.proveedor.correo}</p>
          <p>{detalle.proveedor.telefono}</p>

          <h4>Calificaciones (Promedio: {detalle.promedio || 'Sin calificaciones'})</h4>
          <ul>
            {detalle.calificaciones.length
              ? detalle.calificaciones.map((c, i) => (
                  <li key={i}> {c.puntuacion} - {c.comentario || 'Sin comentario'}</li>
                ))
              : <li>Sin calificaciones</li>}
          </ul>

          <h4>Solicitudes</h4>
          <ul>
            {detalle.solicitudes.length
              ? detalle.solicitudes.map((s, i) => (
                  <li key={i}>{s.descripcion} - Estado: {s.estado}</li>
                ))
              : <li>Sin solicitudes</li>}
          </ul>

          <h4>Historial de Mantenimiento</h4>
          <ul>
            {detalle.historial.length
              ? detalle.historial.map((h, i) => (
                  <li key={i}>{new Date(h.fecha).toLocaleDateString()} - {h.detalle}</li>
                ))
              : <li>Sin historial</li>}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DetalleTodosProveedores;
