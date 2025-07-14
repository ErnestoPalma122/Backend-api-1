const express = require('express');
const router = express.Router();
const { getAllProducts, getProductsByCategory,getProductById } = require('../controllers/productsController');

// Todos los productos
router.get('/', getAllProducts,getProductsByCategory);
// Productos por categoría (ej: /api/products/categoria/Computadoras)

router.get('/categoria/:categoria', getProductsByCategory);

router.get('/:id', getProductById);

module.exports = router;
