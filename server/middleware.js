import compose from 'koa-compose';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';

export default function middleware() {
  return compose([
    logger(),
    bodyParser(),
  ]);
}
