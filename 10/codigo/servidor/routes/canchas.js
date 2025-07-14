// routes/canchas.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const Canchas = db.canchas;
const Reservas = db.reservas;
const polideportivos = db.polideportivos;
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento con Multer para subir imágenes de canchas
const storageCancha = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/canchas');
  },
  filename: (req, file, cb) => {
    cb(null, `cancha_${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadCancha = multer({ storage: storageCancha });

// RF1.3 - Filtrar canchas (por tipo, precio, techado, iluminación, polideportivoId)
router.get('/', async (req, res) => {
  try {
    const { tipo, precioMin, precioMax, techado, iluminacion, polideportivoId } = req.query;
    let where = {};

    if (tipo) where.tipo = tipo;
    if (techado !== undefined) where.techado = techado === 'true';
    if (iluminacion !== undefined) where.iluminacion = iluminacion === 'true';
    if (precioMin) where.precio = { [Op.gte]: precioMin };
    if (precioMax) where.precio = { ...(where.precio || {}), [Op.lte]: precioMax };
    if (polideportivoId) where.polideportivoId = polideportivoId;

    const canchas = await Canchas.findAll({ where });
    res.json(canchas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RF1.2 - Ver reservas de una cancha (por ID)
router.get('/:canchaId/reservas', async (req, res) => {
  try {
    const reservas = await Reservas.findAll({
      where: { canchaId: req.params.canchaId }
    });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener cancha por ID
router.get('/:id', async (req, res) => {
  try {
    const cancha = await Canchas.findByPk(req.params.id);
    if (!cancha) return res.status(404).json({ error: 'Cancha no encontrada' });
    res.json(cancha);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear cancha asociada a un polideportivo
router.post('/', async (req, res) => {
  try {
    const { nombre, tipo, estado, precio, techado, iluminacion, imagen, polideportivoId } = req.body;

    const polideportivo = await polideportivos.findByPk(polideportivoId);
    if (!polideportivo) {
      return res.status(404).json({ error: 'Polideportivo no encontrado' });
    }

    const cancha = await Canchas.create({
      nombre,
      tipo,
      estado,
      precio,
      techado,
      iluminacion,
      imagen,
      polideportivoId
    });

    res.status(201).json(cancha);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar cancha
router.put('/:id', async (req, res) => {
  try {
    await Canchas.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Cancha actualizada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar cancha
router.delete('/:id', async (req, res) => {
  try {
    await Canchas.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Cancha eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Subir imagen para una cancha
router.post('/:id/imagen', uploadCancha.single('imagen'), async (req, res) => {
  try {
    const cancha = await Canchas.findByPk(req.params.id);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    cancha.imagen = req.file.path;
    await cancha.save();

    res.json({ mensaje: 'Imagen subida correctamente.', imagen: cancha.imagen });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir imagen.' });
  }
});

module.exports = router;
