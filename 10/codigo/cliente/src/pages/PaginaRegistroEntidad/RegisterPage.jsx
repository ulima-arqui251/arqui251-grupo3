import React, { useState } from 'react';
import Turnstile from 'react-turnstile'; // AÑADIDO
import './RegisterPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        identidad: '',
        correo: '',
        password: '',
        confirmPassword: '',
        especialidad: '',
    });

    const [captchaToken, setCaptchaToken] = useState(''); // AÑADIDO

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const registerUser = async (userData) => {
        const { confirmPassword, ...dataToSend } = userData;

        try {
            const response = await fetch('http://localhost:3001/usuarios/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...dataToSend, captchaToken }), // AÑADIDO
            });

            const responseData = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.error || `HTTP error! status: ${response.status}`;
                const errorDetails = responseData.details ? `\nDetalles: ${JSON.stringify(responseData.details)}` : '';
                alert(`Error: ${errorMessage}${errorDetails}`);
                console.error('Error data from server:', responseData);
                return;
            }

            alert('Usuario registrado exitosamente!');
            console.log('Registered user:', responseData);
            setFormData({
                nombre: '', apellido: '', identidad: '', correo: '', password: '', confirmPassword: '', especialidad: ''
            });
            setCaptchaToken(''); // AÑADIDO
        } catch (error) {
            console.error('Error registering user:', error);
            if (error instanceof SyntaxError) {
                alert('Ocurrió un error al procesar la respuesta del servidor.');
            } else {
                alert('Ocurrió un error de red al intentar registrar el usuario.');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden!');
            return;
        }

        if (!formData.nombre || !formData.identidad || !formData.correo || !formData.password || !formData.especialidad) {
            alert('Faltan campos requeridos.');
            return;
        }

        if (!captchaToken) { // AÑADIDO
            alert('Por favor completa el CAPTCHA.');
            return;
        }

        console.log('Form data to be sent:', formData);
        registerUser(formData);
    };

    return (
        <div>
            <h2>Registro de Entidad</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre Entidad:</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div>
                    <label>RUC:</label>
                    <input type="text" name="identidad" value={formData.identidad} onChange={handleChange} required />
                </div>
                <div>
                    <label>Correo Institucional:</label>
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
                    <label>Rol:</label>
                    <select name="especialidad" value={formData.especialidad} onChange={handleChange}>
                        <option value="">Seleccione función</option>
                        <option value="Entidad Musical">Entidad Musical</option>
                        <option value="Entidad Eventos">Entidad Eventos</option>
                        <option value="Entidad Deportiva">Entidad Deportiva</option>
                    </select>
                </div>
                <div>
                    <label>Verificación de Seguridad:</label>
                    <Turnstile
                        sitekey="0x4AAAAAABkE_EeCCwrHE8PT" // CAMBIA por tu Site Key real
                        onVerify={(token) => setCaptchaToken(token)}
                    />
                </div>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default RegisterPage;
