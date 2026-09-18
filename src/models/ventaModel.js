const db = require('../config/database');

const Venta = {
  obtenerTodas: (callback) => {
    db.all('SELECT * FROM ventas', [], callback);
  },

  obtenerPorId: (id, callback) => {
    db.get('SELECT * FROM ventas WHERE id = ?', [id], (err, venta) => {
      if (err || !venta) return callback(err, null);
      
      db.all(
        `SELECT dv.*, p.nombre 
         FROM detalle_ventas dv 
         JOIN productos p ON dv.producto_id = p.id 
         WHERE dv.venta_id = ?`,
        [id],
        (err, detalles) => {
          if (err) return callback(err, null);
          callback(null, { ...venta, detalles });
        }
      );
    });
  },

  crear: (datosVenta, callback) => {
    const { items } = datosVenta; // items: [{ producto_id, cantidad, precio_unitario }]
    
    if (!items || items.length === 0) {
      return callback(new Error('La venta debe incluir al menos un producto'));
    }

    const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run('INSERT INTO ventas (total) VALUES (?)', [total], function (err) {
        if (err) {
          db.run('ROLLBACK');
          return callback(err);
        }

        const ventaId = this.lastID;
        let errorOcurrido = null;

        items.forEach((item) => {
          // Insertar en detalle_ventas
          db.run(
            'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [ventaId, item.producto_id, item.cantidad, item.precio_unitario],
            (err) => { if (err) errorOcurrido = err; }
          );

          // Descontar del stock de productos
          db.run(
            'UPDATE productos SET stock = stock - ? WHERE id = ?',
            [item.cantidad, item.producto_id],
            (err) => { if (err) errorOcurrido = err; }
          );
        });

        if (errorOcurrido) {
          db.run('ROLLBACK');
          return callback(errorOcurrido);
        }

        db.run('COMMIT', (err) => {
          if (err) return callback(err);
          callback(null, { id: ventaId, total, items });
        });
      });
    });
  }
};

module.exports = Venta;