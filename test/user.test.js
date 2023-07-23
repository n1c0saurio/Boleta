let request = require('supertest');
const app = require('../app');
const models = require('../db/models');
const user = require('../controllers/user');
const { response } = require('express');

request = request(app);

beforeAll(async () => {
  await models.sequelize.sync({ force: true });

  await models.Role.bulkCreate([
    {
      id: 'admin',
      name: 'Admin',
      description: 'Test admin role'
    },
    {
      id: 'enduser',
      name: 'Regular User',
      description: 'Test regular user'
    }
  ]);
});

afterAll(() => {
  models.sequelize.close();
});

describe('User sessions...', () => {

  test('POST / --> login with incorrect credentials', () => {
    return request
      .post('/')
      .type('form')
      .send({
        email: 'unregistered@email.com',
        password: 'password'
      })
      .then(res => {
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/^\/(\?.*)?$/);
      });
  });

  // test

  test('POST /registro --> create new account succesfully', () => {
    return request
      .post('/registro')
      .type('form')
      .send({
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'valid@email.com',
        password: 'Valid_12345',
        passwordConfirmation: 'Valid_12345'
      })
      .then(res => {
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/^\/listas(\?.*)?$/);
      })
  });

  test('POST / --> redirect to /listas when logged in', () => { });
});
