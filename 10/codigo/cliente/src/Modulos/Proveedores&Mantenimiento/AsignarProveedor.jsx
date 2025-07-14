import React, { useState } from 'react';
import providerService from './providerService';

const AsignarProveedor = () => {
  const [solicitudId, setSolicitudId] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleAsignar = async () => {
    setMensaje('');
    setError('');

    if (!solicitudId || !proveedorId) {
      setError('Debe completar ambos campos');
      return;
    }

    try {
      await providerService.asignarProveedor(solicitudId, proveedorId);
      setMensaje('Proveedor asignado correctamente y registrado en historial');
      setSolicitudId('');
      setProveedorId('');
    } catch (err) {
      console.error(err);
      setError(' Error al asignar proveedor');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Asignar Proveedor a Solicitud</h3>

      <input
        placeholder="ID Solicitud"
        value={solicitudId}
        onChange={e => setSolicitudId(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input
        placeholder="ID Proveedor"
        value={proveedorId}
        onChange={e => setProveedorId(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <button
        onClick={handleAsignar}
        style={{ width: '100%', padding: '0.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Asignar
      </button>

      {mensaje && <p style={{ color: 'green', marginTop: '1rem' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default AsignarProveedor;
