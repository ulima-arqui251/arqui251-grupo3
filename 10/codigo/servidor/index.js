const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const db = require('./models');

app.use(express.json());
app.use(cors());

// Servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const usuariosRouter = require('./routes/usuarios');
app.use("/usuarios", usuariosRouter);

const proveedoresRouter = require('./routes/proveedores');
app.use("/proveedores", proveedoresRouter);

app.use('/polideportivos', require('./routes/polideportivos'));
app.use('/canchas', require('./routes/canchas'));
app.use('/reservas', require('./routes/reservas'));

// Ruta de pagos
const pagosRouter = require('./routes/pagos');
app.use('/pagos', pagosRouter);

const facturaRouter = require('./routes/facturas');
app.use('/facturas', facturaRouter);

app.use('/', require('./routes/aggregation'));

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Servidor corriendo en puerto 3001");
  });
});
