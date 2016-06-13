import chai from 'chai';
const expect = chai.expect;
import fs from 'fs';

import { code } from '../../server/reduxSaga';

import service from '../reduxSaga/generatorService.json';

describe('Redux Saga Code Gen', () => {
  const getGeneratorExpected = fs.readFileSync(__dirname + '/getGeneratedExpected.txt', 'utf8');

  it('should return generated code', () => {
    const operation = {
      method: 'GET',
      path: 'todos',
      parameters: [],
    }
    expect(code(operation)).to.equal(getGeneratorExpected);
  });
});
