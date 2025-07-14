const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Ruta base del backend
const BACKEND_URL = 'http://localhost:3001';

// Proxy para todas las APIs principales
app.use('/usuarios', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}));

app.use('/proveedores', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
}));

app.use('/polideportivos', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
}));

app.use('/canchas', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
}));

app.use('/reservas', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
}));

app.use('/pagos', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
}));

app.use('/facturas', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
}));

// Gateway Aggregation route
app.use('/dashboard', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
}));

// Proxy para imágenes estáticas (ej. /uploads/canchas/imagen.jpg)
app.use('/uploads', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
}));

// Inicia el Gateway
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
