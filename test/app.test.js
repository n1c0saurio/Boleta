let request = require('supertest');
const app = require('../app');
const { response } = require('express');

request = request(app);

describe('Initial redirections', () => {
  
  it('GET /mi-cuenta --> show only if logged in', () => { });

  it('GET /listas --> redirect to / if not logged', () => {
    return request.get('/listas').then(response => {}); // TODO: continue
  });
});
