import * as _ from 'lodash/fp';

const details = {
  key: 'reduxSaga',
  name: 'Redux Sagas',
};


function createName(method, path) {
  const splits = path.split('/').filter(Boolean).map(s => s.replace(/[_-]/g, '')); // remove empty
  const mainParts = splits.filter((v) => !v.startsWith(':'));
  const paramParts = splits.filter((v) => v.startsWith(':'));

  const main = mainParts.map(s => _.capitalize(s)).join('And');

  const params = paramParts.map(p => p.substring(1)).map(p => _.capitalize(p)).join('And');
  const end = paramParts.length > 0 ? `By${params}` : '';

  return method.toLowerCase() + main + end;
}

function createContents(resource, operation) {
  return `// This file is generated

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
}


function createFile(resource, operation) {
  const name = createName(operation.method, operation.path);

  const contents = createContents(resource, operation);

  return {
    name,
    dir: resource.type,
    contents,
  };
}

function generateCode(service) {
  const files = _.flatMap((resource) => {
    return _.map((operation) => {
      return createFile(resource, operation);
    }, resource.operations);
  }, service.resources);

  return {
    files,
  };
}

export {
  details,
  generateCode,
  createName,
  createContents,
};
