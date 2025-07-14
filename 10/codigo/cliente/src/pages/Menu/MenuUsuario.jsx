// src/ComponentesGeneral/MenuUsuario.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MenuUsuario() {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const manejarSeleccion = (opcion) => {
    setAbierto(false);
    switch (opcion) {
      case 'perfil':
        navigate('/editar-perfil/1'); // Usa el ID dinámico del usuario si lo tienes
        break;
      case 'reservas':
        navigate('/historial/1');
        break;
      case 'logout':
        localStorage.removeItem('token');
        navigate('/');
        break;
      default:
        break;
    }
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setAbierto(!abierto)}>
        👤 Usuario ▼
      </button>

      {abierto && (
        <div style={{
          position: 'absolute',
          right: 0,
          marginTop: 5,
          border: '1px solid gray',
          backgroundColor: 'white',
          boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
          zIndex: 10,
          minWidth: '150px',
        }}>
          <button onClick={() => manejarSeleccion('perfil')} style={estiloItem}>👤 Mi Perfil</button>
          <button onClick={() => manejarSeleccion('reservas')} style={estiloItem}>📅 Mis Reservas</button>
          <button onClick={() => manejarSeleccion('logout')} style={estiloItem}>🚪 Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
}

const estiloItem = {
  display: 'block',
  width: '100%',
  padding: '10px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
};

export default MenuUsuario;
