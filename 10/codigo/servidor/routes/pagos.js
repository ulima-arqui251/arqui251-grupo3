// routes/pagos.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const Pagos = db.pagos;
const Reservas = db.reservas;

// POST /pagos - Registrar pago
router.post('/', async (req, res) => {
  try {
    const { reservaId, monto, metodo, referencia } = req.body;

    // 🔍 Log de datos entrantes
    console.log(' Datos recibidos para pago:', { reservaId, monto, metodo, referencia });

    // 1. Verificar si la reserva existe
    const reserva = await Reservas.findByPk(reservaId);
    if (!reserva) {
      console.warn(' Reserva no encontrada con ID:', reservaId);
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    // 2. Validar si ya está pagada
    if (reserva.estado === 'pagado') {
      console.warn('La reserva ya fue pagada:', reserva.id);
      return res.status(400).json({ error: 'Reserva ya pagada.' });
    }

    // 3. Crear el pago
    const pago = await Pagos.create({
      reservaId,
      monto,
      metodo,
      referencia,
      estado: 'completado'
    });

    console.log('Pago registrado:', pago.toJSON());

    // 4. Actualizar estado de la reserva
    await reserva.update({ estado: 'pagado' });

    console.log('Reserva actualizada a "pagado":', reserva.id);

    res.status(201).json({ message: 'Pago realizado con éxito', pago });
  } catch (err) {
    console.error('Error exacto al procesar pago:', err);
    res.status(500).json({ error: err.message || 'Error al procesar pago.' });
  }
});

module.exports = router;
