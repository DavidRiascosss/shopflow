const Venta = require('../models/ventaModel');

exports.obtenerVentas = (req, res) => {
  Venta.obtenerTodas((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.obtenerVentaPorId = (req, res) => {
  Venta.obtenerPorId(req.params.id, (err, venta) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  });
};

exports.crearVenta = (req, res) => {
  Venta.crear(req.body, (err, nuevaVenta) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json(nuevaVenta);
  });
};