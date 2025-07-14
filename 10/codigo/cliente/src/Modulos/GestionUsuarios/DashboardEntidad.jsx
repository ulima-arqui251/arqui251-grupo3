import React, { useEffect, useState, useCallback } from 'react';
import servicioGeneral from './servicioGeneral';

function VistaGeneral() {
  const [polis, setPolis] = useState([]);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    ubicacion: '',
    tipo: '',
  });

  const cargarPolis = useCallback(async (aplicarFiltros = false) => {
    try {
      const datosPolis = await servicioGeneral.obtenerPolideportivos(
        aplicarFiltros ? filtros : {}
      );
      setPolis(datosPolis);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [filtros]);

  useEffect(() => {
    cargarPolis(); // sin filtros al iniciar
  }, [cargarPolis]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>Buscar Polideportivos</h2>

      <div>
        <input
          name="ubicacion"
          placeholder="Ubicación"
          value={filtros.ubicacion}
          onChange={handleInputChange}
        />
        <input
          name="tipo"
          placeholder="Tipo"
          value={filtros.tipo}
          onChange={handleInputChange}
        />
        <button onClick={() => cargarPolis(true)}>Buscar</button>
      </div>

      <h3>Resultados</h3>
      {polis.length === 0 ? (
        <p>No hay polideportivos.</p>
      ) : (
        polis.map(p => (
          <div key={p.id}>
            <strong>{p.nombre}</strong> - {p.direccion}
            {p.canchas?.length > 0 && (
              <ul>
                {p.canchas.map(c => (
                  <li key={c.id}>{c.nombre} - {c.tipo}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}

      {error && <p>{error}</p>}
    </div>
  );
}

export default VistaGeneral;
