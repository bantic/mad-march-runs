import {
  includesItem
} from '../../../helpers/includes-item';
import { module, test } from 'qunit';

module('IncludesItemHelper');

test('it works', function(assert) {
  var result = includesItem(['a', ['a','b','c']]);
  assert.ok(result);
});
