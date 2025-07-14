// routes/facturas.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const Reservas = db.reservas;
const Pagos = db.pagos;

// GET /facturas/:reservaId
router.get('/:reservaId', async (req, res) => {
  try {
    const reserva = await Reservas.findByPk(req.params.reservaId, {
      include: [
        { model: db.canchas, attributes: ['nombre', 'precio'] },
        { model: Pagos, as: 'historialPagos' }
      ]
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const pago = reserva.historialPagos?.find(p => p.estado === 'completado' || p.estado === 'pagado');

    if (!pago) {
      return res.status(400).json({ error: 'Reserva aún no pagada' });
    }

    res.json({
      reservaId: reserva.id,
      fecha: reserva.fecha,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      cancha: reserva.cancha?.nombre,
      precio: reserva.precioTotal,
      metodo: pago.metodo,
      referencia: pago.referencia,
      pagadoEn: pago.createdAt
    });
  } catch (err) {
    console.error('Error al obtener factura:', err);
    res.status(500).json({ error: 'Error al obtener factura' });
  }
});

module.exports = router;
