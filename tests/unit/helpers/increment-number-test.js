import {
  incrementNumber
} from '../../../helpers/increment-number';
import { module, test } from 'qunit';

module('IncrementNumberHelper');

test('it works', function(assert) {
  var result = incrementNumber([2]);
  assert.equal(result, 3);
});
