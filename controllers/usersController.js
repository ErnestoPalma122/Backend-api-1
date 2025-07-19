const db = require('../db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    console.log('Datos recibidos en el backend:', req.body);

  const { nombre, correo, contraseña } = req.body;

  try {
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    // Validación simple de correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
      return res.status(400).json({ message: 'Formato de correo inválido' });
    }

    const [existing] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const sql = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';
    await db.query(sql, [nombre, correo, hashedPassword]);

    res.status(201).json({ mensaje: 'Usuario creado con éxito' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }

};

module.exports = { registerUser };

