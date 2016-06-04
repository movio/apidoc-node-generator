import * as _ from 'lodash/fp';

import jsonSchema from './jsonSchema';
import * as reduxSaga from './reduxSaga';

const generators = {
  jsonSchema,
  reduxSaga,
};

export default (router) => {
  router
    .get('/generators', async ctx => {
      ctx.body = _.map((value) => {
        return value.details;
      }, generators);
    })
    .get('/generator/:id', async ctx => {
      const id = ctx.params.id;
      if (id in generators) ctx.body = generators[id].details;
      else ctx.status = 404;
    })
    .post('/invocations/:id', async ctx => {
      const id = ctx.params.id;
      const service = ctx.request.body.service;
      if (id in generators) ctx.body = generators[id].generateCode(service);
      else ctx.status = 404;
    });
};
