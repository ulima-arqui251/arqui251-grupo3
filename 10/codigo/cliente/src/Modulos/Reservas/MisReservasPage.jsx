import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservaService from '../Reservas/reservaService';

export default function MisReservasPage() {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const data = await reservaService.obtenerMisReservas();
        setReservas(data);
      } catch (err) {
        alert('Error cargando tus reservas: ' + err.message);
      }
    };

    cargarReservas();
  }, []);

  return (
    <div className="container">
      <h2>Mis Reservas</h2>

      {reservas.length === 0 && <p>No tienes reservas registradas.</p>}

      {reservas.map((r) => (
        <div key={r.id} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
          <p><strong>Cancha ID:</strong> {r.canchaId}</p>
          <p><strong>Fecha:</strong> {r.fecha}</p>
          <p><strong>Hora:</strong> {r.horaInicio} - {r.horaFin}</p>
          <p><strong>Estado:</strong> {r.estado}</p>
          <p><strong>Precio:</strong> S/ {r.precioTotal}</p>
          <p><strong>Pago:</strong> {r.estado === 'pagado' ? '✅ Pagado' : '❌ Pendiente'}</p>

          {r.estado === 'pagado' ? (
            <button onClick={() => navigate(`/factura/${r.id}`)}>Ver factura</button>
          ) : (
            <button onClick={() => navigate(`/pago/${r.id}`)}>Pagar ahora</button>
          )}
        </div>
      ))}
    </div>
  );
}
