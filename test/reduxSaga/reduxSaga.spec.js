import http from 'http';
import request from 'supertest';
import chai from 'chai';
const expect = chai.expect;

import app from '../../server/index';
import reduxSaga from '../../server/reduxSaga';
const createName = reduxSaga.createName;

describe('Redux Saga', () => {
  it('first', (done) => {
    const service = {
      service: {
        resources: [
          {
            type: 'generator',
            plural: 'generators',
            operations: [
              {
                method: 'GET',
                path: '/generators',
                parameters: [
                  {
                    name: 'key',
                    type: 'string',
                    location: 'Query',
                    required: false,
                    description: 'Filter generators with this key',

                  },
                  {
                    name: 'limit',
                    type: 'integer',
                    location: 'Query',
                    required: true,
                    description: 'The number of records to return',
                    default: '100',
                    minimum: 0,
                  },
                  {
                    name: 'offset',
                    type: 'integer',
                    location: 'Query',
                    required: true,
                    description: 'Used to paginate. First page of results is 0.',
                    default: '0',
                    minimum: 0,
                  },
                ],
                responses: [
                  {
                    code: {
                      integer: {
                        value: 200,
                      },
                    },
                    type: '[generator]',
                  },
                ],
                attributes: [],
                description: 'Get all available generators',

              },
              {
                method: 'GET',
                path: '/generators/:key',
                parameters: [
                  {
                    name: 'key',
                    type: 'string',
                    location: 'Path',
                    required: true,
                  },
                ],
                responses: [
                  {
                    code: {
                      integer: {
                        value: 200,
                      },
                    },
                    type: 'generator',
                  },
                  {
                    code: {
                      integer: {
                        value: 404,

                      },
                    },
                    type: 'unit',
                  },
                ],
                attributes: [],
                description: 'Get generator with this key',
              },
            ],
            attributes: [],
            path: '/generators',
          },
        ],
      },
    };

    const expected = {
      files: [
        {
          name: 'getGenerators',
          dir: 'generator',
          contents: 'hey',
        },
        {
          name: 'getGeneratorsByKey',
          dir: 'generator',
          contents: 'hey',
        },
      ],
    };

    request(http.createServer(app.callback()))
      .post('/invocations/reduxSaga')
      .send(service)
      .expect(200)
      .expect(expected, done);
  });

  it('createName', (done) => {
    expect(createName('GET', '/generators')).to.equal('getGenerators');
    expect(createName('POST', '/generators')).to.equal('postGenerators');
    expect(createName('PUT', '/generators')).to.equal('putGenerators');
    expect(createName('GET', '/generators/person/:id')).to.equal('getGeneratorsAndPersonById');
    expect(createName('GET', '/generators/person/:id/:date'))
      .to.equal('getGeneratorsAndPersonByIdAndDate');
    expect(createName('GET', '/_generators_/person/:id')).to.equal('getGeneratorsAndPersonById');
    done();
  });
});
