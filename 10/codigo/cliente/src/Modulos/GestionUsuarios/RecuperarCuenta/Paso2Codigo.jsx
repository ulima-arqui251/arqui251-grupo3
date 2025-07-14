import React, { useState } from 'react';
import axios from 'axios';

const Paso2Codigo = ({ correo, onNext }) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');

  const handleVerificar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/usuarios/recover/verify', { correo, codigo });
      onNext({ correo, codigo });
    } catch (err) {
      setError(err.response?.data?.error || 'Código incorrecto.');
    }
  };

  return (
    <form onSubmit={handleVerificar}>
      <h3>Ingresa el código de verificación</h3>
      <p>Revisa tu correo electrónico.</p>
      <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} required maxLength={6} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Verificar código</button>
    </form>
  );
};

export default Paso2Codigo;
