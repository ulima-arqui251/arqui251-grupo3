const express = require('express');
const router = express.Router();
const { usuarios } = require("../models");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

// Validación identidad Perú
function validarIdentidadPeru(role, identidad) {
  if (role === "entidad") {
    const rucRegex = /^(10|15|17|20)\d{9}$/;
    if (!rucRegex.test(String(identidad))) {
      throw new Error("El RUC debe tener 11 dígitos y comenzar con 10, 15, 17 o 20.");
    }
  }
  if (role === "usuario") {
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(String(identidad))) {
      throw new Error("El DNI debe tener 8 dígitos numéricos.");
    }
  }
}

// Verificación CAPTCHA
async function verifyCaptcha(token) {
  if (!token) {
    throw new Error("CaptchaToken requerido.");
  }

  const secret = process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAABkE_MRBF0nalB7lG9nLflnc3vo";
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const res = await axios.post(
    url,
    new URLSearchParams({
      secret,
      response: token
    })
  );

  if (!res.data.success) {
    console.error("Error en verificación CAPTCHA:", res.data);
    throw new Error("Verificación CAPTCHA fallida.");
  }
}

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `user_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Listar usuarios
router.get("/", async (req, res) => {
  const listaUsuarios = await usuarios.findAll();
  res.json(listaUsuarios);
});

// Crear usuario genérico
router.post("/", async (req, res) => {
  const usuario = req.body;
  await usuarios.create(usuario);
  res.json(usuario);
});

// Registro entidad
router.post("/register", async (req, res) => {
  const { nombre, identidad, correo, password, especialidad, captchaToken } = req.body;

  if (!nombre || !identidad || !correo || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  try {
    await verifyCaptcha(captchaToken);

    validarIdentidadPeru("entidad", identidad);

    const newUser = await usuarios.create({
      nombre,
      apellido: "Entidad",
      identidad,
      correo,
      password,
      role: "entidad",
      especialidad
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creando entidad:", error);

    if (error.message.includes("Captcha")) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes("RUC")) {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: "Correo ya registrado." });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: "Datos inválidos.", details: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: "Error interno al crear usuario." });
  }
});

// Registro usuario cliente
router.post("/register/usuario", async (req, res) => {
  const { nombre, apellido, identidad, correo, password, captchaToken } = req.body;

  if (!nombre || !apellido || !correo || !password || !identidad) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  try {
    await verifyCaptcha(captchaToken);

    validarIdentidadPeru("usuario", identidad);

    const newUser = await usuarios.create({
      nombre,
      apellido,
      identidad,
      correo,
      password,
      role: "usuario"
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creando usuario:", error);

    if (error.message.includes("Captcha")) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes("DNI")) {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: "Correo ya registrado." });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: "Datos inválidos.", details: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: "Error interno al crear usuario." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { correo, password, captchaToken } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña requeridos." });
  }

  try {
    await verifyCaptcha(captchaToken);

    const user = await usuarios.findOne({ where: { correo } });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado." });
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        correo: user.correo,
        nombre: user.nombre,
      },
      process.env.JWT_SECRET || "clave_secreta_123",
      { expiresIn: "1d" }
    );

    const userData = user.toJSON();
    delete userData.password;

    res.json({ mensaje: "Login exitoso", token, user: userData });
  } catch (error) {
    console.error("Error en login:", error);

    if (error.message.includes("Captcha")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error en el servidor al hacer login." });
  }
});

// Obtener perfil
router.get("/me", authMiddleware(), async (req, res) => {
  try {
    const user = await usuarios.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }
    });
    res.json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil." });
  }
});

// Actualizar perfil
router.put("/me", authMiddleware(), async (req, res) => {
  const { nombre, apellido, especialidad, identidad } = req.body;

  try {
    const user = await usuarios.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    if (identidad) {
      validarIdentidadPeru(user.role, identidad);
      user.identidad = identidad;
    }

    if (user.role === "entidad") {
      user.apellido = "Entidad";
    } else {
      user.apellido = apellido ?? user.apellido;
    }

    user.nombre = nombre ?? user.nombre;
    user.especialidad = especialidad ?? user.especialidad;

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(400).json({ error: error.message || "Error al actualizar perfil." });
  }
});

// Subir avatar
router.post("/me/avatar", authMiddleware(), upload.single("avatar"), async (req, res) => {
  try {
    const user = await usuarios.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    user.fotoPerfil = req.file.path;
    await user.save();

    res.json({ mensaje: "Avatar cargado correctamente.", fotoPerfil: user.fotoPerfil });
  } catch (error) {
    console.error("Error al subir avatar:", error);
    res.status(500).json({ error: "Error al subir avatar." });
  }
});
// Recuperación de contraseña

const { enviarCodigoRecuperacion } = require("../utils/emailService");
const bcrypt = require("bcrypt"); 

// In-memory store (solo para demo; en producción usa DB o Redis)
const recoveryCodes = new Map();

/**
 * 1. Solicitar recuperación
 */
router.post("/recover/request", async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ error: "Correo requerido." });
  }

  try {
    const user = await usuarios.findOne({ where: { correo } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Generar un código simple de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar en memoria (clave=correo)
    recoveryCodes.set(correo, {
      codigo,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutos
    });

    // Enviar correo
    await enviarCodigoRecuperacion(correo, codigo);

    res.json({ mensaje: "Se ha enviado un código de recuperación a tu correo." });
  } catch (error) {
    console.error("Error en recuperación:", error);
    res.status(500).json({ error: "Error al solicitar recuperación." });
  }
});

/**
 * 2. Verificar código
 */
router.post("/recover/verify", async (req, res) => {
  const { correo, codigo } = req.body;

  const record = recoveryCodes.get(correo);

  if (!record || record.codigo !== codigo) {
    return res.status(400).json({ error: "Código inválido o expirado." });
  }

  if (record.expiresAt < Date.now()) {
    recoveryCodes.delete(correo);
    return res.status(400).json({ error: "El código ha expirado." });
  }

  res.json({ mensaje: "Código válido." });
});

/**
 * 3. Restablecer contraseña
 */
router.post("/recover/reset", async (req, res) => {
  const { correo, codigo, nuevaPassword } = req.body;

  const record = recoveryCodes.get(correo);

  if (!record || record.codigo !== codigo) {
    return res.status(400).json({ error: "Código inválido o expirado." });
  }

  if (record.expiresAt < Date.now()) {
    recoveryCodes.delete(correo);
    return res.status(400).json({ error: "El código ha expirado." });
  }

  try {
    const user = await usuarios.findOne({ where: { correo } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    //  Hashear la nueva contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(nuevaPassword, salt);

    await user.save();

    // Eliminar código usado
    recoveryCodes.delete(correo);

    res.json({ mensaje: "Contraseña restablecida correctamente." });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    res.status(500).json({ error: "Error al actualizar contraseña." });
  }
},
// Registro administrador
router.post("/register/admin", async (req, res) => {
  const { nombre, correo, password, captchaToken } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  try {
    await verifyCaptcha(captchaToken);

    const existente = await usuarios.findOne({ where: { correo } });
    if (existente) {
      return res.status(409).json({ error: "Correo ya registrado." });
    }

    const newUser = await usuarios.create({
      nombre,
      apellido: "Administrador",
      identidad: null,
      correo,
      password,
      role: "Admin",
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creando admin:", error);

    if (error.message.includes("Captcha")) {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: "Datos inválidos.",
        details: error.errors.map(e => e.message),
      });
    }

    res.status(500).json({ error: "Error interno al crear administrador." });
  }
}));

module.exports = router;
