import React, { useState } from 'react';
import Turnstile from 'react-turnstile';
import axios from 'axios';

const Paso1Correo = ({ onNext }) => {
  const [correo, setCorreo] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    if (!captchaToken) {
      setError('Completa el CAPTCHA');
      setEnviando(false);
      return;
    }

    try {
      await axios.post('http://localhost:3001/usuarios/recover/request', { correo });
      onNext({ correo }); // Avanza al siguiente paso
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar código.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleEnviarCodigo}>
      <h3>Recuperar Contraseña</h3>
      <label>Correo asociado a tu cuenta:</label>
      <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      
      <div>
        <label>Verificación CAPTCHA</label>
        <Turnstile
          sitekey="0x4AAAAAABkE_EeCCwrHE8PT"
          onVerify={setCaptchaToken}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar código'}</button>
    </form>
  );
};

export default Paso1Correo;
