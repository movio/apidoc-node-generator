import chai from 'chai';
const expect = chai.expect;
import fs from 'fs';

import { code } from '../../server/reduxSaga';

describe('Redux Saga Code Gen', () => {
  const getTodos = fs.readFileSync(`${__dirname}/getTodosExpected.txt`, 'utf8');
  const getTodosByKey1AndKey2 =
          fs.readFileSync(`${__dirname}/getTodosByKey1AndKey2Expected.txt`, 'utf8');
  const postTodosByKey = fs.readFileSync(`${__dirname}/postTodosByKeyExpected.txt`, 'utf8');

  it('should create code for GET with no params', () => {
    const operation = {
      method: 'GET',
      path: 'todos',
      parameters: [],
    };
    expect(code(operation)).to.equal(getTodos);
  });

  it('should create code for GET with keys', () => {
    const operation = {
      method: 'GET',
      path: 'todos/:key1/:key2',
      description: 'All the things',
      parameters: [
        {
          name: 'key1',
          location: 'Path',
          type: 'string',
          required: true,
          description: 'the first key',
        },
        {
          name: 'key2',
          location: 'Path',
          type: 'integer',
          required: true,
          description: 'the second key',
        },
        {
          name: 'firstName',
          location: 'Query',
          type: 'string',
          required: true,
          description: 'first comes before last',
        },
        {
          name: 'lastName',
          location: 'Query',
          type: 'string',
          required: false,
          description: 'last name',
        },
      ],
    };
    expect(code(operation)).to.equal(getTodosByKey1AndKey2);
  });

  it('should create code for POST', () => {
    const operation = {
      method: 'POST',
      path: 'todos',
      body: { type: 'string' },
      parameters: [
        {
          name: 'key',
          location: 'Query',
          type: 'string',
          required: true,
        },
        {
          name: 'shouldBeIgnored',
          location: 'Form',
          type: 'string',
          required: false,
        },
      ],
    };
    // fixme - add params
    expect(code(operation)).to.equal(postTodosByKey);
  });
});
