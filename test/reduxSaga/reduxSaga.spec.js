import http from 'http';
import request from 'supertest';
import chai from 'chai';
const expect = chai.expect;

import app from '../../server/index';
import { createName, createContents } from '../../server/reduxSaga';

describe('Redux Saga', () => {
    const contents = `// This file is generated

import { takeEvery, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

function api(aPathParam, aQueryParam) {
  return new Promise((resolve) => {
    // Use superagent
    const response = {
      todos: [
        {
          text: 'Use Redux',
          completed: false,
        },
        {
          text: 'Use Saga',
          completed: false,
        },
      ],
    };
    resolve(response);
  });
}

const actionTypes = {
  getTodos_get: 'getTodos/get',
  getTodos_doing: 'getTodos/doing',
  getTodos_success: 'getTodos/success',
  getTodos_failure: 'getTodos/failure',
};

const actions = {
  getTodos_get: (aPathParam, aQueryParam) => ({
    type: actionTypes.getTodos_get,
    payload: {
      aPathParam,
      aQueryParam,
    },
  }),
  getTodos_doing: () => ({
    type: actionTypes.getTodos_doing,
  }),
  getTodos_success: (todos) => ({
    type: actionTypes.getTodos_success,
    payload: todos,
  }),
  getTodos_failure: (err) => ({
    type: actionTypes.getTodos_failure,
    payload: err,
    error: true,
  }),
};

function* saga(action) {
  const { aPathParam, aQueryParam } = action.payload;
  try {
    yield put(actions.getTodos_doing());
    const { response } = yield call(api, aPathParam, aQueryParam);
    yield put(actions.getTodos_success(response));
  } catch (error) {
    yield put(actions.getTodos_failure(error));
  }
}

/**
 * Start this saga if you'd prefer to process every action
 */
function* takeEverySaga() {
  yield* takeEvery(actionTypes.getTodos_get, saga);
}

/**
 * Start this saga if you'd prefer to process only the latest action
 */
function* takeLatestSaga() {
  yield* takeLatest(actionTypes.getTodos_get, saga);
}

export {
  actions,
  actionTypes,
  api,
  saga,
  takeEverySaga,
  takeLatestSaga,
};
`

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
          contents: contents,
        },
        {
          name: 'getGeneratorsByKey',
          dir: 'generator',
          contents: contents,
        },
      ],
    };

    request(http.createServer(app.callback()))
      .post('/invocations/reduxSaga')
      .send(service)
      .expect(200)
      .expect(expected, done);
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

  it('should return generated code', () => {
    const resource = '';
    const operation = '';
    expect(createContents(resource, operation)).to.equal(contents);
  });
});
