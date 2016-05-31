import compose from 'koa-compose';
import Router from 'koa-router';

import generators from './generators';

export default function routes() {
  const router = new Router();

  generators(router);

  return compose([
    router.routes(),
    router.allowedMethods(),
  ]);
}
