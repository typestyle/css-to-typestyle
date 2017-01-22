import * as assert from 'assert';
import { sanitizeSelector } from '../src/utils/strings';

describe('strings', () => {
  it('sanitizeSelector()', () => {
    assert.equal(sanitizeSelector(`.first \n\t \r.second`), '.first .second');
  });
});
