import React, { useState } from 'react';
import RegistroProveedor from './RegistroProveedor';
import CrearSolicitud from './CrearSolicitud';
import Recomendaciones from './Recomendaciones';
import AsignarProveedor from './AsignarProveedor';
import ConfirmarSolicitud from './ConfirmarSolicitud';
import CalificarProveedor from './CalificarProveedor';
import HistorialMantenimiento from './HistorialMantenimiento';
import ProveedoresTablaEditable from './ProveedoresTablaEditable';
import DetalleTodosProveedores from './DetalleTodosProveedores'; 
import './PanelProveedores.css';

const PanelProveedores = () => {
  const [vista, setVista] = useState('registro');

  const renderVista = () => {
    switch (vista) {
      case 'registro':
        return <RegistroProveedor />;
      case 'solicitud':
        return <CrearSolicitud />;
      case 'recomendaciones':
        return <Recomendaciones />;
      case 'asignar':
        return <AsignarProveedor />;
      case 'confirmar':
        return <ConfirmarSolicitud />;
      case 'calificar':
        return <CalificarProveedor />;
      case 'historial':
        return <HistorialMantenimiento />;
      case 'editar':
        return <ProveedoresTablaEditable />;
      case 'detalleTodos':
        return <DetalleTodosProveedores />; // ✅ NUEVO
      default:
        return <RegistroProveedor />;
    }
  };

  return (
    <div className="panel-proveedores">
      <h2>Gestión de Proveedores y Mantenimiento</h2>
      <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button onClick={() => setVista('registro')}>Registro Proveedor</button>
        <button onClick={() => setVista('solicitud')}>Crear Solicitud</button>
        <button onClick={() => setVista('recomendaciones')}>Recomendaciones</button>
        <button onClick={() => setVista('asignar')}>Asignar Proveedor</button>
        <button onClick={() => setVista('confirmar')}>Confirmar Solicitud</button>
        <button onClick={() => setVista('calificar')}>Calificar Proveedor</button>
        <button onClick={() => setVista('historial')}>Historial Mantenimiento</button>
        <button onClick={() => setVista('editar')}>Editar Proveedores</button>
        <button onClick={() => setVista('detalleTodos')}>Ver Todos los Detalles</button> {/* ✅ NUEVO */}
      </nav>

      <div className="contenido">{renderVista()}</div>
    </div>
  );
};

export default PanelProveedores;
