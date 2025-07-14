import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import reservaService from '../Reservas/reservaService';
import pagoService from './pagoService';

export default function PagarReservaPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [metodo, setMetodo] = useState('tarjeta');
  const [referencia, setReferencia] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await reservaService.obtenerReserva(id);
        setReserva(data);
      } catch (err) {
        alert('Error cargando reserva: ' + err.message);
        navigate('/mis-reservas');
      }
    };
    cargar();
  }, [id]);

  const pagar = async () => {
    try {
      await pagoService.registrarPago({
        reservaId: id,
        monto: reserva.precioTotal,
        metodo,
        referencia
      });

      alert(' Pago realizado correctamente.');
      navigate('/mis-reservas');
    } catch (err) {
      alert('Error al realizar el pago: ' + err.message);
    }
  };

  if (!reserva) return <p>Cargando reserva...</p>;

  return (
    <div className="container">
      <h2>Pagar Reserva</h2>
      <p><strong>Cancha:</strong> {reserva.canchaId}</p>
      <p><strong>Fecha:</strong> {reserva.fecha}</p>
      <p><strong>Hora:</strong> {reserva.horaInicio} - {reserva.horaFin}</p>
      <p><strong>Total a pagar:</strong> S/ {reserva.precioTotal}</p>

      <div>
        <label>Método de pago:</label>
        <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
          <option value="tarjeta">Tarjeta</option>
          <option value="yape">Yape</option>
        </select>
      </div>

      <div>
        <label>Referencia o código de operación:</label>
        <input
          type="text"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />
      </div>

      <button onClick={pagar}>Pagar ahora</button>
    </div>
  );
}
