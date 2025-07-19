const request = require('supertest');
const app = require('../app'); // ✅ Ahora que tienes app.js exportando Express

// ⚠️ Asegúrate de que este usuario exista en la base de datos con la contraseña hasheada
const loginValido = {
  correo: 'erickernestoamaya@gmail.com',
  contraseña: '350122'
};

describe('POST /api/auth/login', () => {

  it('debería iniciar sesión con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(loginValido);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Login exitoso');
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('usuario');
  });

  it('debería rechazar con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        correo: loginValido.correo,
        contraseña: 'claveIncorrecta'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('mensaje', 'Contraseña incorrecta');
  });

  it('debería rechazar si el correo no existe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'noexiste@correo.com',
        contraseña: 'algo'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('mensaje', 'Correo no registrado');
  });

  it('debería rechazar si faltan datos', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: loginValido.correo });

    expect(res.statusCode).toBe(400); // ✅ ahora que se valida bien
expect(res.body).toHaveProperty('mensaje', 'Correo y contraseña son requeridos');
  });

});
