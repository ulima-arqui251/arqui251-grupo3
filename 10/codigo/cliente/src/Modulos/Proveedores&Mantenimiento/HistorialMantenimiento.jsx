import React, { useState } from 'react';
import providerService from './providerService';

const HistorialMantenimiento = () => {
  const [canchaId, setCanchaId] = useState('');
  const [historial, setHistorial] = useState([]);

  const handleBuscar = async () => {
    try {
      const res = await providerService.obtenerHistorial(canchaId);
      setHistorial(res.data);
    } catch (error) {
      alert('Error al obtener historial');
    }
  };

  return (
    <div className="tabla-contenedor"_>
      <h2>Historial de Mantenimiento</h2>
      <input
        placeholder="ID Cancha"
        value={canchaId}
        onChange={e => setCanchaId(e.target.value)}
      />
      <button onClick={handleBuscar}>Buscar</button>

      <ul>
        {historial.length === 0 && <li>No hay registros</li>}
        {historial.map(h => (
          <li key={h.id}>
            🗓 {new Date(h.fecha).toLocaleDateString()} - 🛠 {h.detalle} <br />
            👷 Proveedor: {h.proveedor?.nombre || `#${h.proveedorId}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialMantenimiento;
