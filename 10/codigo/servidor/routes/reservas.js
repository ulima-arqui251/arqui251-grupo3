const express = require('express');
const router = express.Router();
const db = require('../models');
const Reservas = db.reservas;
const { Op } = require('sequelize');
const verificarToken = require('../middlewares/authMiddleware');

// RF1.4 - Crear reserva (con validación de disponibilidad)
router.post('/', verificarToken(), async (req, res) => {
  try {
    const { canchaId, fecha, fechaFin, horaInicio, horaFin, usuarioId } = req.body;

    // Verificar si hay una reserva pagada que se cruce con el periodo
    const reservaExistente = await Reservas.findOne({
      where: {
        canchaId,
        estado: 'pagado',
        fecha: { [Op.lte]: fechaFin },
        fechaFin: { [Op.gte]: fecha }
      }
    });

    if (reservaExistente) {
      return res.status(409).json({ error: ' La cancha ya está reservada para este periodo.' });
    }

    const reserva = await Reservas.create({
      ...req.body,
      usuarioId: req.user.id // asegura que el usuario actual sea el que reserva
    });

    res.status(201).json(reserva);
  } catch (err) {
    console.error('Error al crear reserva:', err);
    res.status(400).json({ error: err.message || 'Error al crear la reserva' });
  }
});

// RF1.6 - Cambiar estado (aprobar / cancelar / pagado)
router.put('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    const updated = await Reservas.update(
      { estado },
      { where: { id: req.params.id } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ message: 'Estado actualizado correctamente' });
  } catch (err) {
    console.error('Error al cambiar estado:', err);
    res.status(400).json({ error: err.message });
  }
});

// RF1.7 - Ver reserva por ID
router.get('/:id', async (req, res) => {
  try {
    const reserva = await Reservas.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(reserva);
  } catch (err) {
    console.error(' Error al obtener reserva:', err);
    res.status(500).json({ error: err.message });
  }
});

// RF1.X - Ver historial de reservas del usuario autenticado
router.get('/usuario/reservas', verificarToken(), async (req, res) => {
  try {
    const reservas = await db.reservas.findAll({
      where: { usuarioId: req.user.id },
      order: [['fecha', 'DESC']],
    });

    res.json(reservas);
  } catch (err) {
    console.error( 'Error al obtener reservas del usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
