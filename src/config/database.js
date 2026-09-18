const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Archivo local de la base de datos
const dbPath = path.resolve(__dirname, '../../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado exitosamente a la base de datos SQLite (ShopFlow)');
  }
});

// Inicialización de tablas para el sistema POS
db.serialize(() => {
  // Tabla de Productos
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      categoria TEXT,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de Ventas
  db.run(`
    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla Detalle de Ventas (Relación entre ventas y productos)
  db.run(`
    CREATE TABLE IF NOT EXISTS detalle_ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venta_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      FOREIGN KEY (venta_id) REFERENCES ventas (id),
      FOREIGN KEY (producto_id) REFERENCES productos (id)
    )
  `);
});

module.exports = db;