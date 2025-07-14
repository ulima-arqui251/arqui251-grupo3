import React, { useState } from 'react';
import Turnstile from 'react-turnstile'; // AÑADIDO

const RegisterPageCliente = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        identidad: '', // AÑADIDO
        correo: '',
        password: '',
        confirmPassword: '',
    });

    const [captchaToken, setCaptchaToken] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const registerUser = async (userData) => {
        const { confirmPassword, ...dataToSend } = userData;

        try {
            const response = await fetch('http://localhost:3001/usuarios/register/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...dataToSend, captchaToken }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.error || `HTTP error! status: ${response.status}`;
                const errorDetails = responseData.details ? `\nDetalles: ${JSON.stringify(responseData.details)}` : '';
                alert(`Error: ${errorMessage}${errorDetails}`);
                console.error('Error data from server:', responseData);
                return;
            }

            alert('Cliente registrado exitosamente!');
            console.log('Registered client user:', responseData);
            setFormData({
                nombre: '',
                apellido: '',
                identidad: '',
                correo: '',
                password: '',
                confirmPassword: ''
            });
            setCaptchaToken('');
        } catch (error) {
            console.error('Error registering client user:', error);
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

        if (!formData.nombre || !formData.apellido || !formData.identidad || !formData.correo || !formData.password) {
            alert('Faltan campos requeridos.');
            return;
        }

        if (!captchaToken) {
            alert('Por favor completa el CAPTCHA.');
            return;
        }

        console.log('Form data to be sent:', formData);
        registerUser(formData);
    };

    return (
        <div>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Identidad (DNI o RUC):</label>
                    <input
                        type="text"
                        name="identidad"
                        value={formData.identidad}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirmar Contraseña:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Verificación de Seguridad:</label>
                    <Turnstile
                        sitekey="0x4AAAAAABkE_EeCCwrHE8PT" // Reemplaza por tu site key real
                        onVerify={(token) => setCaptchaToken(token)}
                    />
                </div>
                <button type="submit">Registrarse como Usuario</button>
            </form>
        </div>
    );
};

export default RegisterPageCliente;
