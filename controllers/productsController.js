const db = require('../db');
const ProductModel = require('../models/productModel');

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await ProductModel.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  }
};
//metodo de filtrado
const getProductsByCategory = async (req, res) => {
  try {
    const categoria = req.params.categoria;
    const [rows] = await ProductModel.getByCategory(categoria);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos por categoría');
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
};
module.exports = {
  getAllProducts,
  getProductsByCategory, // exportar la nueva función
  getProductById
};


