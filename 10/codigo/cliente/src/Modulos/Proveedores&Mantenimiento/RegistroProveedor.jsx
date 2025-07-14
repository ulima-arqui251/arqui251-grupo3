import React, { useState, useEffect } from 'react';
import providerService from './providerService';

const RegistroProveedor = () => {
  const [form, setForm] = useState({
    nombre: '',
    especialidad: '',
    correo: '',
    telefono: ''
  });

  const [especialidades, setEspecialidades] = useState([]);

  // Cargar especialidades al montar el componente
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await providerService.obtenerEspecialidades();
        setEspecialidades(response.data);
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
      }
    };

    fetchEspecialidades();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await providerService.registrarProveedor(form);
      alert('Proveedor registrado con éxito');
      setForm({ nombre: '', especialidad: '', correo: '', telefono: '' });
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <select
        name="especialidad"
        value={form.especialidad}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona una especialidad</option>
        {especialidades.map((esp, index) => (
          <option key={index} value={esp}>
            {esp}
          </option>
        ))}
      </select>

      <input
        name="correo"
        type="email"
        placeholder="Correo electrónico"
        value={form.correo}
        onChange={handleChange}
        required
      />
      <input
        name="telefono"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegistroProveedor;
