import * as _ from 'lodash/fp';

import * as jsonSchema from './jsonSchema';
import * as reduxSaga from './reduxSaga';

const generators = {
  jsonSchema,
  reduxSaga,
};

export default (router) => {
  router
  // Get user data from server using token
    .get('/generators', async ctx => {
      ctx.body = _.map((value) => {
        return value.details;
      }, generators);
    })
    .get('/generator/:id', async ctx => {
      const id = ctx.params.id;
      if (id in generators) ctx.body = generators[id].details;
      else ctx.status = 404;
    });
};
