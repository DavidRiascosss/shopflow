const Producto = require('../models/productoModel');

exports.obtenerProductos = (req, res) => {
  Producto.obtenerTodos((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.crearProducto = (req, res) => {
  const { nombre, precio, stock } = req.body;
  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
  }

  Producto.crear(req.body, (err, nuevoProducto) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(nuevoProducto);
  });
};

exports.actualizarProducto = (req, res) => {
  Producto.actualizar(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
};

exports.eliminarProducto = (req, res) => {
  Producto.eliminar(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  });
};