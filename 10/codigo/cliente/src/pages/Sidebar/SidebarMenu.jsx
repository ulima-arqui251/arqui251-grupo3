import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Obtenemos el usuario y rol desde localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id;
  const role = storedUser?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/usuario/login');
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        <ul>
          {userId ? (
            <>
              {role === 'usuario' && (
                <>
                  <li><Link to={`/dashboard/usuario/${userId}`}>Dashboard Usuario</Link></li>
                  <li><Link to={`/editar-perfil/${userId}`}>Editar Perfil</Link></li>
                  <li><Link to={`/historial/${userId}`}>Historial de Reservas</Link></li>
                </>
              )}

              {role === 'entidad' && (
                <>
                  <li><Link to={`/dashboard/usuario/${userId}`}>Dashboard Usuario</Link></li>
                  <li><Link to={`/editar-perfil/${userId}`}>Editar Perfil</Link></li>
                  <li><Link to={`/historial/${userId}`}>Historial de Reservas</Link></li>
                </>
              )}

              {role === 'Admin' && (
                <>
                  <li><Link to="/Admin/Poli">Gestionar Polideportivos</Link></li>
                  <li><Link to="/Admin/canchas">Gestionar canchas</Link></li>
                  <li><Link to="/Admin/provedores">Gestionar Provedores</Link></li>
                  <li><Link to="/Admin/Poli/ver">Ver Polideportivos</Link></li>
                </>
              )}

              <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
            </>
          ) : (
            <li><Link to="/usuario/login">Iniciar Sesión</Link></li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
