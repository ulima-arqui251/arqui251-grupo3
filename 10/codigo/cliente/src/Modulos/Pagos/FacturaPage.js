import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function FacturaPage() {
  const { id } = useParams(); 
  const [factura, setFactura] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3001/facturas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setFactura(data);
      } catch (err) {
        alert('Error al cargar factura: ' + err.message);
        navigate('/mis-reservas');
      }
    };

    cargarFactura();
  }, [id]);

  if (!factura) return <p>Cargando factura...</p>;

  return (
    <div className="container">
      <h2>Factura</h2>
      <p><strong>Reserva ID:</strong> {factura.reservaId}</p>
      <p><strong>Fecha:</strong> {factura.fecha}</p>
      <p><strong>Hora:</strong> {factura.horaInicio} - {factura.horaFin}</p>
      <p><strong>Cancha:</strong> {factura.cancha}</p>
      <p><strong>Monto pagado:</strong> S/ {factura.precio}</p>
      <p><strong>Método:</strong> {factura.metodo}</p>
      <p><strong>Referencia:</strong> {factura.referencia}</p>
      <p><strong>Pagado en:</strong> {new Date(factura.pagadoEn).toLocaleString()}</p>
      <button onClick={() => navigate('/mis-reservas')}>Volver</button>
    </div>
  );
}
