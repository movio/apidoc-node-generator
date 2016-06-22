import http from 'http';
import request from 'supertest';
import chai from 'chai';
const expect = chai.expect;

import app from '../server/index';

describe('Generators', () => {
  it('get all generators', (done) => {
    request(http.createServer(app.callback()))
      .get('/generators')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body[0]).to.have.property('key', 'jsonSchema');
        expect(res.body[1]).to.have.property('key', 'reduxSaga');
        done();
      });
  });

  it('get a generator details', (done) => {
    request(http.createServer(app.callback()))
      .get('/generator/jsonSchema')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).to.have.property('key', 'jsonSchema');
        done();
      });
  });
});
