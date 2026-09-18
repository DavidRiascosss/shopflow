const express = require('express');
const cors = require('cors');
const db = require('./src/config/database');
const productoRoutes = require('./src/routes/productoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/productos', productoRoutes);

app.get('/', (req, res) => {
  res.send('Servidor de ShopFlow en ejecución ');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});