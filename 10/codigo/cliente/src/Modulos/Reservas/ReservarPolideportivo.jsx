import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import polideportivoService from './polideportivoService';
import reservaService from './reservaService';

function ReservarPolideportivo() {
  const { id } = useParams();
  const [poli, setPoli] = useState(null);
  const [selectedCanchas, setSelectedCanchas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await polideportivoService.obtenerPorId(id);
        setPoli(datos);
        setLoading(false);
      } catch (err) {
        setMensaje(err.message);
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const toggleCancha = (canchaId) => {
    setSelectedCanchas((prev) =>
      prev.includes(canchaId)
        ? prev.filter((id) => id !== canchaId)
        : [...prev, canchaId]
    );
  };

  const calcularPrecioTotal = () => {
    const dias =
      fechaInicio && fechaFin
        ? (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24) + 1
        : 1;

    return poli.canchas
      .filter((c) => selectedCanchas.includes(c.id))
      .reduce((sum, c) => sum + parseFloat(c.precio), 0) * dias;
  };

  const hacerReserva = async () => {
    if (!fechaInicio || !fechaFin || !horaInicio || !horaFin || selectedCanchas.length === 0) {
      return setMensaje('Completa todos los campos y selecciona al menos una cancha.');
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser?.id) {
      return setMensaje('Usuario no autenticado.');
    }

    try {
      const reservas = selectedCanchas.map((canchaId) => ({
        fecha: fechaInicio,
        fechaFin,
        horaInicio,
        horaFin,
        canchaId,
        usuarioId: storedUser.id,
        precioTotal: calcularPrecioTotal(),
      }));

      for (const r of reservas) {
        await reservaService.crearReserva(r);
      }

      setMensaje('Reserva creada correctamente');
      setSelectedCanchas([]);
    } catch (err) {
      setMensaje('Error al crear la reserva: ' + err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!poli) return <p>No se encontró el polideportivo.</p>;

  return (
    <div>
      <h2>Reservar Polideportivo: {poli.nombre}</h2>
      <p><strong>Dirección:</strong> {poli.direccion}</p>
      <p><strong>Tipo:</strong> {poli.tipo}</p>

      <h3>Selecciona Canchas</h3>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {poli.canchas.map((cancha) => (
          <div key={cancha.id} style={{ border: '1px solid #ccc', padding: 10 }}>
            <img
              src={`http://localhost:3001/${cancha.imagen}`}
              alt="cancha"
              width={200}
            />
            <p><strong>{cancha.nombre}</strong> - S/ {cancha.precio}</p>
            <label>
              <input
                type="checkbox"
                checked={selectedCanchas.includes(cancha.id)}
                onChange={() => toggleCancha(cancha.id)}
              />
              Seleccionar
            </label>
          </div>
        ))}
      </div>

      <div>
        <h4>Fecha y Hora</h4>
        <label>Inicio:</label><br />
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
        <br /><br />
        <label>Fin:</label><br />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
      </div>

      <div>
        <p><strong>Precio total:</strong> S/ {calcularPrecioTotal().toFixed(2)}</p>
        <button onClick={hacerReserva}>Confirmar Reserva</button>
      </div>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default ReservarPolideportivo;
