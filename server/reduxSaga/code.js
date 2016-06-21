import * as _ from 'lodash/fp';
import Handlebars from 'handlebars';
import fs from 'fs';

import { createName } from './index';

const templateSrc = fs.readFileSync(__dirname + '/mainTemplate.handlebars', 'utf8');
const template = Handlebars.compile(templateSrc);

function parameterList(params, prefix = '', lines = false, suffix = '') {
  const vals = _.map((param) => param.name, params);
  const separator = lines ? ',\n      ' : ', ';
  return prefix + vals.join(separator) + suffix;
}

Handlebars.registerHelper('parameterList', (operation, options) => {
  const body = operation.body ? [{name:'__body'}] : [];
  const prefix = operation.parameters.length > 0 && options.hash.prefix ? options.hash.prefix : '';
  const lines = options.hash.lines ? true : false;
  const suffix = operation.parameters.length > 0 && options.hash.suffix ? options.hash.suffix : '';
  return parameterList(body.concat(operation.parameters), prefix, lines, suffix);
});

Handlebars.registerHelper('toLowerCase', (str) => {
  return str.toLowerCase();
});

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
    parameters
  };

  const context = {
    name: createName(operation.method, operation.path),
    operation,
  };
  return template(context);
}
