import HandleBars from 'handlebars';
import fs from 'fs';

import { createName } from './index';

const templateSrc = fs.readFileSync(__dirname + '/mainTemplate.handlebars', 'utf8');
const template = HandleBars.compile(templateSrc);

export default function code(operation) {
  const context = {
    name: createName(operation.method, operation.path),
    method: operation.method.toLowerCase(),
  }
  return template(context);
}
