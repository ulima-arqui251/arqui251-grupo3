import React, { useEffect, useState, useCallback } from 'react';
import servicioGeneral from './servicioGeneral';
import { Link } from 'react-router-dom';

function VistaGeneral() {
  const [polis, setPolis] = useState([]);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ ubicacion: '', tipo: '' });

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
    cargarPolis();
  }, [cargarPolis]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h2>Buscar Polideportivos</h2>

      <div className="filtros">
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
          <div key={p.id} className="poli-card" style={{ border: '1px solid #ccc', marginBottom: 20, padding: 15 }}>
            {p.imagen && (
              <img
                src={`http://localhost:3001/${p.imagen}`}
                alt="Imagen del Polideportivo"
                style={{ width: '100%', maxWidth: 300 }}
              />
            )}
            <h4>{p.nombre}</h4>
            <p><strong>Dirección:</strong> {p.direccion}</p>
            <p><strong>Tipo:</strong> {p.tipo}</p>
            <Link to={`/reservar/polideportivo/${p.id}`}>
              <button>Reservar Polideportivo</button>
            </Link>
          </div>
        ))
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default VistaGeneral;
