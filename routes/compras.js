const express = require('express');
const router = express.Router();
const { registrarCompra, obtenerHistorial } = require('../controllers/comprasController');

router.post('/', registrarCompra); // POST /api/compras
router.get('/:usuarioId', obtenerHistorial); // GET /api/compras/:usuarioId

module.exports = router;