import http from 'http';
import request from 'supertest';
import chai from 'chai';
const expect = chai.expect;

import app from '../../server/index';
import { createName } from '../../server/reduxSaga';

import service from '../reduxSaga/generatorService.json';

describe('Redux Saga', () => {
  it('should be able to get list of files from the api', (done) => {
    const invocationForm = { service };

    request(http.createServer(app.callback()))
      .post('/invocations/reduxSaga')
      .send(invocationForm)
      .expect((res) => {
        // console.log(res.body)

        expect(res.body).to.have.deep.property('files[0].name', 'getGenerators');
        expect(res.body).to.have.deep.property('files[0].dir', 'generator');
        expect(res.body).to.have.deep.property('files[1].name', 'getGeneratorsByKey');
        expect(res.body).to.have.deep.property('files[1].dir', 'generator');
      })
      .expect(200, done);
  });

  it('createName', () => {
    expect(createName('GET', '/generators')).to.equal('getGenerators');
    expect(createName('POST', '/generators')).to.equal('postGenerators');
    expect(createName('PUT', '/generators')).to.equal('putGenerators');
    expect(createName('GET', '/generators/person/:id')).to.equal('getGeneratorsAndPersonById');
    expect(createName('GET', '/generators/person/:id/:date'))
      .to.equal('getGeneratorsAndPersonByIdAndDate');
    expect(createName('GET', '/_generators_/person/:id')).to.equal('getGeneratorsAndPersonById');
  });
});
