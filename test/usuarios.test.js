const request = require('supertest');
const app = require('../app'); // Tu archivo principal de Express
const db = require('../db');

describe('POST /api/users/register', () => {

  afterAll(async () => {
    // Limpieza: eliminar el usuario si fue creado
    await db.execute('DELETE FROM usuarios WHERE correo = ?', ['testuser@example.com']);
    await db.execute('DELETE FROM usuarios WHERE correo = ?', ['correoexistente@example.com']);
    db.end();
  });

  it('✅ debería crear un nuevo usuario con éxito', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        nombre: 'Usuario Prueba',
        correo: 'testuser@example.com',
        contraseña: '123456'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('mensaje', 'Usuario creado con éxito');
  });

  it('❌ debería rechazar creación si falta algún campo', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        nombre: '',
        correo: '',
        contraseña: ''
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Faltan datos');
  });

  it('❌ debería rechazar si el correo ya está registrado', async () => {
    // Crear primero un usuario
    await db.execute(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)',
      ['Usuario Existente', 'correoexistente@example.com', 'fakehashed']
    );

    const res = await request(app)
      .post('/api/users/register')
      .send({
        nombre: 'Otro Usuario',
        correo: 'correoexistente@example.com',
        contraseña: 'otraClave123'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'Correo ya registrado');
  });

  it('❌ debería rechazar si el correo no tiene formato válido', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        nombre: 'Formato Incorrecto',
        correo: 'correo_invalido',
        contraseña: '123456'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Formato de correo inválido');
  });
});

