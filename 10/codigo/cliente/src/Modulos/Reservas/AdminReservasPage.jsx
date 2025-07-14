import React, { useEffect, useState } from 'react';
import reservaService from '../Reservas/reservaService';

export default function AdminReservasPage() {
  const [reservas, setReservas] = useState([]);

  const loadReservas = async () => {
    const res = await fetch('http://localhost:3001/api/reservas', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setReservas(data);
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const cambiarEstado = async (id, estado) => {
    await reservaService.cambiarEstado(id, estado);
    loadReservas();
  };

  return (
    <div className="container">
      <h2>Administrar Reservas</h2>
      {reservas.map(r => (
        <div key={r.id} style={{ border: '1px solid gray', padding: '10px' }}>
          <p>ID: {r.id}</p>
          <p>Usuario: {r.usuarioId}</p>
          <p>Cancha: {r.canchaId}</p>
          <p>Fecha: {r.fecha}</p>
          <p>Estado: {r.estado}</p>
          <button onClick={() => cambiarEstado(r.id, 'aprobada')}>Aprobar</button>
          <button onClick={() => cambiarEstado(r.id, 'cancelada')}>Cancelar</button>
        </div>
      ))}
    </div>
  );
}
