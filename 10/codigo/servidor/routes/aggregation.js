const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/dashboard/proveedores-detalles', async (req, res) => {
  try {
    const proveedores = await db.proveedores.findAll();

    const detalles = await Promise.all(proveedores.map(async (p) => {
      const [calificaciones, solicitudes, historial] = await Promise.all([
        db.calificacionesProveedor.findAll({ where: { proveedorId: p.id } }),
        db.solicitudesServicio.findAll({ where: { proveedorId: p.id } }),
        db.historialMantenimiento.findAll({ where: { proveedorId: p.id } })
      ]);

      const promedio =
        calificaciones.length > 0
          ? (
              calificaciones.reduce((acc, cur) => acc + cur.puntuacion, 0) /
              calificaciones.length
            ).toFixed(2)
          : null;

      return {
        proveedor: p,
        calificaciones,
        solicitudes,
        historial,
        promedio
      };
    }));

    res.json(detalles);
  } catch (err) {
    console.error('Error en gateway aggregation:', err);
    res.status(500).json({ error: 'Error al obtener datos combinados' });
  }
});

module.exports = router;
