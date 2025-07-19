const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // tu conexión

const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  // ✅ Validación temprana
  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ mensaje: 'Correo no registrado' });
    }

    const usuario = rows[0];

    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordMatch) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, 'secreto', { expiresIn: '1h' });

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { loginUser };
