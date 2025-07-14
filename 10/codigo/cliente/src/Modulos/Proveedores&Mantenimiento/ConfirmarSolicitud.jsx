import React, { useState } from 'react';
import providerService from './providerService';

const ConfirmarSolicitud = () => {
  const [solicitudId, setSolicitudId] = useState('');
  const [estado, setEstado] = useState('aceptado');

  const handleConfirmar = async () => {
    try {
      await providerService.confirmarSolicitud(solicitudId, estado);
      alert(`Solicitud ${estado}`);
    } catch (error) {
      alert('Error al confirmar/rechazar solicitud');
    }
  };

  return (
    <div>
      <input
        placeholder="ID Solicitud"
        value={solicitudId}
        onChange={e => setSolicitudId(e.target.value)}
      />
      <select value={estado} onChange={e => setEstado(e.target.value)}>
        <option value="aceptado">Aceptar</option>
        <option value="rechazado">Rechazar</option>
      </select>
      <button onClick={handleConfirmar}>Confirmar</button>
    </div>
  );
};

export default ConfirmarSolicitud;
