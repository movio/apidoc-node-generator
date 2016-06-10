import chai from 'chai';
const expect = chai.expect;
import fs from 'fs';
import path from 'path';

import { code } from '../../server/reduxSaga';

describe('Redux Saga Code Gen', () => {
  const getGeneratorExpected = fs.readFileSync(__dirname + '/getGeneratedExpected.txt', 'utf8');

  it('should return generated code', () => {
    const resource = '';
    const operation = '';
    expect(code(resource, operation)).to.equal(getGeneratorExpected);
  });
});
