const db = require('../db');

const getAll = () => {
  // Seleccionamos solo las columnas que se usan en el frontend
  return db.query('SELECT id, nombre, descripcion, precio, imagen FROM productos');
};
const getByCategory = (categoria) => {
  return db.query('SELECT * FROM productos WHERE categoria = ?', [categoria]);
};
module.exports = {
  getAll,
  getByCategory
};
