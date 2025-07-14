import React, { useState } from 'react';
import Turnstile from 'react-turnstile';

const RegisterPageAdmin = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });

  const [captchaToken, setCaptchaToken] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const registerAdmin = async () => {
    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await fetch('http://localhost:3001/usuarios/register/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dataToSend, role: 'Admin', captchaToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error}`);
        return;
      }

      alert('Administrador registrado correctamente');
      setFormData({ nombre: '', correo: '', password: '', confirmPassword: '' });
      setCaptchaToken('');
    } catch (err) {
      alert('Error al registrar administrador');
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, correo, password, confirmPassword } = formData;

    if (!nombre || !correo || !password) return alert('Completa todos los campos');
    if (password !== confirmPassword) return alert('Las contraseñas no coinciden');
    if (!captchaToken) return alert('Completa el CAPTCHA');

    registerAdmin();
  };

  return (
    <div>
      <h2>Registrar Administrador</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Correo:</label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div>
          <label>Verificación:</label>
          <Turnstile sitekey="0x4AAAAAABkE_EeCCwrHE8PT" onVerify={setCaptchaToken} />
        </div>
        <button type="submit">Registrar Admin</button>
      </form>
    </div>
  );
};

export default RegisterPageAdmin;
