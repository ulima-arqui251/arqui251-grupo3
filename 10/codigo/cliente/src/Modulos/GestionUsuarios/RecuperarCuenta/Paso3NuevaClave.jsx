import React, { useState } from 'react';
import axios from 'axios';

const Paso3NuevaClave = ({ correo, codigo, onDone }) => {
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/usuarios/recover/reset', {
        correo,
        codigo,
        nuevaPassword
      });
      onDone();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña.');
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h3>Establece una nueva contraseña</h3>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaPassword}
        onChange={(e) => setNuevaPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmarPassword}
        onChange={(e) => setConfirmarPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Guardar contraseña</button>
    </form>
  );
};

export default Paso3NuevaClave;
