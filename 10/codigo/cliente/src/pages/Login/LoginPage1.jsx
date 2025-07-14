import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Turnstile from 'react-turnstile'; // Importa Turnstile
import './LoginPage1.css'; 

function LoginPage1() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true); 
  setError(''); 

  try {
    const payload = { correo, password, captchaToken };

    const res = await axios.post('http://localhost:3001/usuarios/login', payload);
    const { token, user } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoading(false); 

    // ✅ Redirección según rol
    if (user.role === 'usuario') {
      navigate(`/dashboard/usuario/${user.id}`);
    } else if (user.role === 'entidad') {
      navigate(`/dashboard/entidad/${user.id}`);
    } else if (user.role === 'Admin') {
      navigate(`/Admin/${user.id}`);
    } else {
      setError('Rol no reconocido. Por favor, contacta a soporte.');
    }

  } catch (err) {
    setIsLoading(false); 

    const data = err.response?.data;
    setError(data?.error || 'Error al iniciar sesión. Verifica tus credenciales.');
    console.error("Error en el login:", err.response || err.message || err);
  }
};

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        {error && <p className="login-error-message">{error}</p>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="login-correo">Correo Electrónico</label>
            <input
              id="login-correo" 
              type="email"
              placeholder="tu@email.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password" 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* CAPTCHA SIEMPRE VISIBLE */}
          <div className="form-group">
            <label>Verificación de Seguridad</label>
            <Turnstile
              sitekey="0x4AAAAAABkE_EeCCwrHE8PT" // Cambia por tu sitekey real
              onVerify={(token) => setCaptchaToken(token)}
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <div className="login-links">
            <Link to="/recuperar-password" className="link-button">¿Olvidaste tu contraseña?</Link>
            <span>|</span>
            <Link to="/register/cliente" className="link-button">Crear cuenta nueva</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage1;
