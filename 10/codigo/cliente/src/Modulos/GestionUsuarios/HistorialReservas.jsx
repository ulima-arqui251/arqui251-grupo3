import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HistorialReservas() {
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/usuarios/${storedUser.id}/historial`);
        if (res.data.fuente === "logs_respaldo") {
          setMensaje("Mostrando datos de respaldo debido a un error.");
          setHistorial(res.data.data);
        } else {
          setHistorial(res.data);
        }
      } catch (error) {
        console.error(error);
        setMensaje("Error al cargar historial");
      }
    };
    fetchHistorial();
  }, [storedUser]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Historial de Reservas</h2>
      {mensaje && <p>{mensaje}</p>}
      <ul>
        {historial.map((item) => (
          <li key={item.id}>
            {item.descripcion} - {item.fecha}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistorialReservas;
