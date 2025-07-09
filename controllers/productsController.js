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

module.exports = {
  getAllProducts,
  getProductsByCategory // exportar la nueva función
};


