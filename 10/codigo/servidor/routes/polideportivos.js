const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const path = require('path');
const multer = require('multer');
const db = require('../models');

// Modelos
const Polideportivos = db.polideportivos;
const Canchas = db.canchas;
const Reservas = db.reservas;

// Configuración de Multer para imágenes de polideportivos
const storagePoli = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/polideportivos');
  },
  filename: (req, file, cb) => {
    cb(null, `polideportivo_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadPoli = multer({ storage: storagePoli });


// Obtener todos los polideportivos con canchas y reservas
router.get('/todo', async (req, res) => {
  try {
    const polideportivos = await Polideportivos.findAll({
      include: [{
        model: Canchas,
        include: [Reservas]
      }]
    });

    res.json(polideportivos);
  } catch (err) {
    console.error('Error al obtener todos los polideportivos:', err);
    res.status(500).json({ error: 'Error al obtener todos los polideportivos' });
  }
});

// Filtrar polideportivos por ubicación, tipo, fecha y hora
router.get('/', async (req, res) => {
  try {
    const { ubicacion, tipo, fecha, hora } = req.query;

    let where = {};
    if (ubicacion) where.direccion = { [Op.iLike]: `%${ubicacion}%` };
    if (tipo) where.tipo = tipo;

    const includeReservas = {
      model: Reservas,
      required: false,
      ...(fecha && hora && {
        where: {
          fecha,
          [Op.or]: [
            { horaInicio: { [Op.gt]: hora } },
            { horaFin: { [Op.lt]: hora } }
          ]
        }
      })
    };

    const polideportivos = await Polideportivos.findAll({
      where,
      include: [{
        model: Canchas,
        include: [includeReservas]
      }]
    });

    res.json(polideportivos);
  } catch (err) {
    console.error('Error al obtener polideportivos:', err);
    res.status(500).json({ error: 'Error al obtener polideportivos' });
  }
});

// Crear nuevo polideportivo
router.post('/', async (req, res) => {
  try {
    const { nombre, direccion, tipo, imagen, ubicacionLat, ubicacionLng } = req.body;

    if (!nombre || !direccion) {
      return res.status(400).json({ error: 'Nombre y dirección son obligatorios' });
    }

    const nuevoPolideportivo = await Polideportivos.create({
      nombre,
      direccion,
      tipo,
      imagen,
      ubicacionLat,
      ubicacionLng
    });

    res.status(201).json(nuevoPolideportivo);
  } catch (err) {
    console.error('Error al crear polideportivo:', err);
    res.status(500).json({ error: 'Error al crear el polideportivo' });
  }
});

// Subir imagen de polideportivo
router.post('/:id/imagen', uploadPoli.single('imagen'), async (req, res) => {
  try {
    const poli = await Polideportivos.findByPk(req.params.id);
    if (!poli) {
      return res.status(404).json({ error: 'Polideportivo no encontrado' });
    }

    poli.imagen = req.file.path;
    await poli.save();

    res.json({ mensaje: 'Imagen subida correctamente.', imagen: poli.imagen });
  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).json({ error: 'Error al subir imagen del polideportivo.' });
  }
});
//  Actualizar polideportivo existente
router.put('/:id', async (req, res) => {
  try {
    const poli = await Polideportivos.findByPk(req.params.id);
    if (!poli) {
      return res.status(404).json({ error: 'Polideportivo no encontrado' });
    }

    const { nombre, direccion, tipo } = req.body;

    // Validación simple
    if (!nombre || !direccion) {
      return res.status(400).json({ error: 'Nombre y dirección son obligatorios' });
    }

    await poli.update({ nombre, direccion, tipo });

    res.json({ mensaje: 'Polideportivo actualizado correctamente', polideportivo: poli });
  } catch (err) {
    console.error('Error al actualizar polideportivo:', err);
    res.status(500).json({ error: 'Error al actualizar polideportivo' });
  }
});
// Obtener un polideportivo por ID con sus canchas
router.get('/:id', async (req, res) => {
  try {
    const polideportivo = await db.polideportivos.findByPk(req.params.id, {
      include: [db.canchas]
    });

    if (!polideportivo) {
      return res.status(404).json({ error: 'Polideportivo no encontrado' });
    }

    res.json(polideportivo);
  } catch (err) {
    console.error('Error al obtener el polideportivo por ID:', err);
    res.status(500).json({ error: 'Error al obtener el polideportivo' });
  }
});


module.exports = router;
