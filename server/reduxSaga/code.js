import HandleBars from 'handlebars';
import fs from 'fs';

const templateSrc = fs.readFileSync(__dirname + '/mainTemplate.handlebars', 'utf8');
const template = HandleBars.compile(templateSrc);

export default function code(resource, operation) {
  const context = {
    operation: 'get',
    resource: 'Todos'
  }
  return template(context);
}
