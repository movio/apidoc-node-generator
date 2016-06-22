import * as _ from 'lodash/fp';

import code from './code';

const details = {
  key: 'reduxSaga',
  name: 'Redux Sagas',
  attributes: [],
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


function createFile(resource, operation) {
  const name = createName(operation.method, operation.path);

  const contents = code(operation);

  return {
    name,
    dir: resource.type,
    contents,
  };
}

function generateCode(service) {
  const files = _.flatMap((resource) => (
    _.map((operation) => (
      createFile(resource, operation)
    ), resource.operations)
  ), service.resources);

  return {
    source: '',
    files,
  };
}

export {
  details,
  generateCode,
  createName,
  code,
};
