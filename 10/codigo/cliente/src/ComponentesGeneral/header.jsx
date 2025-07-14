import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

function Header() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container px-4">
        <Link className="navbar-brand-custom" to="/">
          SportSync
        </Link>

        <button
          className="navbar-toggler-custom"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavContentHeader"
          aria-controls="navbarNavContentHeader"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon-custom" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavContentHeader">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {/* Menú desplegable Usuario */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                id="usuarioDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Mi Cuenta
              </button>
              <ul className="dropdown-menu" aria-labelledby="usuarioDropdown">
                <li>
                  <Link className="dropdown-item" to="/dashboard/usuario/1">
                    Dashboard Usuario
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/editar-perfil/1">
                    Editar Perfil
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/historial/1">
                    Historial de Reservas
                  </Link>
                </li>
              </ul>
            </li>

            {/* Menú desplegable Otros */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                id="otrosDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Más
              </button>
              <ul className="dropdown-menu" aria-labelledby="otrosDropdown">
                <li>
                  <Link className="dropdown-item" to="/register/usuario">
                    Registro Usuario
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/register/entidad">
                    Registro Entidad
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/proveedores/panel">
                    Panel Proveedores
                  </Link>
                </li>
              </ul>
            </li>

            {/* Login */}
            <li className="nav-item">
              <Link
                className={`nav-link-custom ${location.pathname === '/usuario/login' ? 'active' : ''}`}
                to="/usuario/login"
              >
                Login
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
