const express = require('express');
const cors = require('cors');
const db = require('./src/config/database');
const productoRoutes = require('./src/routes/productoRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API de ShopFlow
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Servidor de ShopFlow en ejecución ');
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});