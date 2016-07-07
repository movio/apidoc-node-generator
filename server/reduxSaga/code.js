import * as _ from 'lodash/fp';
import Handlebars from 'handlebars';
import fs from 'fs';

import { createName } from './index';

const templateSrc = fs.readFileSync(`${__dirname}/mainTemplate.handlebars`, 'utf8');
const template = Handlebars.compile(templateSrc);

function parameterList(params, lines = false, initUndefined = false, indent=1) {
  return params.map((param) => createParameter(param, initUndefined)).join(`,${lines ? '\n' : ''}${' '.repeat(indent)}`);
}

function createParameter(param, initUndefined) {
  return `${param.name}${initUndefined && ! param.required ? ' = undefined' : ''}`;
}

function createObjectList(params, indent=2) {
  return params.map((param) => `${param.name} ? { ${param.name} } : {}`).join(`,\n${' '.repeat(indent)}`);
}

function createPath(operation) {
  const rex = /:([^\/]+)/gi;
  return operation.path.replace(rex, '\${$1}');
}

Handlebars.registerHelper('parameterList', (operation, options) => {
  const body = operation.body ? [{ name: '__body' }] : [];
  return parameterList(body.concat(operation.parameters), options.hash.lines, options.hash.initUndefined, options.hash.indent);
});

Handlebars.registerHelper('createObjectList', (operation, options) => {
  const body = operation.body ? [{ name: '__body' }] : [];
  return createObjectList(body.concat(operation.parameters.filter((param) => param.location === 'Query')), options.hash.indent);
});

Handlebars.registerHelper('createPath', (operation) => {
  const body = operation.body ? [{ name: '__body' }] : [];
  return createPath(operation);
});

Handlebars.registerHelper('toLowerCase', (str) => str.toLowerCase());

Handlebars.registerHelper('jsdocParameter', (parameter) => {
  const print = (str) => str ? str : '';
  const optionalEquals = parameter.required ? '' : '=';
  const optionalDescription = parameter.required ? '' : ' (Optional)';

  return `* @param {${parameter.type}${optionalEquals}} ${parameter.name} - ${print(parameter.description)}${optionalDescription}`;
});

function removeFormParams(parameters) {
  return _.filter((p) => p.location.toLowerCase() !== 'form', parameters);
}

export default function code(rawOperation) {
  const parameters = removeFormParams(rawOperation.parameters);
  const operation = {
    ...rawOperation,
    parameters,
  };

  const context = {
    name: createName(operation.method, operation.path),
    operation,
  };
  return template(context);
}
