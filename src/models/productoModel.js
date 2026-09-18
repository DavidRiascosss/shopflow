const db = require('../config/database');

const Producto = {
  obtenerTodos: (callback) => {
    db.all('SELECT * FROM productos', [], callback);
  },

  obtenerPorId: (id, callback) => {
    db.get('SELECT * FROM productos WHERE id = ?', [id], callback);
  },

  crear: (datos, callback) => {
    const { nombre, precio, stock, categoria } = datos;
    db.run(
      'INSERT INTO productos (nombre, precio, stock, categoria) VALUES (?, ?, ?, ?)',
      [nombre, precio, stock, categoria],
      function (err) {
        callback(err, { id: this ? this.lastID : null, ...datos });
      }
    );
  },

  actualizar: (id, datos, callback) => {
    const { nombre, precio, stock, categoria } = datos;
    db.run(
      'UPDATE productos SET nombre = ?, precio = ?, stock = ?, categoria = ? WHERE id = ?',
      [nombre, precio, stock, categoria, id],
      callback
    );
  },

  eliminar: (id, callback) => {
    db.run('DELETE FROM productos WHERE id = ?', [id], callback);
  }
};

module.exports = Producto;