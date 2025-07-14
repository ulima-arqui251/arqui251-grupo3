import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import canchaService from '../Reservas/canchaService';
import reservaService from '../Reservas/reservaService';

export default function CanchaDetallePage() {
  const { id } = useParams();
  const [cancha, setCancha] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    notas: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const c = await canchaService.obtenerCancha(id);
      setCancha(c);
      const r = await canchaService.obtenerReservas(id);
      setReservas(r);
    };
    loadData();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const reservar = async () => {
    try {
      await reservaService.crearReserva({
        canchaId: id,
        ...form
      });
      alert('Reserva realizada');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      {cancha && (
        <>
          <h2>{cancha.nombre}</h2>
          <p>Tipo: {cancha.tipo}</p>
          <p>Precio: {cancha.precio}</p>
          <p>Techado: {cancha.techado ? 'Sí' : 'No'}</p>
          <p>Iluminación: {cancha.iluminacion ? 'Sí' : 'No'}</p>
        </>
      )}

      <h3>Calendario de Reservas</h3>
      {reservas.map(r => (
        <div key={r.id}>
          {r.fecha} - {r.horaInicio} a {r.horaFin} ({r.estado})
        </div>
      ))}

      <h3>Reservar</h3>
      <input name="fecha" type="date" value={form.fecha} onChange={handleChange} />
      <input name="horaInicio" type="time" value={form.horaInicio} onChange={handleChange} />
      <input name="horaFin" type="time" value={form.horaFin} onChange={handleChange} />
      <input name="notas" placeholder="Notas" value={form.notas} onChange={handleChange} />
      <button onClick={reservar}>Reservar</button>
    </div>
  );
}
