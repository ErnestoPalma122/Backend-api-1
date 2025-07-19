const db = require('../db');

const registrarCompra = async (req, res) => {
  const { usuarioId, items, total } = req.body;

  try {
    // Validación del total
    const parsedTotal = parseFloat(total);
    if (isNaN(parsedTotal)) {
      return res.status(400).json({ mensaje: 'Total inválido' });
    }

    // Inserta la compra principal
    const [result] = await db.execute(
      'INSERT INTO compras (usuario_id, fecha, total) VALUES (?, NOW(), ?)',
      [usuarioId, parsedTotal]
    );
    const compraId = result.insertId;

    // Inserta los detalles de la compra
    for (const item of items) {
      await db.execute(
        'INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [compraId, item.id, 1, item.precio]
      );
    }

    res.status(201).json({ mensaje: 'Compra registrada correctamente' });
  } catch (error) {
    console.error('Error registrando compra:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


const obtenerHistorial = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const [compras] = await db.execute(`
      SELECT c.id, c.fecha, c.total, d.producto_id, p.nombre, d.precio_unit 
      FROM compras c
      JOIN detalle_compra d ON c.id = d.compra_id
      JOIN productos p ON d.producto_id = p.id
      WHERE c.usuario_id = ?
      ORDER BY c.fecha DESC
    `, [usuarioId]);

    res.json(compras);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { registrarCompra, obtenerHistorial };
