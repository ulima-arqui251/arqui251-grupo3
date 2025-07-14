import React, { useEffect, useState } from 'react';
import providerService from './providerService';
import { toast } from 'react-toastify';
import './ProveedoresTablaEditable.css';

//import 'react-toastify/dist/ReactToastify.css';

const ProveedoresTablaEditable = () => {
  const [proveedores, setProveedores] = useState([]);
  const [editando, setEditando] = useState({});

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const res = await providerService.obtenerRecomendaciones(''); // todas
      setProveedores(res.data);
    } catch (error) {
      toast.error('Error al cargar proveedores');
    }
  };

  const handleEdit = (id, campo, valor) => {
    setEditando(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  const guardarCambios = async (id) => {
    try {
      const datosActualizados = editando[id];
      await providerService.editarProveedor(id, datosActualizados);
      toast.success('Proveedor actualizado correctamente');
      setEditando(prev => {
        const nuevo = { ...prev };
        delete nuevo[id];
        return nuevo;
      });
      cargarProveedores();
    } catch (error) {
      toast.error('Error al actualizar proveedor');
    }
  };

  return (
    <div className="tabla-contenedor">
      <h2>Gestión de Proveedores</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(proveedor => {
            const enEdicion = editando[proveedor.id] || {};
            return (
              <tr key={proveedor.id}>
                <td>
                  <input
                    value={enEdicion.nombre ?? proveedor.nombre}
                    onChange={(e) => handleEdit(proveedor.id, 'nombre', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    value={enEdicion.especialidad ?? proveedor.especialidad}
                    onChange={(e) => handleEdit(proveedor.id, 'especialidad', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="email"
                    value={enEdicion.correo ?? proveedor.correo}
                    onChange={(e) => handleEdit(proveedor.id, 'correo', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    value={enEdicion.telefono ?? proveedor.telefono}
                    onChange={(e) => handleEdit(proveedor.id, 'telefono', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <button onClick={() => guardarCambios(proveedor.id)}>💾 Guardar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedoresTablaEditable;
